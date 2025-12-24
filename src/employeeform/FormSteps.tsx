import React from "react";

interface FormStepsProps {
  formData: any;
  handleInputChange: (e: any) => void;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  errors: Record<string, string>;
}

export const Step1BasicInformation: React.FC<FormStepsProps> = ({
  formData,
  handleInputChange,
  inputStyle,
  labelStyle,
  errors,
}) => (
  <div>
    <form className="needs-validation" noValidate>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="validationServer01">
            First name*
          </label>

          <input
            type="text"
            required
            name="firstName"
            className="form-control"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First name"
            defaultValue="Mark"
            style={{
              ...inputStyle,
              borderColor: errors?.firstName ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="validationServer02">
            Last name *
          </label>
          <input
            type="text"
            required
            name="lastName"
            className="form-control"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.firstName ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="validationServerFather">
            Father's Name *
          </label>

          <input
            type="text"
            required
            name="fatherName"
            className="form-control"
            placeholder="Father's Name"
            value={formData.fatherName}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.fatherName ? "red" : "#dee2e6",
            }}
          />

          {/* ✅ Bootstrap valid-feedback */}
          <div className="valid-feedback">Looks good!</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="clientName">
            Name of Client *
          </label>
          <input
            type="text"
            required
            name="clientName"
            id="clientName"
            className="form-control"
            placeholder="Enter Client Name"
            value={formData.clientName}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.clientName ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="validationServer02">
            work Email*{" "}
          </label>{" "}
          <input
            type="email"
            name="workEmail"
            required
            className="form-control"
            placeholder="Work Email"
            value={formData.workEmail}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.workEmail ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="siteName">
            Name of Site *
          </label>
          <input
            type="text"
            required
            name="siteName"
            id="siteName"
            className="form-control"
            placeholder="Enter Site Name"
            value={formData.siteName}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.siteName ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="unitBranch">
            Unit / Branch *
          </label>
          <input
            type="text"
            required
            name="unitBranch"
            className="form-control"
            id="unitBranch"
            placeholder="Enter Unit / Branch"
            value={formData.unitBranch}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.unitBranch ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="attendancePolicy">
            Attendance Policy *
          </label>
          <input
            type="text"
            required
            name="attendancePolicy"
            className="form-control"
            id="attendancePolicy"
            placeholder="Enter Attendance Policy"
            value={formData.attendancePolicy}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.attendancePolicy ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="employeeCategory">
            Applicable Employee Category *
          </label>
          <input
            type="text"
            required
            name="employeeCategory"
            className="form-control"
            id="employeeCategory"
            placeholder="Enter Employee Category"
            value={formData.employeeCategory}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.employeeCategory ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="workingHours">
            Working Hours *
          </label>
          <input
            type="number"
            required
            name="workingHours"
            className="form-control"
            id="workingHours"
            placeholder="Enter Working Hours"
            value={formData.workingHours}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.workingHours ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="shiftRoster">
            Shift Roster *
          </label>
          <input
            type="text"
            required
            name="shiftRoster"
            id="shiftRoster"
            className="form-control"
            placeholder="Enter Shift Roster"
            value={formData.shiftRoster}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.shiftRoster ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="nextShiftChange">
            Next Shift Change *
          </label>
          <input
            type="date"
            required
            name="nextShiftChange"
            id="nextShiftChange"
            className="form-control"
            value={formData.nextShiftChange}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.nextShiftChange ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="timezone">
            Timezone *
          </label>
          <input
            type="text"
            required
            name="timezone"
            id="timezone"
            className="form-control"
            placeholder="Enter Timezone"
            value={formData.timezone}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              borderColor: errors?.timezone ? "red" : "#dee2e6",
            }}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>

        <div
          className="col-md-6 d-flex align-items-center"
          style={{ marginTop: "32px" }}
        >
          <input
            type="checkbox"
            name="geoTracking"
            id="geoTracking"
            checked={formData.geoTracking}
            onChange={handleInputChange}
            style={{
              width: "20px",
              height: "20px",
              marginRight: "10px",
              borderColor: errors?.geoTracking ? "red" : "#dee2e6",
            }}
          />
          <label
            className="form-check-label"
            htmlFor="geoTracking"
            style={{ fontSize: "16px", color: "#333", margin: 0 }}
          >
            Is Geo Tracking?
          </label>
        </div>
      </div>
    </form>
  </div>
);

