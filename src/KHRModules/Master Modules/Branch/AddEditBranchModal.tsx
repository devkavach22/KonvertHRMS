import React, { useState, useEffect } from "react";
import CommonSelect from "../../../core/common/commonSelect";
import { toast } from "react-toastify";
import {
  getDistricts,
  getStates,
  getCountries,
} from "@/KHRModules/EmployeModules/Employee/EmployeeServices";
import { checkGST, createBranch, UpdateBrnach } from "./BranchServices";

const AddEditBranchModal = ({ data, onSuccess }: any) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState<any>({}); // Tracks which fields the user touched

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const initialFormState = {
    name: "",
    gst_number: "",
    country_id: "104",
    state_id: "",
    city_id: "",
    address: "",
  };

  const [formData, setFormData] = useState<any>(initialFormState);

  // Reset logic when modal closes or data changes
  const resetForm = () => {
    setFormData(initialFormState);
    setIsSubmitted(false);
    setTouched({});
    setCities([]);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const countryList = await getCountries();
      setCountries(
        countryList.map((c: any) => ({ value: String(c.id), label: c.name })),
      );

      const currentCountry = data?.country_id?.id || data?.country_id || "104";
      const stateList = await getStates(String(currentCountry));
      setStates(
        stateList.map((s: any) => ({ value: String(s.id), label: s.name })),
      );

      if (data) {
        setFormData({
          ...data,
          country_id: String(currentCountry),
          state_id: String(data.state_id?.id || data.state_id || ""),
          city_id: String(data.city_id?.id || data.city_id || ""),
        });
        if (data.state_id)
          fetchCities(
            String(currentCountry),
            String(data.state_id?.id || data.state_id),
          );
      } else {
        resetForm();
      }
    };
    loadInitialData();
  }, [data]);

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const fetchStates = async (countryId: string) => {
    const stateList = await getStates(countryId);
    setStates(
      stateList.map((s: any) => ({ value: String(s.id), label: s.name })),
    );
  };

  const fetchCities = async (countryId: string, stateId: string) => {
    const cityList = await getDistricts(countryId, stateId);
    setCities(
      cityList.map((c: any) => ({ value: String(c.id), label: c.name })),
    );
  };

  // const handleGSTVerify = async () => {
  //   const gst = formData.gst_number.trim();
  //   setTouched({ ...touched, gst_number: true });

  //   if (!gstRegex.test(gst)) return;

  //   setIsVerifying(true);
  //   try {
  //     const res = await checkGST(gst);
  //     if (res?.status === "ok") {
  //       const details = res.company_details[0];
  //       setFormData((prev: any) => ({
  //         ...prev,
  //         name: details.name,
  //         state_id: String(details.state_id),
  //         address: details.city,
  //       }));
  //       await fetchCities(formData.country_id, String(details.state_id));
  //       toast.success("GST Verified Successfully");
  //     }
  //   } catch (err) {
  //     toast.error("GST Verification Failed");
  //   } finally {
  //     setIsVerifying(false);
  //   }
  // };

  const handleGSTVerify = async () => {
    const gst = formData.gst_number.trim();
    setTouched({ ...touched, gst_number: true });

    if (!gstRegex.test(gst)) return;

    setIsVerifying(true);
    try {
      const res = await checkGST(gst);

      // 1. Get the message from the API response first
      const responseMessage =
        res?.message ||
        (res?.status === "ok"
          ? "GST Verified Successfully"
          : "GST Verification Failed");

      if (res?.status === "ok") {
        const details = res.company_details[0];
        setFormData((prev: any) => ({
          ...prev,
          name: details.name,
          state_id: String(details.state_id),
          address: details.city,
        }));
        await fetchCities(formData.country_id, String(details.state_id));

        // 2. Print the actual API message in the toast
        toast.success(responseMessage);
      } else {
        // 3. Print the API's specific error message
        toast.error(responseMessage);
      }
    } catch (err: any) {
      // Fallback for network or server errors
      const errMsg = err.response?.data?.message || "GST Verification Failed";
      toast.error(errMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      !formData.name ||
      (formData.gst_number && !gstRegex.test(formData.gst_number))
    ) {
      return;
    }

    try {
      const payload = {
        ...formData,
        country_id: Number(formData.country_id),
        state_id: Number(formData.state_id),
        city_id: Number(formData.city_id),
      };

      const response = data?.id
        ? await UpdateBrnach(payload)
        : await createBranch(payload);

      if (response) {
        toast.success(data?.id ? "Branch Updated" : "Branch Created");
        onSuccess();
        document.getElementById("close-branch-modal")?.click();
      }
    } catch (err: any) {
      toast.error("Error saving branch");
    }
  };

  return (
    <div
      className="modal fade"
      id="add_branch_modal"
      tabIndex={-1}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-light py-2">
            <h5 className="modal-title fs-14 fw-bold">
              {data ? "Edit Branch" : "Add Branch"}
            </h5>
            <button
              type="button"
              id="close-branch-modal"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={resetForm}
            ></button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body p-4">
              <div className="row g-3">
                {/* BRANCH NAME */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">
                    Branch Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${(isSubmitted || touched.name) && !formData.name ? "is-invalid" : ""}`}
                    value={formData.name}
                    onBlur={() => handleBlur("name")}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <div className="invalid-feedback">
                    Please provide a valid branch name.
                  </div>
                </div>

                {/* GST NUMBER */}
                <div className="col-md-6">
                  <label className="form-label fs-13 fw-bold">GST Number</label>
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      className={`form-control ${(isSubmitted || touched.gst_number) && formData.gst_number && !gstRegex.test(formData.gst_number) ? "is-invalid" : ""}`}
                      style={{ textTransform: "uppercase" }}
                      value={formData.gst_number}
                      onBlur={() => handleBlur("gst_number")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gst_number: e.target.value.toUpperCase(),
                        })
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleGSTVerify}
                      disabled={isVerifying}
                    >
                      {isVerifying ? "..." : "Verify"}
                    </button>
                    <div className="invalid-feedback">
                      Invalid GST format (e.g., 22AAAAA0000A1Z5).
                    </div>
                  </div>
                </div>

                {/* COUNTRY */}
                <div className="col-md-4">
                  <label className="form-label fs-13 fw-bold">Country</label>
                  <CommonSelect
                    options={countries}
                    value={countries.find(
                      (c) => c.value === formData.country_id,
                    )}
                    onChange={(opt) => {
                      setFormData({
                        ...formData,
                        country_id: opt.value,
                        state_id: "",
                        city_id: "",
                      });
                      fetchStates(opt.value);
                    }}
                  />
                </div>

                {/* STATE */}
                <div className="col-md-4">
                  <label className="form-label fs-13 fw-bold">State</label>
                  <CommonSelect
                    key={`state-${formData.state_id}`}
                    options={states}
                    value={states.find((s) => s.value === formData.state_id)}
                    onChange={(opt) => {
                      setFormData({
                        ...formData,
                        state_id: opt.value,
                        city_id: "",
                      });
                      fetchCities(formData.country_id, opt.value);
                    }}
                  />
                </div>

                {/* CITY */}
                <div className="col-md-4">
                  <label className="form-label fs-13 fw-bold">City</label>
                  <CommonSelect
                    key={`city-${formData.city_id}`}
                    options={cities}
                    value={cities.find((c) => c.value === formData.city_id)}
                    onChange={(opt) =>
                      setFormData({ ...formData, city_id: opt.value })
                    }
                    disabled={!formData.state_id}
                  />
                </div>

                {/* ADDRESS */}
                <div className="col-md-12">
                  <label className="form-label fs-13 fw-bold">
                    Full Address
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer bg-light">
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
                className="btn btn-primary px-4"
                style={{ backgroundColor: "#F26522", borderColor: "#F26522" }}
              >
                Save Branch
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditBranchModal;
