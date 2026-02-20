import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditSalaryRuleModal from "./AddEditSalaryRuleModal";
import {
  getSalaryRules,
  deleteSalaryRule,
  SalaryRuleData,
} from "./SalaryRuleService";
import { toast } from "react-toastify";

const SalaryRule = () => {
  const routes = all_routes;
  const [data, setData] = useState<SalaryRuleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRule, setSelectedRule] = useState<SalaryRuleData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getSalaryRules();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load salary rules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this salary rule?")) {
      try {
        await deleteSalaryRule(id.toString());
        toast.success("Salary Rule deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete rule");
      }
    }
  };

  const columns = [
    {
      title: "Rule Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <h6 className="fs-14 fw-medium text-dark">{text}</h6>
      ),
      sorter: (a: SalaryRuleData, b: SalaryRuleData) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <span className="badge bg-soft-info text-info fw-bold">{code}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      render: (val: any) => (Array.isArray(val) ? val[1] : val || "N/A"),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <span
          className={`badge ${active ? "badge-soft-success" : "badge-soft-danger"} d-inline-flex align-items-center`}
        >
          <i className="ti ti-point-filled me-1"></i>
          {active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      render: (_: any, record: SalaryRuleData) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_salary_rule"
            onClick={() => setSelectedRule(record)}
          >
            <i className="ti ti-edit text-primary" />
          </Link>
          <Link to="#" onClick={() => record.id && handleDelete(record.id)}>
            <i className="ti ti-trash text-danger" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div onClick={() => setSelectedRule(null)}>
          <CommonHeader
            title="Salary Rules"
            parentMenu="Payroll"
            activeMenu="Rules"
            routes={routes}
            buttonText="Add Salary Rule"
            modalTarget="#add_salary_rule"
          />
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body">
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2 text-muted fs-13">
                  Loading Salary Rules...
                </div>
              </div>
            ) : (
              <DatatableKHR
                data={data}
                columns={columns}
                selection={true}
                textKey="name"
              />
            )}
          </div>
        </div>

        <AddEditSalaryRuleModal
          onSuccess={fetchData}
          data={selectedRule}
          onClose={() => setSelectedRule(null)}
        />
      </div>
    </div>
  );
};

export default SalaryRule;
// import { useEffect, useState } from "react";
// // Removed unused imports
// import { useSelector } from "react-redux";
// // Fix: Import Typed Dispatch
// import { useAppDispatch } from "@/Store/hooks";

// import { all_routes } from "@/router/all_routes";
// import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

// // Uncommented the Modal import so it works
// import AddSalaryRuleModal from "./AddSalaryRule";

// import {
//   getSalaryRules,
//   TBSelector,
//   updateState,
// } from "@/Store/Reducers/TBSlice";

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
//   // const [loading, setLoading] = useState(true); // Redux handles loading state mostly

//   // Fix: Use Typed Dispatch
//   const dispatch = useAppDispatch();

//   const { isgetSalaryRules, isgetSalaryRulesFetching, getSalaryRulesData } =
//     useSelector(TBSelector);

//   /* ================= FETCH ================= */
//   // Removed standalone fetchData() function because it caused the "map" error.
//   // We use the useEffect below to handle data mapping from Redux state.

//   useEffect(() => {
//     dispatch(getSalaryRules());
//   }, [dispatch]);

//   // console.log(getSalaryRulesData, "getSalaryRulesData");

//   useEffect(() => {
//     // Map data only when the "Success" flag (isgetSalaryRules) is true
//     if (isgetSalaryRules && getSalaryRulesData?.data) {
//       const mappedData: SalaryRule[] = getSalaryRulesData.data.map(
//         (item: any) => ({
//           id: item.id,
//           name: item.name,
//           code: item.code,
//           category: item.category_name || "-",
//           sequence: item.sequence,
//           amount:
//             item.amount_select === "fix"
//               ? `₹ ${item.amount_fix}`
//               : item.amount_select,
//           active: item.active,
//         }),
//       );
//       setData(mappedData);

//       // Reset the success flag so we don't re-map unnecessarily
//       dispatch(updateState({ isgetSalaryRules: false }));
//     }
//   }, [
//     isgetSalaryRules,
//     isgetSalaryRulesFetching,
//     getSalaryRulesData,
//     dispatch,
//   ]);

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
//       {/* Pass a function to refresh data on success */}
//       <AddSalaryRuleModal onSuccess={() => dispatch(getSalaryRules())} />
//     </>
//   );
// };