export const Step2LegalIdentification: React.FC<FormStepsProps> = ({
  formData,
  handleInputChange,
  inputStyle,
  errors,
  labelStyle,
}) => (
  <div>
    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Aadhaar Number (Masked) *</label>
        <input
          type="text"
          required
          name="aadhaar"
          value={formData.aadhaar}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Aadhaar Number"
          style={{
            ...inputStyle,
            borderColor: errors?.aadhaar ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>

      <div className="col-md-6">
        <label className="form-label">PAN Number *</label>
        <input
          type="text"
          required
          name="pan"
          value={formData.pan}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter PAN Number"
          style={{
            ...inputStyle,
            borderColor: errors?.pan ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Voter ID *</label>
        <input
          type="text"
          required
          name="voterId"
          value={formData.voterId}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Voter ID"
          style={{
            ...inputStyle,
            borderColor: errors?.voterId ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>

      <div className="col-md-6">
        <label className="form-label">Passport No *</label>
        <input
          type="text"
          required
          name="passportNo"
          value={formData.passportNo}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Passport Number"
          style={{
            ...inputStyle,
            borderColor: errors?.passportNo ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Driving License *</label>
        <input
          type="file"
          required
          name="drivingLicense"
          onChange={handleInputChange}
          className="form-control"
 style={{
            ...inputStyle,
            borderColor: errors?.passportNo ? "red" : "#dee2e6",
          }}        />
        <div className="valid-feedback">Looks good!</div>
      </div>

      <div className="col-md-6">
        <label className="form-label">UAN Number *</label>
        <input
          type="text"
          required
          name="uan"
          value={formData.uan}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter UAN Number"
          style={{
            ...inputStyle,
            borderColor: errors?.uan ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">ESI Number *</label>
        <input
          type="text"
          required
          name="esi"
          value={formData.esi}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter ESI Number"
          style={{
            ...inputStyle,
            borderColor: errors?.esi ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>

      <div className="col-md-6">
        <label className="form-label">Category *</label>
        <input
          type="text"
          required
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Category"
          style={{
            ...inputStyle,
            borderColor: errors?.category ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>
    </div>
  </div>
);

export const Step3PersonalInformation: React.FC<FormStepsProps> = ({
  formData,
  handleInputChange,
  inputStyle,
  errors,
  labelStyle,
}) => (
  <div>
    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Employee Code *</label>
        <input
          type="text"
          required
          name="employeeCode"
          value={formData.employeeCode}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Employee Code"
          style={{
            ...inputStyle,
            borderColor: errors?.employeeCode ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>

      <div className="col-md-6">
        <label className="form-label">CD Emp. No. *</label>
        <input
          type="text"
          required
          name="cdEmpNo"
          value={formData.cdEmpNo}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter CD Emp. No."
          style={{
            ...inputStyle,
            borderColor: errors?.cdEmpNo ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Date of Birth *</label>
        <input
          type="date"
          required
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          className="form-control"
          style={{
            ...inputStyle,
            borderColor: errors?.dob ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>

      <div className="col-md-6">
        <label className="form-label">Gender *</label>
        <select
          required
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="form-control"
          style={{
            ...inputStyle,
            borderColor: errors?.gender ? "red" : "#dee2e6",
          }}
        >
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <div className="valid-feedback">Looks good!</div>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Blood Group *</label>
        <input
          type="text"
          required
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Blood Group"
          style={{
            ...inputStyle,
            borderColor: errors?.bloodGroup ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>

      <div className="col-md-6">
        <label className="form-label">Marital Status *</label>
        <select
          required
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleInputChange}
          className="form-control"
          style={{
            ...inputStyle,
            borderColor: errors?.maritalStatus ? "red" : "#dee2e6",
          }}
        >
          <option value="">Select</option>
          <option>Single</option>
          <option>Married</option>
          <option>Divorced</option>
        </select>
        <div className="valid-feedback">Looks good!</div>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Country *</label>
        <input
          type="text"
          required
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Country"
          style={{
            ...inputStyle,
            borderColor: errors?.country ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>

      <div className="col-md-6">
        <label className="form-label">Religion *</label>
        <input
          type="text"
          required
          name="religion"
          value={formData.religion}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Religion"
          style={{
            ...inputStyle,
            borderColor: errors?.religion ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Primary Mobile*</label>
        <input
          type="tel"
          required
          name="primaryMobile"
          value={formData.primaryMobile}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Primary Mobile"
          style={{
            ...inputStyle,
            borderColor: errors?.primaryMobile ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>

      <div className="col-md-6">
        <label className="form-label">Secondary Mobile*</label>
        <input
          type="tel"
          name="secondaryMobile"
          value={formData.secondaryMobile}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Secondary Mobile"
          style={{
            ...inputStyle,
            borderColor: errors?.secondaryMobile ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Official Email *</label>
        <input
          type="email"
          required
          name="officialEmail"
          value={formData.officialEmail}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Official Email"
          style={{
            ...inputStyle,
            borderColor: errors?.officialEmail ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>

      <div className="col-md-6">
        <label className="form-label">Personal Email*</label>
        <input
          type="email"
                    required

          name="personalEmail"
          value={formData.personalEmail}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter Personal Email"
          style={{
            ...inputStyle,
            borderColor: errors?.personalEmail ? "red" : "#dee2e6",
          }}
        />
        <div className="valid-feedback">Looks good!</div>
      </div>
    </div>

    <div className="row">
      <div className="col-md-6">
        <label className="form-label">Passbook</label>
        <input
          type="file"
          name="passbook"
          onChange={handleInputChange}
          className="form-control"
          style={inputStyle} // file input ke liye border skip
        />
        <div className="valid-feedback">Looks good!</div>
      </div>
    </div>
  </div>
);

export const Step4AddressContact: React.FC<FormStepsProps> = ({
  formData,
  handleInputChange,
  inputStyle,
  labelStyle,
  errors,
}) => (
 <div>
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Present Address *</label>
      <textarea
        required
        name="presentAddress"
        value={formData.presentAddress}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Present Address"
        style={{
          ...inputStyle,
          minHeight: "100px",
          borderColor: errors?.presentAddress ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Permanent Address *</label>
      <textarea
        required
        name="permanentAddress"
        value={formData.permanentAddress}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Permanent Address"
        style={{
          ...inputStyle,
          minHeight: "100px",
          borderColor: errors?.permanentAddress ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">PIN Code *</label>
      <input
        type="text"
        required
        name="pinCode"
        value={formData.pinCode}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter PIN Code"
        style={{
          ...inputStyle,
          borderColor: errors?.pinCode ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">District *</label>
      <input
        type="text"
        required
        name="district"
        value={formData.district}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter District"
        style={{
          ...inputStyle,
          borderColor: errors?.district ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">State *</label>
      <input
        type="text"
        required
        name="stateEmp"
        value={formData.stateEmp}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter State"
        style={{
          ...inputStyle,
          borderColor: errors?.stateEmp ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Country *</label>
      <input
        type="text"
        required
        name="countryEmp"
        value={formData.countryEmp}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Country"
        style={{
          ...inputStyle,
          borderColor: errors?.countryEmp ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Emergency Contact Name *</label>
      <input
        type="text"
        required
        name="emergencyContactName"
        value={formData.emergencyContactName}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Emergency Contact Name"
        style={{
          ...inputStyle,
          borderColor: errors?.emergencyContactName ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Relation with Employee *</label>
      <input
        type="text"
        required
        name="relationWithEmployee"
        value={formData.relationWithEmployee}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Relation"
        style={{
          ...inputStyle,
          borderColor: errors?.relationWithEmployee ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Emergency Mobile *</label>
      <input
        type="tel"
        required
        name="emergencyMobile"
        value={formData.emergencyMobile}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Emergency Mobile"
        style={{
          ...inputStyle,
          borderColor: errors?.emergencyMobile ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Contact Address *</label>
      <input
        type="text"
        required
        name="contactAddress"
        value={formData.contactAddress}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Contact Address"
        style={{
          ...inputStyle,
          borderColor: errors?.contactAddress ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>
</div>

);

export const Step5EmploymentDetails: React.FC<FormStepsProps> = ({
  formData,
  handleInputChange,
  inputStyle,
  labelStyle,
  errors,
}) => (
<div>
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Department *</label>
      <input
        type="text"
        required
        name="department"
        value={formData.department || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Department"
        style={{
          ...inputStyle,
          borderColor: errors?.department ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Designation *</label>
      <input
        type="text"
        required
        name="designation"
        value={formData.designation || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Designation"
        style={{
          ...inputStyle,
          borderColor: errors?.designation ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Employment Type *</label>
      <input
        type="text"
        required
        name="employmentType"
        value={formData.employmentType || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Employment Type"
        style={{
          ...inputStyle,
          borderColor: errors?.employmentType ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Work Location *</label>
      <input
        type="text"
        required
        name="workLocation"
        value={formData.workLocation || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Work Location"
        style={{
          ...inputStyle,
          borderColor: errors?.workLocation ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  {/* Checkboxes (No red border required) */}
  <div className="row mb-3">
    <div className="col-md-6 d-flex align-items-center">
      <input
        type="checkbox"
        name="ptExempt"
        checked={formData.ptExempt || false}
        onChange={handleInputChange}
        style={{ width: "20px", height: "20px", marginRight: "10px" }}
      />
      <label style={{ fontSize: "16px", margin: 0 }}>PT Exempt?</label>
    </div>
    <div className="col-md-6 d-flex align-items-center">
      <input
        type="checkbox"
        name="exemptFromLWF"
        checked={formData.exemptFromLWF || false}
        onChange={handleInputChange}
        style={{ width: "20px", height: "20px", marginRight: "10px" }}
      />
      <label style={{ fontSize: "16px", margin: 0 }}>Exempt from LWF</label>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Employee Password *</label>
      <input
        type="password"
        required
        name="employeePassword"
        value={formData.employeePassword || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Password"
        style={{
          ...inputStyle,
          borderColor: errors?.employeePassword ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Grade / Band *</label>
      <input
        type="text"
        required
        name="gradeBand"
        value={formData.gradeBand || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Grade / Band"
        style={{
          ...inputStyle,
          borderColor: errors?.gradeBand ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Joining Date *</label>
      <input
        type="date"
        required
        name="joiningDate"
        value={formData.joiningDate || ""}
        onChange={handleInputChange}
        className="form-control"
        style={{
          ...inputStyle,
          borderColor: errors?.joiningDate ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Group Company Joining Date *</label>
      <input
        type="date"
        required
        name="groupJoiningDate"
        value={formData.groupJoiningDate || ""}
        onChange={handleInputChange}
        className="form-control"
        style={{
          ...inputStyle,
          borderColor: errors?.groupJoiningDate ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  {/* Number field */}
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Probation Period (months) *</label>
      <input
        type="number"
        required
        name="probationPeriod"
        value={formData.probationPeriod || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Probation Period"
        style={{
          ...inputStyle,
          borderColor: errors?.probationPeriod ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6 d-flex align-items-center">
      <input
        type="checkbox"
        name="inProbation"
        checked={formData.inProbation || false}
        onChange={handleInputChange}
        style={{ width: "20px", height: "20px", marginRight: "10px" }}
      />
      <label style={{ fontSize: "16px", margin: 0 }}>In Probation</label>
    </div>
  </div>

  {/* Remaining fields (text, select, email, etc.) */}
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Probation End Date *</label>
      <input
        type="date"
        required
        name="probationEndDate"
        value={formData.probationEndDate || ""}
        onChange={handleInputChange}
        className="form-control"
        style={{
          ...inputStyle,
          borderColor: errors?.probationEndDate ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Confirmation Date *</label>
      <input
        type="date"
        required
        name="confirmationDate"
        value={formData.confirmationDate || ""}
        onChange={handleInputChange}
        className="form-control"
        style={{
          ...inputStyle,
          borderColor: errors?.confirmationDate ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Week Off *</label>
      <input
        type="text"
        required
        name="weekOff"
        value={formData.weekOff || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Week Off"
        style={{
          ...inputStyle,
          borderColor: errors?.weekOff ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Status *</label>
      <select
        required
        name="status"
        value={formData.status || ""}
        onChange={handleInputChange}
        className="form-control"
        style={{
          ...inputStyle,
          borderColor: errors?.status ? "red" : "#dee2e6",
        }}
      >
        <option value="">Select</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6 d-flex align-items-center">
      <input
        type="checkbox"
        name="holdStatus"
        checked={formData.holdStatus || false}
        onChange={handleInputChange}
        style={{ width: "20px", height: "20px", marginRight: "10px" }}
      />
      <label style={{ fontSize: "16px", margin: 0 }}>Hold Status</label>
    </div>

    <div className="col-md-6">
      <label className="form-label">Hold Remarks *</label>
      <input
        type="text"
        required
        name="holdRemarks"
        value={formData.holdRemarks || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Hold Remarks"
        style={{
          ...inputStyle,
          borderColor: errors?.holdRemarks ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Reporting Manager *</label>
      <input
        type="text"
        required
        name="reportingManager"
        value={formData.reportingManager || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Reporting Manager"
        style={{
          ...inputStyle,
          borderColor: errors?.reportingManager ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Attendance Capture Mode *</label>
      <input
        type="text"
        required
        name="attendanceCaptureMode"
        value={formData.attendanceCaptureMode || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Attendance Capture Mode"
        style={{
          ...inputStyle,
          borderColor: errors?.attendanceCaptureMode ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row">
    <div className="col-md-6">
      <label className="form-label">Official Email *</label>
      <input
        type="email"
        required
        name="officialEmailEmployment"
        value={formData.officialEmailEmployment || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Official Email"
        style={{
          ...inputStyle,
          borderColor: errors?.officialEmailEmployment ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Bank Account *</label>
      <input
        type="text"
        required
        name="bankAccount"
        value={formData.bankAccount || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Bank Account"
        style={{
          ...inputStyle,
          borderColor: errors?.bankAccount ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>
</div>

);

export const Step6SalaryStructure: React.FC<FormStepsProps> = ({
  formData,
  handleInputChange,
  inputStyle,
  labelStyle,
  errors,
}) => (
<div>
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Salary Grade/Band *</label>
      <input
        type="text"
        required
        name="salaryGradeBand"
        value={formData.salaryGradeBand || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Salary Grade/Band"
        style={{
          ...inputStyle,
          borderColor: errors?.salaryGradeBand ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6 d-flex align-items-center">
      <input
        type="checkbox"
        name="eligibleForPT"
        checked={formData.eligibleForPT || false}
        onChange={handleInputChange}
        style={{ width: "20px", height: "20px", marginRight: "10px" }}
      />
      <label style={{ fontSize: "16px", margin: 0 }}>
        Eligible for Professional Tax
      </label>
    </div>
  </div>

  {/** Salary Components */}
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Salary Components *</label>
      <input
        type="text"
        required
        name="salaryComponents"
        value={formData.salaryComponents || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Salary Components"
        style={{
          ...inputStyle,
          borderColor: errors?.salaryComponents ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Wage *</label>
      <input
        type="text"
        required
        name="wage"
        value={formData.wage || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Wage"
        style={{
          ...inputStyle,
          borderColor: errors?.wage ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  {/** Gross Monthly Salary / Basic Salary */}
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Gross Monthly Salary *</label>
      <input
        type="text"
        required
        name="grossSalary"
        value={formData.grossSalary || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Gross Monthly Salary"
        style={{
          ...inputStyle,
          borderColor: errors?.grossSalary ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Basic Salary *</label>
      <input
        type="text"
        required
        name="basicSalary"
        value={formData.basicSalary || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Basic Salary"
        style={{
          ...inputStyle,
          borderColor: errors?.basicSalary ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  {/** HRA / Conveyance Allowance */}
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">HRA *</label>
      <input
        type="text"
        required
        name="hra"
        value={formData.hra || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter HRA"
        style={{
          ...inputStyle,
          borderColor: errors?.hra ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Conveyance Allowance *</label>
      <input
        type="text"
        required
        name="conveyanceAllowance"
        value={formData.conveyanceAllowance || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Conveyance Allowance"
        style={{
          ...inputStyle,
          borderColor: errors?.conveyanceAllowance ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  {/** Special / Bonus */}
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Special/Other Allowances *</label>
      <input
        type="text"
        required
        name="specialAllowances"
        value={formData.specialAllowances || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Special/Other Allowances"
        style={{
          ...inputStyle,
          borderColor: errors?.specialAllowances ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Bonus/Performance Pay *</label>
      <input
        type="text"
        required
        name="bonusPay"
        value={formData.bonusPay || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Bonus/Performance Pay"
        style={{
          ...inputStyle,
          borderColor: errors?.bonusPay ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  {/** PF / ESI Contribution */}
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">PF Contribution (Employee) *</label>
      <input
        type="text"
        required
        name="pfContribution"
        value={formData.pfContribution || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter PF Contribution"
        style={{
          ...inputStyle,
          borderColor: errors?.pfContribution ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">ESI Contribution *</label>
      <input
        type="text"
        required
        name="esiContribution"
        value={formData.esiContribution || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter ESI Contribution"
        style={{
          ...inputStyle,
          borderColor: errors?.esiContribution ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  {/** Income Tax / Net Salary */}
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Income Tax (TDS) *</label>
      <input
        type="text"
        required
        name="incomeTax"
        value={formData.incomeTax || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Income Tax"
        style={{
          ...inputStyle,
          borderColor: errors?.incomeTax ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Net Salary *</label>
      <input
        type="text"
        required
        name="netSalary"
        value={formData.netSalary || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Net Salary"
        style={{
          ...inputStyle,
          borderColor: errors?.netSalary ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>
</div>

);

export const Step7NoticePeriodUniform: React.FC<FormStepsProps> = ({
  formData,
  handleInputChange,
  inputStyle,
  labelStyle,
  errors,
}) => (
<div>
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Resignation Date *</label>
      <input
        type="date"
        required
        name="resignationDate"
        value={formData.resignationDate || ""}
        onChange={handleInputChange}
        className="form-control"
        style={{
          ...inputStyle,
          borderColor: errors?.resignationDate ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Notice Period (Days) *</label>
      <input
        type="number"
        required
        name="noticePeriodDays"
        value={formData.noticePeriodDays || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Notice Period (Days)"
        style={{
          ...inputStyle,
          borderColor: errors?.noticePeriodDays ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3 d-flex align-items-center">
    <div className="col-md-6 d-flex align-items-center">
      <input
        type="checkbox"
        name="inNoticePeriod"
        checked={formData.inNoticePeriod || false}
        onChange={handleInputChange}
        style={{ width: "20px", height: "20px", marginRight: "10px" }}
      />
      <label style={{ fontSize: "16px", margin: 0 }}>In Notice Period</label>
    </div>

    <div className="col-md-6">
      <label className="form-label">Notice Period End Date *</label>
      <input
        type="date"
        required
        name="noticePeriodEndDate"
        value={formData.noticePeriodEndDate || ""}
        onChange={handleInputChange}
        className="form-control"
        style={{
          ...inputStyle,
          borderColor: errors?.noticePeriodEndDate ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Uniform Item *</label>
      <input
        type="text"
        required
        name="uniformItem"
        value={formData.uniformItem || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Uniform Item"
        style={{
          ...inputStyle,
          borderColor: errors?.uniformItem ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Issue Date *</label>
      <input
        type="date"
        required
        name="uniformIssueDate"
        value={formData.uniformIssueDate || ""}
        onChange={handleInputChange}
        className="form-control"
        style={{
          ...inputStyle,
          borderColor: errors?.uniformIssueDate ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Return Date *</label>
      <input
        type="date"
        required
        name="uniformReturnDate"
        value={formData.uniformReturnDate || ""}
        onChange={handleInputChange}
        className="form-control"
        style={{
          ...inputStyle,
          borderColor: errors?.uniformReturnDate ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Return Condition *</label>
      <input
        type="text"
        required
        name="uniformReturnCondition"
        value={formData.uniformReturnCondition || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Return Condition"
        style={{
          ...inputStyle,
          borderColor: errors?.uniformReturnCondition ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>
</div>

);

export const Step8Settings: React.FC<FormStepsProps> = ({
  formData,
  handleInputChange,
  inputStyle,
  labelStyle,
  errors,
}) => (
<div>
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Status *</label>
      <select
        required
        name="settingsStatus"
        value={formData.settingsStatus || ""}
        onChange={handleInputChange}
        className="form-select"
        style={{
          ...inputStyle,
          borderColor: errors?.settingsStatus ? "red" : "#dee2e6",
        }}
      >
        <option value="">Select</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Related User *</label>
      <select
        required
        name="relatedUser"
        value={formData.relatedUser || ""}
        onChange={handleInputChange}
        className="form-select"
        style={{
          ...inputStyle,
          borderColor: errors?.relatedUser ? "red" : "#dee2e6",
        }}
      >
        <option value="">Select User</option>
        <option>Ram</option>
        <option>Git</option>
        <option>Sit</option>
        <option>App</option>
        <option>Kamal</option>
        <option>Shyam</option>
        <option>Rita</option>
        <option>Meera</option>
        <option>John</option>
        <option>David</option>
      </select>
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Attendance / Point of Sale *</label>
      <input
        type="text"
        required
        name="attendancePOS"
        value={formData.attendancePOS || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Attendance / POS"
        style={{
          ...inputStyle,
          borderColor: errors?.attendancePOS ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">PIN Code? *</label>
      <input
        type="text"
        required
        name="pinCodeSetting"
        value={formData.pinCodeSetting || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter PIN Code"
        style={{
          ...inputStyle,
          borderColor: errors?.pinCodeSetting ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Badge ID *</label>
      <input
        type="text"
        required
        name="badgeId"
        value={formData.badgeId || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Badge ID"
        style={{
          ...inputStyle,
          borderColor: errors?.badgeId ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>
</div>

);

export const Step9LWFDeductions: React.FC<FormStepsProps> = ({
  formData,
  handleInputChange,
  inputStyle,
  labelStyle,
  errors,
}) => (
<div>
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Month *</label>
      <input
        type="text"
        required
        name="lwfMonth"
        value={formData.lwfMonth || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Month"
        style={{
          ...inputStyle,
          borderColor: errors?.lwfMonth ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Year *</label>
      <input
        type="text"
        required
        name="lwfYear"
        value={formData.lwfYear || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Year"
        style={{
          ...inputStyle,
          borderColor: errors?.lwfYear ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Deduction *</label>
      <input
        type="text"
        required
        name="lwfDeduction"
        value={formData.lwfDeduction || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Deduction"
        style={{
          ...inputStyle,
          borderColor: errors?.lwfDeduction ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Employer *</label>
      <input
        type="text"
        required
        name="lwfEmployer"
        value={formData.lwfEmployer || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Employer Contribution"
        style={{
          ...inputStyle,
          borderColor: errors?.lwfEmployer ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label">Status *</label>
      <select
        required
        name="lwfStatus"
        value={formData.lwfStatus || ""}
        onChange={handleInputChange}
        className="form-select"
        style={{
          ...inputStyle,
          borderColor: errors?.lwfStatus ? "red" : "#dee2e6",
        }}
      >
        <option value="">Select</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
      <div className="valid-feedback">Looks good!</div>
    </div>

    <div className="col-md-6">
      <label className="form-label">Payment *</label>
      <input
        type="text"
        required
        name="lwfPayment"
        value={formData.lwfPayment || ""}
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter Payment"
        style={{
          ...inputStyle,
          borderColor: errors?.lwfPayment ? "red" : "#dee2e6",
        }}
      />
      <div className="valid-feedback">Looks good!</div>
    </div>
  </div>
</div>

);
