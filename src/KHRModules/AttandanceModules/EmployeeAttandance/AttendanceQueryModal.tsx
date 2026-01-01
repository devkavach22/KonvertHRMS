import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CommonSelect from "@/core/common/commonSelect";
import { getCategories, createRegularization } from "./EmployeeAttandanceServices";
import { useFormValidation } from "@/KHRModules/commanForm/FormValidation";


interface Props {
  attendance: any;
  employeeId: number;
  onClose: () => void;
}

interface CategoryOption {
  label: string;
  value: number;
}

const AttendanceQueryModal: React.FC<Props> = ({
  attendance,
  employeeId,
  onClose,
}) => {

  console.log(employeeId, "employeeId");

  const [formData, setFormData] = useState({
    // employee_id: employeeId,
    from_date: "",
    to_date: "",
    reg_category: null as number | null,
    reg_reason: "",
  });

  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
    const { EmpAttendancevalidateForm } = useFormValidation();
  

  /* =========================
     INIT DATE FROM CHECK-IN
     ========================= */
  useEffect(() => {
    if (attendance?.check_in) {
      const date = dayjs(attendance.check_in).format("YYYY-MM-DD");
      setFormData((prev) => ({
        ...prev,
        from_date: date,
        to_date: date,
      }));
    }
  }, [attendance]);

  /* =========================
     FETCH CATEGORY API
     ========================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(
          res?.data?.map((item: any) => ({
            label: item.type,
            value: item.id,
          })) || []
        );
      } catch {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  /* =========================
     VALIDATION
     ========================= */


  /* =========================
     SUBMIT
     ========================= */
  const handleSubmit = async () => {
    setIsSubmitted(true);
     const validationErrors = EmpAttendancevalidateForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      employee_id: employeeId,
      from_date: formData.from_date,
      to_date: formData.to_date,
      reg_category: formData.reg_category,
      reg_reason: formData.reg_reason,
    };

    try {
      await createRegularization(payload);

      toast.success("Attendance regularization submitted successfully");
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to submit regularization"
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  /* =========================
     UI
     ========================= */
  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Attendance Regularization</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="fw-bold">
                  Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  className="w-100"
                  format="YYYY-MM-DD"
                  value={formData.from_date ? dayjs(formData.from_date) : null}
                  onChange={(date) => {
                    const val = date?.format("YYYY-MM-DD") || "";
                    setFormData({
                      ...formData,
                      from_date: val,
                      to_date: val,
                    });
                  }}
                />
                {isSubmitted && errors.from_date && (
                  <div className="text-danger fs-11">{errors.from_date}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-bold">
                  Category <span className="text-danger">*</span>
                </label>
                <CommonSelect
                  options={categories}
                  placeholder="Select Category"
                  value={categories.find(
                    (c) => c.value === formData.reg_category
                  )}
                  onChange={(opt: any) =>
                    setFormData({ ...formData, reg_category: opt?.value })
                  }
                />
                {isSubmitted && errors.reg_category && (
                  <div className="text-danger fs-11">{errors.reg_category}</div>
                )}
              </div>

              <div className="col-md-12 mb-3">
                <label className="fw-bold">
                  Reason <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.reg_reason}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reg_reason: e.target.value,
                    })
                  }
                />
                {isSubmitted && errors.reg_reason && (
                  <div className="text-danger fs-11">{errors.reg_reason}</div>
                )}
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AttendanceQueryModal;
