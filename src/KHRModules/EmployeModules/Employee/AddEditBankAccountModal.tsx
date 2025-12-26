import React, { useEffect, useState } from "react";
import { addBankAccount, BankAccount } from "./BankAccountServices";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";
import { getBanks } from "./EmployeeServices";

interface Props {
  onSuccess: (newAccountId: string) => void; // Returns ID to auto-select in Employee form
}

export const AddEditBankAccountModal: React.FC<Props> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<any>({
    acc_number: "",
    bank_id: "",
    swift_code: "", // Derived from Bank
    acc_holder_name: "",
    ifsc_code: "",
    is_trusted: false,
  });

  const [banks, setBanks] = useState<any[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const loadBanks = async () => {
      const data = await getBanks();
      setBanks(
        data.map((b: any) => ({
          value: String(b.id),
          label: b.name,
          swift: b.swift_code,
        }))
      );
    };
    loadBanks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      !formData.acc_number ||
      !formData.bank_id ||
      !formData.acc_holder_name
    ) {
      return toast.error("Please fill mandatory fields highlighted in pink");
    }

    // Inside AddEditBankAccountModal.tsx handleSubmit:
    try {
      const response = await addBankAccount(formData);
      toast.success("Bank Account Created");

      // Call onSuccess first
      await onSuccess(response.data.id);

      // Close the modal
      const closeBtn = document.getElementById("close-bank-acc");
      closeBtn?.click();
    } catch (err) {
      toast.error("Creation failed");
    }
  };

  return (
    <>
      <style>
        {`
        /* This modal needs a higher z-index than the employee modal (1055) */
        #add_bank_account_modal {
          z-index: 1080 !important;
        }
        /* Ensure the backdrop for this specific modal is also layered higher */
        #add_bank_account_modal ~ .modal-backdrop {
          z-index: 1075 !important;
        }
      `}
      </style>

      <div
        className="modal fade"
        id="add_bank_account_modal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header border-bottom bg-light py-2">
              <h5 className="modal-title fw-bold fs-15">Create Bank Account</h5>
              <button
                type="button"
                id="close-bank-acc"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Left Column */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fs-13 text-danger">
                        Account Number
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          isSubmitted && !formData.acc_number
                            ? "bg-danger-subtle border-danger"
                            : ""
                        }`}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            acc_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fs-13">Bank</label>
                      <CommonSelect
                        options={banks}
                        onChange={(opt) =>
                          setFormData({
                            ...formData,
                            bank_id: opt?.value,
                            swift_code: opt?.label,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fs-13">SWIFT Code</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={formData.swift_code}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fs-13 text-danger">
                        Account Holder
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          isSubmitted && !formData.acc_holder_name
                            ? "bg-danger-subtle border-danger"
                            : ""
                        }`}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            acc_holder_name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-md-6 border-start ps-4">
                    <div className="mb-3">
                      <label className="form-label fs-13">Company</label>
                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value="Your Company Name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fs-13">IFSC Code</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ifsc_code: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fs-13">Currency</label>
                      <input
                        type="text"
                        className="form-control"
                        value="INR"
                        disabled
                      />
                    </div>
                    <div className="mt-4 d-flex align-items-center justify-content-between border p-2 rounded bg-light">
                      <span className="fs-13 fw-bold">Send Money?</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_trusted: e.target.checked,
                            })
                          }
                        />
                        <span className="ms-2 fs-12 text-muted">
                          {formData.is_trusted ? "Trusted" : "Untrusted"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 px-0 mt-4 pb-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-dismiss="modal"
                  >
                    Discard
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Save Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
