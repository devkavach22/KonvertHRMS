import  { useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../../router/all_routes";

const FormValidation = () => {
  const routes = all_routes;
  useEffect(() => {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation') as NodeListOf<HTMLFormElement>;
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      }, false);
    });
  }, []);
  return (
    <div>
      <div className="page-wrapper">
      
      </div>
    </div>
  );
};

export default FormValidation;
