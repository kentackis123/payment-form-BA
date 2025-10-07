import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import type { IPayerAccount } from './interface'
import { validateIban } from '@/utils/api'
import { formatAmount } from '@/utils'

export const useValidationSchema = (accounts: IPayerAccount[]) => {
  const { t } = useTranslation()

  const createValidationSchema = () =>
    yup.object().shape({
      payerAccount: yup
        .string()
        .required(t('required'))
        .test('positiveBalance', function (value) {
          const selectedAccount = accounts.find((acc) => acc.id === value)
          if (selectedAccount && selectedAccount.balance <= 0) {
            return this.createError({
              message: t('negativeBalance', {
                balance: formatAmount(selectedAccount.balance),
              }),
            })
          }
          return true
        }),
      amount: yup
        .string()
        .required(t('required'))
        .test('minAmount', t('minAmount'), function (value) {
          const valueNum = parseFloat(value || '0')
          return valueNum >= 0.01
        })
        .test('balanceCheck', function (value) {
          const payerAccountId = this.parent.payerAccount
          const selectedAccount = accounts.find(
            (acc) => acc.id === payerAccountId,
          )
          const valueNum = parseFloat(value || '0')
          if (selectedAccount && valueNum > selectedAccount.balance) {
            return this.createError({
              message: t('insufficientFunds', {
                balance: formatAmount(selectedAccount.balance),
              }),
            })
          }
          return true
        }),
      payeeAccount: yup
        .string()
        .required(t('required'))
        // Can add basic format check via regex here if needed
        .test('validIban', t('invalidIban'), async function (value) {
          if (!value) return false
          return await validateIban(value)
        }),
      payee: yup.string().required(t('required')).max(70, t('maxPayee')),
      purpose: yup
        .string()
        .required(t('required'))
        .min(3, t('minPurpose'))
        .max(135, t('maxPurpose')),
    })

  return { createValidationSchema }
}
