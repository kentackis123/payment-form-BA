import type { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Form, type FormItemProps, type InputProps } from 'antd'
import Input from '@/components/common/Input'

import FormLabel from './FormLabel'

interface IProps extends Omit<InputProps, 'required'> {
  inputName: string
  label?: string
  layout?: FormItemProps['layout']
  rows?: number
}

const FormInput: FC<IProps> = ({
  inputName,
  label,
  layout = 'vertical',
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = errors[inputName]?.message as string | undefined
  const isError = Boolean(error)

  return (
    <Controller
      name={inputName}
      control={control}
      render={({ field }) => (
        <Form.Item
          label={label ? <FormLabel label={label} /> : undefined}
          colon={false}
          validateStatus={isError ? 'error' : undefined}
          help={error}
          layout={layout}
          htmlFor={inputName}
        >
          <Input {...rest} {...field} id={inputName} />
        </Form.Item>
      )}
    />
  )
}

export default FormInput
