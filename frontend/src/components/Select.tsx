import FormField from "./FormField";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  defaultValue?: string;
  register: any;
  options: { value: string; label: string }[];
  required?: boolean;
  label: string;
}

const Select: React.FC<SelectProps> = ({
  error,
  label,
  defaultValue,
  register,
  options,
  required = false,
  ...rest
}) => {
  return (
    <FormField label={label} error={error} required={required}>
      <select
        defaultValue={defaultValue}
        {...register}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        {...rest}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export default Select;
