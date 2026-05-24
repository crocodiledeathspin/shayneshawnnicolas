import type { ChangeEvent, FC } from 'react'

interface FloatingLabelInputProps {
  label: string
  type?: 'text' | 'date' | 'password' | 'number' | 'email'
  name: string
  value?: string | number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  autoFocus?: boolean
  disabled?: boolean
  readOnly?: boolean
  errors?: string[]
  step?: string
}

const FloatingLabelInput: FC<FloatingLabelInputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  required,
  autoFocus,
  disabled,
  readOnly,
  errors,
  step,
}) => (
  <>
    <div className="relative">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        step={step}
        className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-orange-500 peer"
        placeholder=" "
        autoFocus={autoFocus}
        disabled={disabled}
        readOnly={readOnly}
      />
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
    </div>
    {errors && errors.length > 0 && (
      <span className="text-red-600 text-sm">{errors[0]}</span>
    )}
  </>
)

export default FloatingLabelInput
