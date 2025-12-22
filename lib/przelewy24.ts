import crypto from 'crypto'

interface Przelewy24Config {
  merchantId: string
  posId: string
  crcKey: string
  apiKey: string
  sandbox: boolean
}

interface CreateTransactionParams {
  orderId: string
  orderNumber: string
  amount: number // in PLN
  currency: string
  description: string
  email: string
  country: string
  language: string
  urlReturn: string
  urlStatus: string
}

interface TransactionResponse {
  data: {
    token: string
  }
}

export class Przelewy24Service {
  private config: Przelewy24Config
  private baseUrl: string

  constructor() {
    this.config = {
      merchantId: process.env.PRZELEWY24_MERCHANT_ID || '',
      posId: process.env.PRZELEWY24_POS_ID || '',
      crcKey: process.env.PRZELEWY24_CRC_KEY || '',
      apiKey: process.env.PRZELEWY24_API_KEY || '',
      sandbox: process.env.PRZELEWY24_SANDBOX === 'true'
    }
    
    this.baseUrl = this.config.sandbox
      ? 'https://sandbox.przelewy24.pl/api/v1'
      : 'https://secure.przelewy24.pl/api/v1'
  }

  private generateSign(params: { sessionId: string; amount: number; currency: string; crc: string }): string {
    const { sessionId, amount, currency, crc } = params
    const amountInGrosze = Math.round(amount * 100) // Convert to grosze (1 PLN = 100 groszy)
    const signString = `${sessionId}|${amountInGrosze}|${currency}|${crc}`
    return crypto.createHash('sha384').update(signString).digest('hex')
  }

  async createTransaction(params: CreateTransactionParams): Promise<string | null> {
    if (!this.config.merchantId || !this.config.posId || !this.config.crcKey || !this.config.apiKey) {
      console.error('Przelewy24 configuration is incomplete')
      return null
    }

    const amountInGrosze = Math.round(params.amount * 100) // Convert to grosze

    const transactionData = {
      merchantId: parseInt(this.config.merchantId),
      posId: parseInt(this.config.posId),
      sessionId: params.orderId,
      amount: amountInGrosze,
      currency: params.currency,
      description: params.description,
      email: params.email,
      country: params.country,
      language: params.language,
      urlReturn: params.urlReturn,
      urlStatus: params.urlStatus,
      sign: this.generateSign({
        sessionId: params.orderId,
        amount: params.amount,
        currency: params.currency,
        crc: this.config.crcKey
      })
    }

    try {
      const response = await fetch(`${this.baseUrl}/transaction/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.posId}:${this.config.apiKey}`).toString('base64')}`
        },
        body: JSON.stringify(transactionData)
      })

      if (response.ok) {
        const data: TransactionResponse = await response.json()
        const paymentUrl = this.config.sandbox
          ? `https://sandbox.przelewy24.pl/trnRequest/${data.data.token}`
          : `https://secure.przelewy24.pl/trnRequest/${data.data.token}`
        
        return paymentUrl
      } else {
        const errorData = await response.text()
        console.error('Przelewy24 error:', errorData)
        return null
      }
    } catch (error) {
      console.error('Error creating Przelewy24 transaction:', error)
      return null
    }
  }

  verifyCallback(data: any): boolean {
    const { sessionId, amount, currency, orderId, sign } = data
    const amountNumber = amount / 100 // Convert from grosze to PLN
    
    const expectedSign = this.generateSign({
      sessionId,
      amount: amountNumber,
      currency,
      crc: this.config.crcKey
    })

    return sign === expectedSign
  }
}

export const przelewy24 = new Przelewy24Service()
