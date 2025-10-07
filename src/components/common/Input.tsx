import type { FC } from 'react'
import { Input as InputAntd, type InputProps } from 'antd'

const Input: FC<InputProps> = ({ size = 'large', ...props }) => {
  return <InputAntd size={size} {...props} />
}

export default Input
