import React, { type FC } from 'react'
import Button, { type IButtonProps } from '@/components/common/Button'

interface IProps extends IButtonProps {
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

const FormSubmit: FC<IProps> = ({ children, size = 'large', ...rest }) => (
  <Button htmlType="submit" type="primary" size={size} {...rest}>
    {children}
  </Button>
)

export default FormSubmit
