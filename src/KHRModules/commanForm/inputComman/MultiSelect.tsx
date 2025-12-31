import { Select } from "antd";
const { Option } = Select;

interface MultiSelectProps {
  label: string;
  value: number[];
  options: any[];
  error?: string;
  isSubmitted?: boolean;
  onChange: (ids: number[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  value,
  options,
  error,
  isSubmitted = false,
  onChange,
}) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%" }}
      value={value}
      onChange={onChange}
       status={isSubmitted && error ? "error" : ""}
    >
      {options.map((opt) => (
        <Option key={opt.id} value={opt.id}>
          {opt.name} — {opt.role}
        </Option>
      ))}
    </Select>
   {isSubmitted && error && (
      <div className="text-danger fs-11 mt-1 animate__animated animate__fadeIn">
        <i className="ti ti-info-circle me-1"></i>
        {error}
      </div>
    )}
  </div>
);

export default MultiSelect;
