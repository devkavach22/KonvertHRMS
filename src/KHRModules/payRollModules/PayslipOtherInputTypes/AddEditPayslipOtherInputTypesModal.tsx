import React, { useEffect, useState } from "react";
import CommonSelect from "../../../core/common/commonSelect";
import { Checkbox, Switch } from "antd";
import { toast } from "react-toastify";
import {
  getStructureTypes,
  addPayslipInputType,
  updatePayslipInputType,
} from "./PayslipOtherInputTypesService";

const AddEditPayslipOtherInputTypesModal = ({
  onSuccess,
  data,
  onClose,
}: any) => {
  const [structures, setStructures] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    available_in_attachments: false,
    is_quantity: false,
    default_no_end_date: false,
    struct_ids: [],
  });

  useEffect(() => {
    const loadData = async () => {
      const structs = await getStructureTypes();
      setStructures(structs.map((s: any) => ({ value: s.id, label: s.name })));
    };
    loadData();
  }, []);

  useEffect(() => {
    if (data) {
      // Map API array response [id, name] if it comes as an array, or handled as simple IDs
      const parseIds = (val: any) => {
        if (Array.isArray(val)) {
          return typeof val[0] === "object"
            ? val.map((x: any) => x.id)
            : val.map((x: any) => x);
        }
        return val ? [val] : [];
      };

      setFormData({
        ...data,
        available_in_attachments: !!data.available_in_attachments,
        is_quantity: !!data.is_quantity,
        default_no_end_date: !!data.default_no_end_date,
        struct_ids: parseIds(data.struct_ids),
      });
    } else {
      resetForm();
    }
  }, [data]);

  const resetForm = () => {
    setFormData({
      name: "",
      available_in_attachments: false,
      is_quantity: false,
      default_no_end_date: false,
      struct_ids: [],
    });
    setIsSubmitted(false);
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!formData.name || formData.struct_ids.length === 0) {
      toast.error("Please fill all mandatory fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      data?.id
        ? await updatePayslipInputType(data.id, payload)
        : await addPayslipInputType(payload);
      toast.success("Saved successfully");
      onSuccess();
      document.getElementById("close-input-modal")?.click();
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationClass = (value: any) => {
    if (!isSubmitted) return "border rounded";
    return (Array.isArray(value) ? value.length > 0 : value)
      ? "border border-success rounded shadow-sm"
      : "border border-danger rounded shadow-sm";
  };

  return (
    <div className="modal fade" id="add_input_type_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom bg-light py-2">
            <h5 className="modal-title fw-bold fs-15">
              <i className="ti ti-settings me-2 text-primary"></i>
              {data ? "Edit Input Type" : "Add Input Type"}
            </h5>
            <button
              type="button"
              id="close-input-modal"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={resetForm}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSave} noValidate>
              {/* --- MAIN INFO --- */}
              <div className="row g-3 mb-4 bg-light p-3 rounded mx-0 border">
                <div className="col-md-7">
                  <label className="form-label fs-13 fw-bold">
                    Description <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${isSubmitted ? (formData.name ? "is-valid" : "is-invalid") : ""}`}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Overtime Hours"
                  />
                </div>
                <div className="col-md-5">
                  <label className="form-label fs-13 fw-bold">
                    Availability in Structure{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <div className={getValidationClass(formData.struct_ids)}>
                    <CommonSelect
                      isMulti={true}
                      options={structures}
                      value={structures.filter((s) =>
                        formData.struct_ids.includes(s.value),
                      )}
                      onChange={(selected: any) =>
                        setFormData({
                          ...formData,
                          struct_ids: selected
                            ? selected.map((s: any) => s.value)
                            : [],
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* --- SETTINGS BAR --- */}
              <div className="row mb-3 mx-0 py-3 rounded bg-white border d-flex align-items-center">
                <div className="col-md-5 border-end">
                  <Checkbox
                    className="fs-13 fw-bold"
                    checked={formData.available_in_attachments}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available_in_attachments: e.target.checked,
                      })
                    }
                  >
                    Available in Attachments
                  </Checkbox>
                </div>

                {formData.available_in_attachments && (
                  <div className="col-md-7 d-flex gap-4 ps-4 animate__animated animate__fadeIn">
                    <Checkbox
                      className="fs-13 fw-medium"
                      checked={formData.is_quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_quantity: e.target.checked,
                        })
                      }
                    >
                      Is Quantity
                    </Checkbox>
                    <Checkbox
                      className="fs-13 fw-medium"
                      checked={formData.default_no_end_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          default_no_end_date: e.target.checked,
                        })
                      }
                    >
                      No End Date by Default
                    </Checkbox>
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="modal-footer border-0">
            <button
              type="button"
              className="btn btn-light"
              data-bs-dismiss="modal"
              onClick={resetForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary px-5"
              disabled={isSubmitting}
              onClick={handleSave}
            >
              {isSubmitting ? "Processing..." : "Save Input Type"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditPayslipOtherInputTypesModal;
