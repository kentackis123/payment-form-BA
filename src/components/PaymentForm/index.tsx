import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'

import {
  Form,
  FormInput,
  FormInputAmount,
  FormSelect,
  FormSubmit,
} from '@/components/common/Form'
import { useSubmitPaymentMutation } from '@/utils/api'
import type { IFormData } from '@/utils/api/interface'
import { payerAccounts } from './constants'
import { useValidationSchema } from './validation'

const PaymentForm: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { createValidationSchema } = useValidationSchema(payerAccounts)
  const schema = createValidationSchema()

  const { mutate, isPending: isLoadingSubmit } = useSubmitPaymentMutation()

  const formatAmount = (value: number) => {
    return i18n.language === 'lt'
      ? value.toLocaleString('lt-LT', { minimumFractionDigits: 2 })
      : value.toLocaleString('en-US', { minimumFractionDigits: 2 })
  }

  const payerAccountOptions = payerAccounts.map((acc) => ({
    label: `${acc.iban} (${formatAmount(acc.balance)} EUR)`,
    value: acc.id,
  }))

  const methods = useForm<IFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      payerAccount: payerAccountOptions[0].value,
      payee: '',
      payeeAccount: '',
      amount: '',
      purpose: '',
    },
  })

  const { watch } = methods

  const selectedPayerAccount = watch('payerAccount')
  const amount = watch('amount')
  const selectedAccount = payerAccounts.find(
    (acc) => acc.id === selectedPayerAccount,
  )

  // Trigger validation when payer account changes
  useEffect(() => {
    if (amount && selectedPayerAccount) {
      methods.trigger('amount')
    }
  }, [selectedPayerAccount, methods])

  useEffect(() => {
    methods.clearErrors()
  }, [i18n.language])

  const onSubmit = async (data: IFormData) => {
    mutate(data)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl">{t('paymentForm')}</h1>
      </div>

      <Form methods={methods} onSubmit={onSubmit}>
        <div className="p-6">
          <FormSelect
            inputName="payerAccount"
            label={t('payerAccount')}
            options={payerAccountOptions}
          />

          <FormInput inputName="payee" label={t('payee')} />

          <FormInput
            inputName="payeeAccount"
            label={t('payeeAccount')}
            placeholder="LT..."
          />

          <FormInputAmount
            inputName="amount"
            label={t('amount')}
            suffix=" EUR"
            placeholder={
              selectedAccount
                ? `Max: ${formatAmount(selectedAccount.balance)} EUR`
                : '0.00'
            }
            disabled={!selectedPayerAccount}
          />

          <FormInput inputName="purpose" label={t('purpose')} rows={3} />
        </div>

        <div className="p-6 border-t border-gray-200">
          <FormSubmit className="w-full" isLoading={isLoadingSubmit}>
            {t('submit')}
          </FormSubmit>
        </div>
      </Form>
    </div>
  )
}

export default PaymentForm
