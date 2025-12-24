import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";

type PasswordField = "password" | "confirmPassword";

interface PasswordVisibility {
  password: boolean;
  confirmPassword: boolean;
}

const Register3 = () => {
  const routes = all_routes;
  const navigation = useNavigate();

  const [passwordVisibility, setPasswordVisibility] = useState<PasswordVisibility>({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigation(routes.login3);
  };

  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
        
        </div>
      </div>
    </div>
  );
};

export default Register3;