// export default SalaryRuleKHR;
// // import { useEffect, useState } from "react";
// // import { toast } from "react-toastify";

// // import { all_routes } from "@/router/all_routes";
// // import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
// // import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

// // // import AddSalaryRuleModal from "./AddSalaryRule";
// // import { useDispatch, useSelector } from "react-redux";
// // import { getSalaryRules, TBSelector, updateState } from "@/Store/Reducers/TBSlice";

// // /* ================= TYPES ================= */

// // interface SalaryRule {
// //   id: number;
// //   name: string;
// //   code: string;
// //   category: string;
// //   sequence: number;
// //   amount: string;
// //   active: boolean;
// // }

// // /* ================= COMPONENT ================= */

// // const SalaryRuleKHR = () => {
// //   const routes = all_routes;

// //   const [data, setData] = useState<SalaryRule[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const dispatch = useDispatch();
// //   const {
// //     isgetSalaryRules,
// //     isgetSalaryRulesFetching,
// //     getSalaryRulesData,
// //   } = useSelector(TBSelector);

// //   /* ================= FETCH ================= */

// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await getSalaryRules();
// //       console.log(response, "responseddd");

// //       const mapped: SalaryRule[] = response.map((item: any) => ({
// //         id: item.id,
// //         name: item.name,
// //         code: item.code,
// //         category: item.category_name || "-",
// //         sequence: item.sequence,
// //         amount:
// //           item.amount_select === "fix"
// //             ? `₹ ${item.amount_fix}`
// //             : item.amount_select,
// //         active: item.active,
// //       }));

// //       setData(mapped);
// //     } catch (error) {
// //       toast.error("Failed to load salary rules");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     dispatch(getSalaryRules());
// //   }, []);

// //   console.log(getSalaryRulesData,"getSalaryRulesData");

// //   useEffect(() => {
// //     if (isgetSalaryRules) {
// //       const mappedData: SalaryRule[] = getSalaryRulesData?.data.map((item: any) => ({
// //         id: item.id,
// //         name: item.name,
// //         code: item.code,
// //         category: item.category_name || "-",
// //         sequence: item.sequence,
// //         amount:
// //           item.amount_select === "fix"
// //             ? `₹ ${item.amount_fix}`
// //             : item.amount_select,
// //         active: item.active,
// //       }));
// //       setData(mappedData);
// //       dispatch(updateState({ isgetSalaryRules: false }));
// //     }
// //   }, [isgetSalaryRules, isgetSalaryRulesFetching]);

// //   /* ================= TABLE ================= */

// //   const columns = [
// //     { title: "Rule Name", dataIndex: "name" },
// //     { title: "Code", dataIndex: "code" },
// //     { title: "Category", dataIndex: "category" },
// //     { title: "Sequence", dataIndex: "sequence" },
// //     {
// //       title: "Amount",
// //       dataIndex: "amount",
// //       render: (text: string) => (
// //         <span className="badge badge-info-transparent">{text}</span>
// //       ),
// //     },
// //     {
// //       title: "Status",
// //       dataIndex: "active",
// //       render: (val: boolean) => (
// //         <span
// //           className={`badge ${
// //             val ? "badge-success-transparent" : "badge-danger-transparent"
// //           }`}
// //         >
// //           {val ? "Active" : "Inactive"}
// //         </span>
// //       ),
// //     },
// //   ];

// //   /* ================= UI ================= */

// //   return (
// //     <>
// //       <div className="page-wrapper">
// //         <div className="content">
// //           <CommonHeader
// //             title="Salary Rules"
// //             parentMenu="Payroll"
// //             activeMenu="Salary Rules"
// //             routes={routes}
// //             buttonText="Add Salary Rule"
// //             modalTarget="#add_salary_rule"
// //           />

// //           <div className="card">
// //             <div className="card-body p-0">
// //               {isgetSalaryRulesFetching ? (
// //                 <div className="text-center p-5">
// //                   <div className="spinner-border text-primary" />
// //                   <div className="mt-2">Loading Salary Rules...</div>
// //                 </div>
// //               ) : (
// //                 <DatatableKHR data={data} columns={columns} selection={false} />
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <AddSalaryRuleModal onSuccess={fetchData} />
// //     </>
// //   );
// // };

// // export default SalaryRuleKHR;
