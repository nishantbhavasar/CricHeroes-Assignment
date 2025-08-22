import FormField from "./FormField";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register: any;
  name: any;
  label: any;
  error: any;
}

const Input = ({ register, name, label, error, required,...rest }: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <FormField
        label={label}
        error={error}
        required={required}
      >
        <input
          type="text"
          className="outline-none border-2 border-gray-400 rounded-lg p-2 sm:p-3 text-sm sm:text-base w-full"
          {...register}
          {...rest}
        />
      </FormField>
    </div>
  );
};

export default Input;
