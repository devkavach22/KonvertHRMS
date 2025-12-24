import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";

type PasswordField = "password" | "confirmPassword";

interface PasswordVisibility {
  password: boolean;
  confirmPassword: boolean;
}

interface PasswordResponse {
  passwordResponceText: string;
  passwordResponceKey: string;
}

const ResetPassword3 = () => {
  const routes = all_routes;
  const navigation = useNavigate();

  const [passwordVisibility, setPasswordVisibility] = useState<PasswordVisibility>({
    password: false,
    confirmPassword: false,
  });
  const [password, setPassword] = useState<string>("");
  const [passwordResponce, setPasswordResponce] = useState<PasswordResponse>({
    passwordResponceText: "Use 8 or more characters with a mix of letters, numbers, and symbols.",
    passwordResponceKey: "",
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const onChangePassword = (password: string) => {
    setPassword(password);
    if (password.match(/^$|\s+/)) {
      setPasswordResponce({
        passwordResponceText: "Use 8 or more characters with a mix of letters, numbers & symbols",
        passwordResponceKey: "",
      });
    } else if (password.length === 0) {
      setPasswordResponce({
        passwordResponceText: "",
        passwordResponceKey: "",
      });
    } else if (password.length < 8) {
      setPasswordResponce({
        passwordResponceText: "Weak. Must contain at least 8 characters",
        passwordResponceKey: "0",
      });
    } else if (
      password.search(/[a-z]/) < 0 ||
      password.search(/[A-Z]/) < 0 ||
      password.search(/[0-9]/) < 0
    ) {
      setPasswordResponce({
        passwordResponceText: "Average. Must contain at least 1 upper case and number",
        passwordResponceKey: "1",
      });
    } else if (password.search(/(?=.*?[#?!@$%^&*-])/) < 0) {
      setPasswordResponce({
        passwordResponceText: "Almost. Must contain a special symbol",
        passwordResponceKey: "2",
      });
    } else {
      setPasswordResponce({
        passwordResponceText: "Awesome! You have a secure password.",
        passwordResponceKey: "3",
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigation(routes.resetPasswordSuccess3);
  };

  return (
    <div className="container-fuild">
      
    </div>
  );
};

export default ResetPassword3;
