import React, { useEffect, useState } from "react";
import {
  addContractType,
  updateContractType,
  ContractType,
} from "./HRContractTypeServices";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  data: ContractType | null;
}

const AddEditHRContractTypeModal: React.FC<Props> = ({ onSuccess, data }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [country, setCountry] = useState("");
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setCode("");
    setCountry("");
    setValidated(false);
  };

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setCode(data.code || "");
      setCountry(data.country_name || "");
    } else {
      resetForm();
    }
  }, [data]);

  useEffect(() => {
    const modalElement = document.getElementById("add_contract_type_modal");
    const handleHidden = () => resetForm();
    modalElement?.addEventListener("hidden.bs.modal", handleHidden);
    return () =>
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) return;

    setIsSubmitting(true);
    const payload = {
      name: name.trim(),
      code: code.trim(),
      country_name: country.trim(),
    };

    try {
      if (data && data.id) {
        await updateContractType(data.id, payload);
        toast.success("Contract Type updated successfully");
      } else {
        await addContractType(payload);
        toast.success("Contract Type created successfully");
      }
      document.getElementById("close-btn-contract")?.click();
      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error saving contract type"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal custom-modal fade"
      id="add_contract_type_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              {data ? "Edit Contract Type" : "Add Contract Type"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="close-btn-contract"
            ></button>
          </div>
          <div className="modal-body">
            <form
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <label className="form-label">
                  Contract Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Full-Time Contract"
                />
                <div className="invalid-feedback">
                  Please enter a contract name.
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. FT_CONTRACT"
                />
                <div className="invalid-feedback">Please enter a code.</div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Country Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. India"
                />
                <div className="invalid-feedback">Please enter a country.</div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Contract Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditHRContractTypeModal;
