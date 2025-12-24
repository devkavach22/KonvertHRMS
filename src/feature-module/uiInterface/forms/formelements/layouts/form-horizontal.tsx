
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../../../../router/all_routes";
import { Lock, Mail } from "react-feather";

const FormHorizontal = () => {
  const routes = all_routes;
  const bloodgroup = [
    { value: "Select", label: "Select" },
    { value: "A+", label: "A+" },
    { value: "O+", label: "O+" },
    { value: "B+", label: "B+" },
    { value: "AB+", label: "AB+" },
  ];
  const statelist = [
    { value: "Select State", label: "Select State" },
    { value: "California", label: "California" },
    { value: "Texas", label: "Texas" },
    { value: "Florida", label: "Florida" },
  ];
  const countrylist = [
    { value: "Select Country", label: "Select Country" },
    { value: "USA", label: "USA" },
    { value: "France", label: "France" },
    { value: "India", label: "India" },
    { value: "Spain", label: "Spain" },
  ];

  return (
    <div>
      <div className="page-wrapper cardhead">
      
      </div>
    </div>
  );
};

export default FormHorizontal;
