import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useMessage } from '@/contexts/MessageContext'
import type { IFormData, IPaymentResponse } from './interface'

export const validateIban = async (iban: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://matavi.eu/validate/?iban=${iban}`)
    const result = await response.json()
    return result.valid
  } catch {
    return false
  }
}

export const submitPayment = async (
  data: IFormData,
): Promise<IPaymentResponse> => {
  // TODO: Add a real API call
  console.log('Submitting payment:', data)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: Math.random().toString(36).substr(2, 9),
      })
    }, 1000)
  })
}

export const useSubmitPaymentMutation = () => {
  const message = useMessage()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: submitPayment,
    onSuccess: () => {
      message.success(t('paymentSubmitSuccess'))
    },
    onError: () => {
      // TODO Format error once API is added
      message.error(t('paymentSubmitFailure'))
    },
  })
}
