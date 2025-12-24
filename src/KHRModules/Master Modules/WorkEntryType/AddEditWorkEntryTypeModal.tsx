import React, { useEffect, useState } from "react";
import {
  addWorkEntryType,
  updateWorkEntryType,
  WorkEntryType,
} from "./WorkEntryTypeServices";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: WorkEntryType | null;
}

const AddEditWorkEntryTypeModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [externalCode, setExternalCode] = useState("");
  const [sequence, setSequence] = useState(0);
  const [color, setColor] = useState(1);
  const [isUnforeseen, setIsUnforeseen] = useState(false);
  const [isLeave, setIsLeave] = useState(false);
  const [roundDays, setRoundDays] = useState<"NO" | "HALF" | "FULL">("NO");
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Helper to reset form to initial state
  const resetForm = () => {
    setName("");
    setCode("");
    setExternalCode("");
    setSequence(0);
    setColor(1);
    setIsUnforeseen(false);
    setIsLeave(false);
    setRoundDays("NO");
    setValidated(false);
  };

  // 2. DATA SYNC: Populate form when editing
  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setCode(data.code || "");
      setExternalCode(data.external_code || "");
      setSequence(data.sequence || 0);
      setColor(data.color || 1);
      setIsUnforeseen(data.is_unforeseen || false);
      setIsLeave(data.is_leave || false);
      setRoundDays(data.round_days || "NO");
    } else {
      resetForm();
    }
  }, [data]);

  // 3. BOOTSTRAP EVENT LISTENER: Force clear when modal is closed
  // This handles backdrop clicks, Escape key, and the Close button
  useEffect(() => {
    const modalElement = document.getElementById("add_work_entry_type");

    const handleModalHidden = () => {
      resetForm();
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (e.currentTarget.checkValidity() === false) return;

    setIsSubmitting(true);

    const apiPayload = {
      name: name.trim(),
      code: code.trim(),
      external_code: externalCode.trim() || name.trim(),
      sequence: Number(sequence),
      color: Number(color),
      is_unforeseen: !!isUnforeseen,
      is_leave: !!isLeave,
      round_days: roundDays,
    };

    try {
      if (data && data.id) {
        await updateWorkEntryType(data.id, apiPayload);
        toast.success("Work Entry updated successfully!");
      } else {
        await addWorkEntryType(apiPayload);
        toast.success("New Work Entry created!");
      }

      // Close modal using the button ID
      document.getElementById("close-btn-entry")?.click();

      // Trigger parent refresh
      onSuccess();
    } catch (error: any) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to save data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal custom-modal fade"
      id="add_work_entry_type"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">{data ? "Edit Type" : "Add Type"}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-entry"
            ></button>
          </div>
          <div className="modal-body">
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    External Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={externalCode}
                    onChange={(e) => setExternalCode(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Round Days <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    required
                    value={roundDays}
                    onChange={(e) => setRoundDays(e.target.value as any)}
                  >
                    <option value="NO">NO</option>
                    <option value="HALF">HALF</option>
                    <option value="FULL">FULL</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Sequence</label>
                  <input
                    type="number"
                    className="form-control"
                    value={sequence}
                    onChange={(e) => setSequence(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Color (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="form-control"
                    value={color}
                    onChange={(e) => setColor(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isUnforeseen}
                      onChange={(e) => setIsUnforeseen(e.target.checked)}
                    />
                    <label className="form-check-label">Is Unforeseen?</label>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isLeave}
                      onChange={(e) => setIsLeave(e.target.checked)}
                    />
                    <label className="form-check-label">Is Leave?</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditWorkEntryTypeModal;
