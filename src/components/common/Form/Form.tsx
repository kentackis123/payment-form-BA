import { type ReactNode } from 'react'
import {
  type FieldValues as TFieldValues,
  FormProvider,
  type UseFormReturn,
} from 'react-hook-form'
import { Form as AntdForm } from 'antd'
import { cn } from '@/utils'

interface IProps<T extends TFieldValues> {
  children: ReactNode
  methods: UseFormReturn<T>
  onSubmit: (values: T) => void
  className?: string
}

const Form = <T extends TFieldValues>({
  children,
  methods,
  onSubmit,
  className,
}: IProps<T>): ReactNode => (
  <FormProvider {...methods}>
    <div className={cn('w-full', className)}>
      <AntdForm layout="vertical" onFinish={methods.handleSubmit(onSubmit)}>
        {children}
      </AntdForm>
    </div>
  </FormProvider>
)

export default Form
