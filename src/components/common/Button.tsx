import React from 'react'
import { Button as AntdButton, type ButtonProps as IButtonProps } from 'antd'
import { cn } from '@/utils'

interface IProps extends IButtonProps {
  children: React.ReactNode
  isLoading?: boolean
}

const Button = ({ children, isLoading, disabled, ...props }: IProps) => {
  return (
    <AntdButton disabled={isLoading || disabled} loading={isLoading} {...props}>
      <>
        <span
          className={cn('inline-flex items-center', {
            invisible: isLoading,
          })}
        >
          {children}
        </span>
      </>
    </AntdButton>
  )
}

export type { IProps as IButtonProps }

export default Button
