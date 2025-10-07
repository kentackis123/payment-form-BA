import { type FC, type ReactNode } from 'react'

import { cn } from '@/utils'

interface IProps {
  label: ReactNode | string
  isRequired?: boolean
  className?: string
}

const FormLabel: FC<IProps> = ({ label, isRequired, className }) => (
  <label
    className={cn('flex gap-1 text-sm font-medium text-gray-600', className)}
  >
    {label}
    {isRequired && <span className="text-red-600">*</span>}
  </label>
)

export default FormLabel
