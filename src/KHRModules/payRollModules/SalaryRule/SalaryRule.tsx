import { useEffect, useState } from "react";
// Removed unused imports
import { useSelector } from "react-redux";
// Fix: Import Typed Dispatch
import { useAppDispatch } from "@/Store/hooks";

import { all_routes } from "@/router/all_routes";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

// Uncommented the Modal import so it works
import AddSalaryRuleModal from "./AddSalaryRule";

import {
  getSalaryRules,
  TBSelector,
  updateState,
} from "@/Store/Reducers/TBSlice";

/* ================= TYPES ================= */

interface SalaryRule {
  id: number;
  name: string;
  code: string;
  category: string;
  sequence: number;
  amount: string;
  active: boolean;
}

/* ================= COMPONENT ================= */

const SalaryRuleKHR = () => {
  const routes = all_routes;

  const [data, setData] = useState<SalaryRule[]>([]);
  // const [loading, setLoading] = useState(true); // Redux handles loading state mostly

  // Fix: Use Typed Dispatch
  const dispatch = useAppDispatch();

  const { isgetSalaryRules, isgetSalaryRulesFetching, getSalaryRulesData } =
    useSelector(TBSelector);

  /* ================= FETCH ================= */
  // Removed standalone fetchData() function because it caused the "map" error.
  // We use the useEffect below to handle data mapping from Redux state.

  useEffect(() => {
    dispatch(getSalaryRules());
  }, [dispatch]);

  // console.log(getSalaryRulesData, "getSalaryRulesData");

  useEffect(() => {
    // Map data only when the "Success" flag (isgetSalaryRules) is true
    if (isgetSalaryRules && getSalaryRulesData?.data) {
      const mappedData: SalaryRule[] = getSalaryRulesData.data.map(
        (item: any) => ({
          id: item.id,
          name: item.name,
          code: item.code,
          category: item.category_name || "-",
          sequence: item.sequence,
          amount:
            item.amount_select === "fix"
              ? `₹ ${item.amount_fix}`
              : item.amount_select,
          active: item.active,
        })
      );
      setData(mappedData);

      // Reset the success flag so we don't re-map unnecessarily
      dispatch(updateState({ isgetSalaryRules: false }));
    }
  }, [
    isgetSalaryRules,
    isgetSalaryRulesFetching,
    getSalaryRulesData,
    dispatch,
  ]);

  /* ================= TABLE ================= */

  const columns = [
    { title: "Rule Name", dataIndex: "name" },
    { title: "Code", dataIndex: "code" },
    { title: "Category", dataIndex: "category" },
    { title: "Sequence", dataIndex: "sequence" },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text: string) => (
        <span className="badge badge-info-transparent">{text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "active",
      render: (val: boolean) => (
        <span
          className={`badge ${
            val ? "badge-success-transparent" : "badge-danger-transparent"
          }`}
        >
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  /* ================= UI ================= */

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <CommonHeader
            title="Salary Rules"
            parentMenu="Payroll"
            activeMenu="Salary Rules"
            routes={routes}
            buttonText="Add Salary Rule"
            modalTarget="#add_salary_rule"
          />

          <div className="card">
            <div className="card-body p-0">
              {isgetSalaryRulesFetching ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" />
                  <div className="mt-2">Loading Salary Rules...</div>
                </div>
              ) : (
                <DatatableKHR data={data} columns={columns} selection={false} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pass a function to refresh data on success */}
      <AddSalaryRuleModal onSuccess={() => dispatch(getSalaryRules())} />
    </>
  );
};

export default SalaryRuleKHR;
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// import { all_routes } from "@/router/all_routes";
// import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

// // import AddSalaryRuleModal from "./AddSalaryRule";
// import { useDispatch, useSelector } from "react-redux";
// import { getSalaryRules, TBSelector, updateState } from "@/Store/Reducers/TBSlice";

// /* ================= TYPES ================= */

// interface SalaryRule {
//   id: number;
//   name: string;
//   code: string;
//   category: string;
//   sequence: number;
//   amount: string;
//   active: boolean;
// }

// /* ================= COMPONENT ================= */

// const SalaryRuleKHR = () => {
//   const routes = all_routes;

//   const [data, setData] = useState<SalaryRule[]>([]);
//   const [loading, setLoading] = useState(true);
//   const dispatch = useDispatch();
//   const {
//     isgetSalaryRules,
//     isgetSalaryRulesFetching,
//     getSalaryRulesData,
//   } = useSelector(TBSelector);

//   /* ================= FETCH ================= */

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await getSalaryRules();
//       console.log(response, "responseddd");

//       const mapped: SalaryRule[] = response.map((item: any) => ({
//         id: item.id,
//         name: item.name,
//         code: item.code,
//         category: item.category_name || "-",
//         sequence: item.sequence,
//         amount:
//           item.amount_select === "fix"
//             ? `₹ ${item.amount_fix}`
//             : item.amount_select,
//         active: item.active,
//       }));

//       setData(mapped);
//     } catch (error) {
//       toast.error("Failed to load salary rules");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     dispatch(getSalaryRules());
//   }, []);

//   console.log(getSalaryRulesData,"getSalaryRulesData");

//   useEffect(() => {
//     if (isgetSalaryRules) {
//       const mappedData: SalaryRule[] = getSalaryRulesData?.data.map((item: any) => ({
//         id: item.id,
//         name: item.name,
//         code: item.code,
//         category: item.category_name || "-",
//         sequence: item.sequence,
//         amount:
//           item.amount_select === "fix"
//             ? `₹ ${item.amount_fix}`
//             : item.amount_select,
//         active: item.active,
//       }));
//       setData(mappedData);
//       dispatch(updateState({ isgetSalaryRules: false }));
//     }
//   }, [isgetSalaryRules, isgetSalaryRulesFetching]);

//   /* ================= TABLE ================= */

//   const columns = [
//     { title: "Rule Name", dataIndex: "name" },
//     { title: "Code", dataIndex: "code" },
//     { title: "Category", dataIndex: "category" },
//     { title: "Sequence", dataIndex: "sequence" },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//       render: (text: string) => (
//         <span className="badge badge-info-transparent">{text}</span>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "active",
//       render: (val: boolean) => (
//         <span
//           className={`badge ${
//             val ? "badge-success-transparent" : "badge-danger-transparent"
//           }`}
//         >
//           {val ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
//   ];

//   /* ================= UI ================= */

//   return (
//     <>
//       <div className="page-wrapper">
//         <div className="content">
//           <CommonHeader
//             title="Salary Rules"
//             parentMenu="Payroll"
//             activeMenu="Salary Rules"
//             routes={routes}
//             buttonText="Add Salary Rule"
//             modalTarget="#add_salary_rule"
//           />

//           <div className="card">
//             <div className="card-body p-0">
//               {isgetSalaryRulesFetching ? (
//                 <div className="text-center p-5">
//                   <div className="spinner-border text-primary" />
//                   <div className="mt-2">Loading Salary Rules...</div>
//                 </div>
//               ) : (
//                 <DatatableKHR data={data} columns={columns} selection={false} />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <AddSalaryRuleModal onSuccess={fetchData} />
//     </>
//   );
// };

// export default SalaryRuleKHR;
