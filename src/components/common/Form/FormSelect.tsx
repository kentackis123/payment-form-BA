import type { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Form, Select, type FormItemProps, type SelectProps } from 'antd'
import FormLabel from './FormLabel'
import { cn } from '@/utils'

export interface ISelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface IProps extends Partial<SelectProps> {
  inputName: string
  options: ISelectOption[]
  isRequired?: boolean
  label?: string
  searchable?: boolean
  className?: string
  layout?: FormItemProps['layout']
  onPopupScroll?: () => void
  loading?: boolean
  size?: SelectProps['size']
  onChange?: (value: string) => void
}

const FormSelect: FC<IProps> = ({
  inputName,
  label,
  options = [],
  className,
  layout = 'vertical',
  onPopupScroll,
  loading,
  searchable,
  size = 'large',
  onChange,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

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
          validateStatus={isError ? 'error' : ''}
          help={error}
          layout={layout}
          htmlFor={inputName}
        >
          <Select
            {...field}
            id={inputName}
            showSearch={searchable}
            className={cn(className)}
            options={options.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            status={isError ? 'error' : undefined}
            onPopupScroll={onPopupScroll}
            loading={loading}
            size={size}
            onChange={(value: string) => {
              onChange?.(value)
              field.onChange(value)
            }}
          />
        </Form.Item>
      )}
    />
  )
}

export default FormSelect

export { type IProps as FormSelectProps }
