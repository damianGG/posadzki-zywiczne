'use client';

/**
 * Admin Panel - Google Drive Synchronization
 * 
 * Interfejs administratora do synchronizacji realizacji z Google Drive
 */

import { useState, useEffect } from 'react';
import { GoogleDriveAgent, createGoogleDriveAgent } from '@/lib/google-drive-agent';
import { Realizacja } from '@/types/realizacje';

interface SyncResult {
  slug: string;
  data: Partial<Realizacja>;
  status: string;
}

export default function GoogleDriveSyncPage() {
  const [agent, setAgent] = useState<GoogleDriveAgent | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Dodaj log
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('pl-PL');
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Inicjalizacja agenta
  useEffect(() => {
    const initAgent = async () => {
      try {
        const newAgent = createGoogleDriveAgent();
        
        if (!newAgent) {
          setError('Nie można utworzyć agenta. Sprawdź konfigurację zmiennych środowiskowych.');
          addLog('❌ Błąd: Brak wymaganych zmiennych środowiskowych');
          return;
        }

        await newAgent.initialize();
        setAgent(newAgent);
        setIsInitialized(true);
        addLog('✓ Agent Google Drive zainicjalizowany');
      } catch (err) {
        setError(`Błąd inicjalizacji: ${err}`);
        addLog(`❌ Błąd inicjalizacji: ${err}`);
      }
    };

    initAgent();
  }, []);

  // Autoryzacja
  const handleAuthorize = async () => {
    if (!agent) return;

    try {
      addLog('🔐 Rozpoczęcie autoryzacji...');
      await agent.authorize();
      setIsAuthorized(true);
      addLog('✓ Autoryzacja pomyślna');
    } catch (err) {
      setError(`Błąd autoryzacji: ${err}`);
      addLog(`❌ Błąd autoryzacji: ${err}`);
    }
  };

  // Wylogowanie
  const handleSignOut = () => {
    if (!agent) return;
    
    agent.signOut();
    setIsAuthorized(false);
    addLog('✓ Wylogowano');
  };

  // Synchronizacja
  const handleSync = async () => {
    if (!agent || !isAuthorized) return;

    try {
      setIsSyncing(true);
      setSyncResults([]);
      addLog('🔄 Rozpoczęcie synchronizacji z Google Drive...');

      // Pobierz dane z Google Drive
      const results = await agent.syncRealizations();
      setSyncResults(results);

      // Zapisz każdą realizację przez API
      for (const result of results) {
        if (result.status === 'success' && result.data.slug) {
          addLog(`💾 Zapisywanie: ${result.data.title || result.slug}...`);
          
          const saved = await agent.saveRealizacja(result.data);
          
          if (saved) {
            addLog(`✓ Zapisano: ${result.slug}`);
            
            // Wywołaj revalidation
            await agent.triggerRevalidation(result.slug);
            addLog(`♻️ Revalidation: /realizacje/${result.slug}`);
          } else {
            addLog(`❌ Błąd zapisu: ${result.slug}`);
          }
        } else {
          addLog(`⚠️ Pominięto: ${result.slug} (${result.status})`);
        }
      }

      addLog(`✓ Synchronizacja zakończona. Przetworzono ${results.length} elementów.`);
    } catch (err) {
      setError(`Błąd synchronizacji: ${err}`);
      addLog(`❌ Błąd synchronizacji: ${err}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Czyszczenie logów
  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Synchronizacja Google Drive</h1>
          <p className="text-gray-600">
            Panel administratora do automatycznej aktualizacji realizacji z Google Drive
          </p>
        </div>

        {/* Status i Kontrole */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Inicjalizacja</div>
              <div className="text-lg font-semibold">
                {isInitialized ? (
                  <span className="text-green-600">✓ Gotowy</span>
                ) : (
                  <span className="text-yellow-600">⏳ Ładowanie...</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Autoryzacja</div>
              <div className="text-lg font-semibold">
                {isAuthorized ? (
                  <span className="text-green-600">✓ Zalogowany</span>
                ) : (
                  <span className="text-gray-500">✗ Nie zalogowany</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Synchronizacja</div>
              <div className="text-lg font-semibold">
                {isSyncing ? (
                  <span className="text-blue-600">⏳ W toku...</span>
                ) : (
                  <span className="text-gray-500">Gotowy</span>
                )}
              </div>
            </div>
          </div>

          {/* Przyciski akcji */}
          <div className="flex flex-wrap gap-3">
            {!isAuthorized ? (
              <button
                onClick={handleAuthorize}
                disabled={!isInitialized}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                🔐 Zaloguj się do Google Drive
              </button>
            ) : (
              <>
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSyncing ? '⏳ Synchronizacja...' : '🔄 Synchronizuj realizacje'}
                </button>
                
                <button
                  onClick={handleSignOut}
                  disabled={isSyncing}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  🚪 Wyloguj
                </button>
              </>
            )}
          </div>

          {/* Błędy */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <strong>Błąd:</strong> {error}
            </div>
          )}
        </div>

        {/* Wyniki synchronizacji */}
        {syncResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Wyniki synchronizacji ({syncResults.length})
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Slug</th>
                    <th className="px-4 py-2 text-left">Tytuł</th>
                    <th className="px-4 py-2 text-left">Lokalizacja</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {syncResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-sm">{result.slug}</td>
                      <td className="px-4 py-2">{result.data.title || '-'}</td>
                      <td className="px-4 py-2">{result.data.location || '-'}</td>
                      <td className="px-4 py-2">
                        {result.status === 'success' ? (
                          <span className="text-green-600 font-semibold">✓ Sukces</span>
                        ) : (
                          <span className="text-red-600 font-semibold">✗ {result.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Logi */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Logi ({logs.length})</h2>
            <button
              onClick={handleClearLogs}
              className="px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Wyczyść
            </button>
          </div>
          
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">Brak logów...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instrukcje */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">📖 Instrukcja użytkowania</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Upewnij się, że zmienne środowiskowe Google Drive są poprawnie skonfigurowane</li>
            <li>Kliknij &ldquo;Zaloguj się do Google Drive&rdquo; i zaakceptuj wymagane uprawnienia</li>
            <li>Kliknij &ldquo;Synchronizuj realizacje&rdquo; aby pobrać dane z Google Drive</li>
            <li>System automatycznie zapisze dane i wywoła revalidation stron</li>
            <li>Sprawdź logi aby zobaczyć szczegóły procesu synchronizacji</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
