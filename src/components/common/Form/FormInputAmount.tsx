import { useMemo, type FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Form, type FormItemProps } from 'antd'
import { NumericFormat, type NumericFormatProps } from 'react-number-format'

import Input from '@/components/common/Input'
import { cn } from '@/utils'
import FormLabel from './FormLabel'

interface IProps {
  inputName: string
  placeholder?: string
  label?: string
  className?: string
  layout?: FormItemProps['layout']
  suffix?: NumericFormatProps['suffix']
  disabled?: boolean
}

const FormInputAmount: FC<IProps> = ({
  inputName,
  placeholder = '',
  label,
  className,
  layout = 'vertical',
  disabled = false,
  ...rest
}) => {
  const { i18n } = useTranslation()
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const { thousandSeparator, decimalSeparator } = useMemo(() => {
    const numberFormatter = new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    const parts = numberFormatter.formatToParts(1234.5)
    const groupSeparator = parts.find((p) => p.type === 'group')?.value || ','
    const decimalSep = parts.find((p) => p.type === 'decimal')?.value || '.'

    return {
      thousandSeparator: groupSeparator,
      decimalSeparator: decimalSep,
    }
  }, [i18n.language])

  const error = errors[inputName]?.message as string | undefined
  const isError = Boolean(error)

  return (
    <Controller
      control={control}
      name={inputName}
      render={({ field }) => (
        <Form.Item
          label={label ? <FormLabel label={label} /> : undefined}
          colon={false}
          validateStatus={isError ? 'error' : undefined}
          help={error}
          layout={layout}
          htmlFor={inputName}
        >
          <NumericFormat
            customInput={Input}
            id={inputName}
            placeholder={placeholder}
            className={cn(className, 'w-full', {
              'border-red-500': isError,
            })}
            thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            valueIsNumericString={true}
            disabled={disabled}
            onValueChange={(values) => {
              // Convert formatted value back to numeric value for form state
              field.onChange(values.floatValue || 0)
            }}
            value={field.value || ''}
            {...rest}
          />
        </Form.Item>
      )}
    />
  )
}

export default FormInputAmount
