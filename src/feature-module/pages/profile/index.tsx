import { useState } from "react";
import { Link } from "react-router-dom";
import CommonSelect from "../../../core/common/commonSelect";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";
import { all_routes } from "../../../router/all_routes";

type PasswordField =
  | "oldPassword"
  | "newPassword"
  | "confirmPassword"
  | "currentPassword";

const Profile = () => {
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
    currentPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const countryChoose = [
    { value: "Select", label: "Select" },
    { value: "USA", label: "USA" },
    { value: "Canada", label: "Canada" },
    { value: "Germany", label: "Germany" },
    { value: "France", label: "France" },
  ];
  const stateChoose = [
    { value: "Select", label: "Select" },
    { value: "california", label: "california" },
    { value: "Texas", label: "Texas" },
    { value: "New York", label: "New York" },
    { value: "Florida", label: "Florida" },
  ];
  const cityChoose = [
    { value: "Select", label: "Select" },
    { value: "Los Angeles", label: "Los Angeles" },
    { value: "San Francisco", label: "San Francisco" },
    { value: "San Diego", label: "San Diego" },
    { value: "Fresno", label: "Fresno" },
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
        
          {/* /Breadcrumb */}
     
        </div>
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">2014 - 2025 © SmartHR.</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Dreams
            </Link>
          </p>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default Profile;
