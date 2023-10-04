import { ChangeEvent } from "react";

interface InputInterface {
  label?: string;
  type?:
    | "text"
    | "number"
    | "email"
    | "password"
    | "file"
    | "date"
    | "datetime-local"
    | "time";
  name?: string;
  required?: boolean;
  textSize?: "text-[10px]" | "text-xs" | "text-sm" | "text-base" | "text-xl";
  paddingH?:
    | "py-1"
    | "py-[6px]"
    | "py-2"
    | "py-[10px]"
    | "py-3"
    | "py-[14px]"
    | "py-4";
  placeholder?: string;
  value?: string | number;
  error?: string;
  readOnly?: boolean;
  maxLength?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

function Input({
  label,
  type,
  name,
  required,
  textSize,
  paddingH,
  placeholder,
  value,
  error,
  readOnly,
  maxLength,
  onChange,
  onFocus,
  onBlur,
}: InputInterface) {
  return (
    <div className="w-full">
      {label && (
        <p className="mb-3 text-sm font-semibold text-neutral-700">
          {label} {required && <span className="text-red-500">*</span>}
        </p>
      )}
      <div className="relative flex w-full justify-end">
        <input
          type={type ?? "text"}
          name={name}
          className={`w-full rounded-[6px] border border-neutral-300 bg-neutral-50 px-3 text-neutral-800 ${
            textSize ?? "text-xs"
          } ${paddingH ?? "py-1"} ${
            readOnly
              ? "outline-none"
              : "focus:bg-blue-50 focus:outline-4 focus:outline-blue-200"
          } ${error ? "border-red-500 focus:outline-red-400" : ""}`}
          placeholder={placeholder ?? ""}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
}
export default Input;
