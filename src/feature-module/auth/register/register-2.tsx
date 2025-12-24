import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";

type PasswordField = "password" | "confirmPassword";

interface PasswordVisibility {
  password: boolean;
  confirmPassword: boolean;
}

const Register2 = () => {
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
    navigation(routes.login2);
  };

  return (
    <div className="container-fuild">
     
    </div>
  );
};

export default Register2;
