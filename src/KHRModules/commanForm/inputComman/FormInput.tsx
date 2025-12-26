interface FormInputProps {
  label: string;
  name: string;
  value: any;
  type?: string;
  error?: string;
  isSubmitted?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  type = "text",
  error,
  isSubmitted = false,
  onChange,
}) => (
  <div className="mb-3">
    <label className="form-label fs-13 fw-bold">
      {label}
      <span className="text-danger">*</span>
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`form-control ${
        isSubmitted
          ? error
            ? "is-invalid"
            : value
            ? "is-valid"
            : ""
          : ""
      }`}
    />

    {isSubmitted && error && (
      <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
        <i className="ti ti-info-circle me-1"></i>
        {error}
      </div>
    )}
  </div>
);

export default FormInput;
