import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CommonSelect from "@/core/common/commonSelect";
import { useFormValidation } from "@/KHRModules/commanForm/FormValidation";
import {
  EmployeeRegcategories,
  Employeeregularization,
  TBSelector,
  updateState,
} from "@/Store/Reducers/TBSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/Store";

interface Props {
  attendance: any;
  employeeId: any;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Option {
  label: string;
  value: string;
}

const AttendanceQueryModal: React.FC<Props> = ({
  attendance,
  employeeId,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isEmployeeRegcategories,
    EmployeeRegcategoriesData,
    isEmployeeRegcategoriesFetching,
    isError,
    errorMessage,
  } = useSelector(TBSelector);

  const { EmpAttendancevalidateForm } = useFormValidation();

  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    reg_category: null as string | null,
    reg_reason: "",
    check_in: "" as string | null,
    check_out: "" as string | null,
  });

  const [categories, setCategories] = useState<Option[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* ========================= INIT FORM DATA FROM ATTENDANCE ========================= */
  useEffect(() => {
    if (attendance) {
      const date = attendance.StartDate || dayjs().format("YYYY-MM-DD");
      setFormData({
        from_date: date,
        to_date: date,
        reg_category: null,
        reg_reason: "",
        check_in: attendance.CheckIn || null,
        check_out:
          attendance.CheckOut && attendance.CheckOut !== "-"
            ? attendance.CheckOut
            : null,
      });
    }
  }, [attendance]);

  // useEffect(() => {

  //         if (!isError) {
  //            console.log(isError,errorMessage,"iiiiiiiii");
  //             toast.error(
  //                 errorMessage || "Failed to submit regularization",
  //                 {
  //                     position: "top-right",
  //                     autoClose: 3000,
  //                 }
  //             );
  //             dispatch(updateState({isError:false}))
  //         }
  //     }, [isError])

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage || "Failed to submit regularization", {
        position: "top-right",
        autoClose: 3000,
      });

      dispatch(updateState({ isError: false }));
    }
  }, [isError, errorMessage, dispatch]);

  useEffect(() => {
    dispatch(EmployeeRegcategories());
  }, [dispatch]);

  useEffect(() => {
    if (EmployeeRegcategoriesData?.data?.length) {
      setCategories(
        EmployeeRegcategoriesData.data.map((item: any) => ({
          label: item.type,
          value: String(item.id),
        }))
      );
    }
  }, [EmployeeRegcategoriesData]);
  console.log(categories, "categories");

  const handleSubmit = async () => {
    setIsSubmitted(true);

    const validationErrors = EmpAttendancevalidateForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload: RegularizationPayload = {
      employee_id: employeeId,
      from_date: `${formData.from_date} ${formData.check_in || ''}`.trim(),
      to_date: `${formData.to_date} ${formData.check_out || ''}`.trim(),
      reg_category: formData.reg_category,
      reg_reason: formData.reg_reason,
    };

    const result: any = await dispatch(Employeeregularization(payload));

    // Check if the request was successful
    if (result.type === 'Employeeregularization/fulfilled') {
      toast.success("Attendance regularization submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      onSuccess?.(); // Trigger refresh
      onClose();
    } else {
      toast.error(
        result?.payload?.error ||
        result?.error?.message ||
        "Failed to submit regularization",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  /* ========================= HANDLE SUBMIT ========================= */
  // const handleSubmit = async () => {
  //   setIsSubmitted(true);

  //   const validationErrors = EmpAttendancevalidateForm(formData);
  //   if (Object.keys(validationErrors).length) {
  //     setErrors(validationErrors);
  //     return;
  //   }

  //   const payload = {
  //     employee_id: employeeId,
  //     from_date: formData.from_date,
  //     to_date: formData.to_date,
  //     reg_category: formData.reg_category,
  //     reg_reason: formData.reg_reason,
  //     check_in: formData.check_in,
  //     check_out: formData.check_out,
  //   };

  //   console.log(payload, "Payload for submission");

  //   try {
  //     setIsSubmitting(true);
  //     await dispatch(Employeeregularization(payload));
  //     onClose();
  //   } catch (error: any) {
  //     toast.error(
  //       error?.response?.data?.message || "Failed to submit regularization"
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  /* ========================= UI ========================= */
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
              {/* Date */}
              <div className="col-md-4 mb-3">
                <label className="fw-bold">
                  Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  className="w-100"
                  format="YYYY-MM-DD"
                  disabled
                  value={formData.from_date ? dayjs(formData.from_date) : null}
                  onChange={(date) => {
                    const val = date?.format("YYYY-MM-DD") || "";
                    setFormData({ ...formData, from_date: val, to_date: val });
                  }}
                />
                {isSubmitted && errors.from_date && (
                  <div className="text-danger fs-11">{errors.from_date}</div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Check In</label>
                <TimePicker
                  className="w-100"
                  format="HH:mm"
                  value={
                    formData.check_in ? dayjs(formData.check_in, "HH:mm") : null
                  }
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      check_in: value ? value.format("HH:mm") : null,
                    })
                  }
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="fw-bold">Check Out</label>
                <TimePicker
                  className="w-100"
                  format="HH:mm"
                  value={
                    formData.check_out
                      ? dayjs(formData.check_out, "HH:mm")
                      : null
                  }
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      check_out: value ? value.format("HH:mm") : null,
                    })
                  }
                />
              </div>
            </div>

            {/* Category */}
            <div className="col-md-12 mb-3">
              <label className="fw-bold">
                Category <span className="text-danger">*</span>
              </label>
              <CommonSelect
                options={categories}
                placeholder="Select Category"
                value={categories.find(
                  (c) => c.value === String(formData.reg_category)
                )}
                onChange={(opt: any) =>
                  setFormData({ ...formData, reg_category: opt?.value })
                }
              />
              {isSubmitted && errors.reg_category && (
                <div className="text-danger fs-11">{errors.reg_category}</div>
              )}
            </div>

            {/* Reason */}
            <div className="col-md-12 mb-3">
              <label className="fw-bold">
                Reason <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.reg_reason}
                onChange={(e) =>
                  setFormData({ ...formData, reg_reason: e.target.value })
                }
              />
              {isSubmitted && errors.reg_reason && (
                <div className="text-danger fs-11">{errors.reg_reason}</div>
              )}
            </div>

            {/* Check-In and Check-Out */}
          </div>
          <div className="modal-footer">
            <button className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isEmployeeRegcategoriesFetching}
            >
              {isEmployeeRegcategoriesFetching ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}

    </div>
  );
};

export default AttendanceQueryModal;

export interface RegularizationPayload {
  employee_id: number;
  from_date: string; // Date with check-in time concatenated
  to_date: string; // Date with check-out time concatenated
  reg_category: string | number | null;
  reg_reason: string;
}
