import React, { useState } from "react";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditAttendancePolicyModal from "./AddEditPublicHolidayModal";
import moment from "moment";

import {
  getAttendancePolicies,
  deleteAttendancePolicy,
  AttendancePolicy as AttendancePolicyType,
  APIAttendancePolicy,
} from "./PublicHolidayServices";

const AccuralPlanKHR = () => {
  const routes = all_routes;
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  // minimal columns/data for UI placeholder
  const columns: any[] = [];
  const data: any[] = [];

  const fetchData = () => {
    // placeholder for modal onSuccess
  };

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedPolicy(null)}>
            <CommonHeader
              title="Public Holiday List"
              parentMenu="HR"
              activeMenu="Public Holiday List"
              routes={routes}
              buttonText="Add Public Holiday"
              modalTarget="#add_attendance_policy"
            />
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Leave List</h5>
              <div className="mt-3">
                <DatatableKHR columns={columns} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditAttendancePolicyModal onSuccess={fetchData} data={selectedPolicy} />
    </div>
  );
};

export default AccuralPlanKHR;
