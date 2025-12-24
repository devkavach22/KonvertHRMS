import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";

const ForgotPassword3 = () => {
  const routes = all_routes;
  const navigation = useNavigate();

  const navigationPath = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload
    navigation(routes.resetPassword3);
  };

  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
       
      </div>
    </div>
  );
};

export default ForgotPassword3;
