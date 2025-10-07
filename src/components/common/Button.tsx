import React from 'react'
import { Button as AntdButton, type ButtonProps as IButtonProps } from 'antd'

interface IProps extends IButtonProps {
  children: React.ReactNode
  isLoading?: boolean
}

const Button = ({ children, isLoading, disabled, ...props }: IProps) => {
  return (
    <AntdButton disabled={isLoading || disabled} loading={isLoading} {...props}>
      {children}
    </AntdButton>
  )
}

export type { IProps as IButtonProps }

export default Button
