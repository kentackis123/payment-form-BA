export interface IFormData {
  amount: string
  payeeAccount: string
  purpose: string
  payerAccount: string
  payee: string
}

export interface IPaymentResponse {
  success: boolean
  transactionId: string
}
