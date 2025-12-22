import crypto from 'crypto';

export interface Przelewy24Config {
  merchantId: string;
  posId: string;
  crc: string;
  apiKey: string;
  sandbox: boolean;
}

export interface Przelewy24Transaction {
  sessionId: string;
  amount: number; // in grosze (1 PLN = 100 grosze)
  currency: string;
  description: string;
  email: string;
  country: string;
  language: string;
  urlReturn: string;
  urlStatus: string;
}

export interface Przelewy24RegisterResponse {
  data: {
    token: string;
  };
}

/**
 * Get Przelewy24 configuration from environment variables
 */
export function getPrzelewy24Config(): Przelewy24Config {
  return {
    merchantId: process.env.PRZELEWY24_MERCHANT_ID || '',
    posId: process.env.PRZELEWY24_POS_ID || '',
    crc: process.env.PRZELEWY24_CRC || '',
    apiKey: process.env.PRZELEWY24_API_KEY || '',
    sandbox: process.env.PRZELEWY24_SANDBOX === 'true',
  };
}

/**
 * Get Przelewy24 API base URL
 */
export function getPrzelewy24ApiUrl(sandbox: boolean): string {
  return sandbox
    ? 'https://sandbox.przelewy24.pl/api/v1'
    : 'https://secure.przelewy24.pl/api/v1';
}

/**
 * Get Przelewy24 payment URL
 */
export function getPrzelewy24PaymentUrl(sandbox: boolean): string {
  return sandbox
    ? 'https://sandbox.przelewy24.pl/trnRequest'
    : 'https://secure.przelewy24.pl/trnRequest';
}

/**
 * Calculate Przelewy24 signature (CRC)
 */
export function calculatePrzelewy24Sign(params: {
  sessionId: string;
  merchantId: string;
  amount: number;
  currency: string;
  crc: string;
}): string {
  const { sessionId, merchantId, amount, currency, crc } = params;
  const signString = `{"sessionId":"${sessionId}","merchantId":${merchantId},"amount":${amount},"currency":"${currency}","crc":"${crc}"}`;
  return crypto.createHash('sha384').update(signString).digest('hex');
}

/**
 * Register a transaction with Przelewy24
 */
export async function registerPrzelewy24Transaction(
  transaction: Przelewy24Transaction
): Promise<{ success: boolean; token?: string; error?: string }> {
  const config = getPrzelewy24Config();
  const apiUrl = getPrzelewy24ApiUrl(config.sandbox);
  
  const sign = calculatePrzelewy24Sign({
    sessionId: transaction.sessionId,
    merchantId: config.merchantId,
    amount: transaction.amount,
    currency: transaction.currency,
    crc: config.crc,
  });
  
  const requestBody = {
    merchantId: parseInt(config.merchantId),
    posId: parseInt(config.posId),
    sessionId: transaction.sessionId,
    amount: transaction.amount,
    currency: transaction.currency,
    description: transaction.description,
    email: transaction.email,
    country: transaction.country,
    language: transaction.language,
    urlReturn: transaction.urlReturn,
    urlStatus: transaction.urlStatus,
    sign,
  };
  
  try {
    const response = await fetch(`${apiUrl}/transaction/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${config.posId}:${config.apiKey}`).toString('base64')}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Przelewy24 registration error:', errorText);
      return { success: false, error: errorText };
    }
    
    const data = (await response.json()) as Przelewy24RegisterResponse;
    return { success: true, token: data.data.token };
  } catch (error) {
    console.error('Error registering Przelewy24 transaction:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Verify Przelewy24 webhook notification
 */
export function verifyPrzelewy24Notification(params: {
  sessionId: string;
  merchantId: string;
  amount: number;
  currency: string;
  orderId: number;
  sign: string;
  crc: string;
}): boolean {
  const { sessionId, merchantId, amount, currency, orderId, sign, crc } = params;
  
  const expectedSign = crypto
    .createHash('sha384')
    .update(`{"sessionId":"${sessionId}","orderId":${orderId},"amount":${amount},"currency":"${currency}","crc":"${crc}"}`)
    .digest('hex');
  
  return sign === expectedSign;
}

/**
 * Get Przelewy24 payment redirect URL
 */
export function getPrzelewy24RedirectUrl(token: string, sandbox: boolean): string {
  const baseUrl = getPrzelewy24PaymentUrl(sandbox);
  return `${baseUrl}/${token}`;
}
