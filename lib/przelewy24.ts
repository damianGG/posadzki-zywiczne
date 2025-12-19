// Przelewy24 payment integration utilities

import crypto from 'crypto'

interface Przelewy24Config {
  merchantId: number
  posId: number
  crc: string
  apiKey: string
  mode: 'sandbox' | 'production'
}

interface Przelewy24Transaction {
  sessionId: string
  amount: number
  currency: string
  description: string
  email: string
  country: string
  urlReturn: string
  urlStatus: string
}

interface Przelewy24TransactionResponse {
  token: string
  error?: string
}

function getConfig(): Przelewy24Config {
  return {
    merchantId: parseInt(process.env.PRZELEWY24_MERCHANT_ID || '0'),
    posId: parseInt(process.env.PRZELEWY24_POS_ID || '0'),
    crc: process.env.PRZELEWY24_CRC || '',
    apiKey: process.env.PRZELEWY24_API_KEY || '',
    mode: (process.env.PRZELEWY24_MODE as 'sandbox' | 'production') || 'sandbox',
  }
}

function getApiUrl(): string {
  const config = getConfig()
  return config.mode === 'production'
    ? 'https://secure.przelewy24.pl/api/v1'
    : 'https://sandbox.przelewy24.pl/api/v1'
}

function getPaymentUrl(): string {
  const config = getConfig()
  return config.mode === 'production'
    ? 'https://secure.przelewy24.pl/trnRequest'
    : 'https://sandbox.przelewy24.pl/trnRequest'
}

/**
 * Generate signature for Przelewy24 request
 */
function generateSignature(data: {
  sessionId: string
  merchantId: number
  amount: number
  currency: string
  crc: string
}): string {
  const json = JSON.stringify(data)
  return crypto.createHash('sha384').update(json).digest('hex')
}

/**
 * Create Przelewy24 transaction
 */
export async function createPrzelewy24Transaction(
  transaction: Przelewy24Transaction
): Promise<Przelewy24TransactionResponse> {
  const config = getConfig()
  const apiUrl = getApiUrl()

  const signature = generateSignature({
    sessionId: transaction.sessionId,
    merchantId: config.merchantId,
    amount: transaction.amount,
    currency: transaction.currency,
    crc: config.crc,
  })

  const requestBody = {
    merchantId: config.merchantId,
    posId: config.posId,
    sessionId: transaction.sessionId,
    amount: transaction.amount,
    currency: transaction.currency,
    description: transaction.description,
    email: transaction.email,
    country: transaction.country,
    urlReturn: transaction.urlReturn,
    urlStatus: transaction.urlStatus,
    sign: signature,
  }

  try {
    const response = await fetch(`${apiUrl}/transaction/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${config.posId}:${config.apiKey}`
        ).toString('base64')}`,
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        token: '',
        error: data.error || 'Failed to create transaction',
      }
    }

    return {
      token: data.data.token,
    }
  } catch (error) {
    console.error('Przelewy24 transaction error:', error)
    return {
      token: '',
      error: 'Failed to create transaction',
    }
  }
}

/**
 * Get payment redirect URL
 */
export function getPaymentRedirectUrl(token: string): string {
  const paymentUrl = getPaymentUrl()
  return `${paymentUrl}/${token}`
}

/**
 * Verify Przelewy24 webhook signature
 */
export function verifyWebhookSignature(
  sessionId: string,
  orderId: number,
  amount: number,
  currency: string,
  receivedSign: string
): boolean {
  const config = getConfig()

  const signature = generateSignature({
    sessionId,
    merchantId: orderId,
    amount,
    currency,
    crc: config.crc,
  })

  return signature === receivedSign
}
