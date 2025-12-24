import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
type PasswordField = "password";

const Login2 = () => {
  const routes = all_routes;
  const navigation = useNavigate();

  const navigationPath = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload
    navigation(routes.adminDashboard);
  };
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
       
      </div>
    </div>
  );
};

export default Login2;
