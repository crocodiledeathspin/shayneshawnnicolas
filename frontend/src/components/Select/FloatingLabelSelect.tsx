import type { ChangeEvent, FC } from 'react'

interface Option {
  value: string | number
  label: string
}

interface FloatingLabelSelectProps {
  label: string
  name: string
  value?: string | number
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
  required?: boolean
  errors?: string[]
}

const FloatingLabelSelect: FC<FloatingLabelSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  errors,
}) => (
  <>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-orange-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-500 -translate-y-4 scale-75 top-4 left-2.5"
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

export default FloatingLabelSelect
