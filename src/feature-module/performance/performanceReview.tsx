import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import CommonSelect from "../../core/common/commonSelect";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
const PerformanceReview = () => {
  const routes = all_routes;
  type SelectOption = {
    value: string;
    label: string;
  };

  const yesNo: SelectOption[] = [
    { value: "Select", label: "Select" },
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];
  return (
    <>
      {/* Page Wrapper */}
    
      {/* /Page Wrapper */}
    </>
  );
};

export default PerformanceReview;
