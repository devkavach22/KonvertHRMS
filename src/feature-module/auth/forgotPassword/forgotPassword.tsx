import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";

const ForgotPassword = () => {
  const routes = all_routes;
  const navigation = useNavigate();

  const navigationPath = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload
    navigation(routes.resetPassword);
  };

  return (
 <></>
  );
};

export default ForgotPassword;
