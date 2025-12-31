import KalkulatorPosadzkiClient from "./kalkulator-posadzki-client"

interface CalculatorData {
    surfaceTypes: any[]
    colors: any[]
    services: any[]
}

async function getCalculatorConfig(): Promise<CalculatorData> {
    try {
        // Fetch from API in server component
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/admin/calculator-settings`, {
            cache: 'no-store', // Don't cache to always get fresh data
        })
        
        if (response.ok) {
            return await response.json()
        }
    } catch (error) {
        console.error('Error loading calculator config:', error)
    }
    
    // Return empty data structure if fetch fails
    return {
        surfaceTypes: [],
        colors: [],
        services: []
    }
}

export default async function KalkulatorPosadzki() {
    const calculatorData = await getCalculatorConfig()
    
    return <KalkulatorPosadzkiClient initialData={calculatorData} />
}
