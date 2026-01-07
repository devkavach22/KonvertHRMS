import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/Store/hooks";

import { all_routes } from "@/router/all_routes";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

import AddStructureTypeModal from "./AddSalaryStructure";
import {
  getSalaryStructure,
  TBSelector,
  updateState,
} from "@/Store/Reducers/TBSlice";

/* ================= TYPES ================= */

interface StructureType {
  name: string;
  typeName: string;
  countryName: string | null;
  schedulePay: string;
  reportName: string;
}

/* ================= COMPONENT ================= */

const SalaryStructure = () => {
  const routes = all_routes;

  const [data, setData] = useState<StructureType[]>([]);
  // const [loading, setLoading] = useState<boolean>(true); // Unused state

  // FIX: Use the typed dispatch hook
  const dispatch = useAppDispatch();

  const {
    isgetSalaryStructure,
    isgetSalaryStructureFetching,
    getSalaryStructureData,
  } = useSelector(TBSelector);

  const [selectedStructure, setSelectedStructure] =
    useState<StructureType | null>(null);

  useEffect(() => {
    dispatch(getSalaryStructure());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Added lint disable if you want to keep the dependency array empty intentionally

  // console.log(getSalaryStructureData, "getSalaryStructureData");

  useEffect(() => {
    if (isgetSalaryStructure) {
      const mappedData: StructureType[] =
        getSalaryStructureData?.data?.map((item: any) => ({
          name: item.name,
          typeName: item.typeName,
          countryName: item.countryName,
          schedulePay: item.schedulePay,
          reportName: item.reportName,
        })) || [];

      setData(mappedData);
      dispatch(updateState({ isgetSalaryStructure: false }));
    }
  }, [isgetSalaryStructure, getSalaryStructureData, dispatch]);

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Type",
      dataIndex: "typeName",
      render: (text: string) => (
        <span className="badge badge-info-transparent">{text}</span>
      ),
    },
    {
      title: "Country",
      dataIndex: "countryName",
      render: (text: string | null) => text ?? "-",
    },
    {
      title: "Scheduled Pay",
      dataIndex: "schedulePay",
      render: (text: string) => (
        <span className="badge badge-warning-transparent">{text}</span>
      ),
    },
    {
      title: "Report",
      dataIndex: "reportName",
    },
  ];

  /* ================= UI ================= */

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <CommonHeader
            title="Salary Structure"
            parentMenu="Payroll"
            activeMenu="Salary Structure"
            routes={routes}
            buttonText="Add Salary Structure"
            modalTarget="#add_salary_structure"
          />

          <div className="card">
            <div className="card-body p-0">
              {isgetSalaryStructureFetching ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" />
                  <div className="mt-2">Loading Structure Types...</div>
                </div>
              ) : (
                <DatatableKHR data={data} columns={columns} selection={false} />
              )}
            </div>
          </div>
        </div>
      </div>

      <AddStructureTypeModal
        onSubmit={() => {
          setSelectedStructure(null);
        }}
      />
    </>
  );
};

export default SalaryStructure;

// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// import { all_routes } from "@/router/all_routes";
// import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

// import AddStructureTypeModal from "./AddSalaryStructure";
// import { getSalaryStructure, TBSelector, updateState } from "@/Store/Reducers/TBSlice";
// import { useDispatch, useSelector } from "react-redux";

// /* ================= TYPES ================= */

// interface StructureType {
//   name: string;
//   typeName: string;
//   countryName: string | null;
//   schedulePay: string;
//   reportName: string;
// }

// /* ================= COMPONENT ================= */

// const SalaryStructure = () => {
//   const routes = all_routes;

//   const [data, setData] = useState<StructureType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const dispatch = useDispatch();

//   const {
//     isgetSalaryStructure,
//     isgetSalaryStructureFetching,
//     getSalaryStructureData,
//   } = useSelector(TBSelector);

//   const [selectedStructure, setSelectedStructure] =
//     useState<StructureType | null>(null);

//   useEffect(() => {
//     dispatch(getSalaryStructure());
//   }, []);
//   console.log(getSalaryStructureData, "getSalaryStructureData");

//   useEffect(() => {
//     if (isgetSalaryStructure) {
//       const mappedData: StructureType[] =
//         getSalaryStructureData?.data?.map((item: any) => ({
//           name: item.name,
//           typeName: item.typeName,
//           countryName: item.countryName,
//           schedulePay: item.schedulePay,
//           reportName: item.reportName,
//         })) || [];

//       setData(mappedData);
//       dispatch(updateState({ isgetSalaryStructure: false }));
//     }
//   }, [isgetSalaryStructure]);

//   /* ================= TABLE COLUMNS ================= */
//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//     },
//     {
//       title: "Type",
//       dataIndex: "typeName",
//       render: (text: string) => (
//         <span className="badge badge-info-transparent">{text}</span>
//       ),
//     },
//     {
//       title: "Country",
//       dataIndex: "countryName",
//       render: (text: string | null) => text ?? "-",
//     },
//     {
//       title: "Scheduled Pay",
//       dataIndex: "schedulePay",
//       render: (text: string) => (
//         <span className="badge badge-warning-transparent">{text}</span>
//       ),
//     },
//     {
//       title: "Report",
//       dataIndex: "reportName",
//     },
//   ];

//   /* ================= UI ================= */

//   return (
//     <>
//       <div className="page-wrapper">
//         <div className="content">
//           <CommonHeader
//             title="Salary Structure"
//             parentMenu="Payroll"
//             activeMenu="Salary Structure"
//             routes={routes}
//             buttonText="Add Salary Structure"
//             modalTarget="#add_salary_structure"
//           />

//           <div className="card">
//             <div className="card-body p-0">
//               {isgetSalaryStructureFetching ? (
//                 <div className="text-center p-5">
//                   <div className="spinner-border text-primary" />
//                   <div className="mt-2">Loading Structure Types...</div>
//                 </div>
//               ) : (
//                 <DatatableKHR data={data} columns={columns} selection={false} />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <AddStructureTypeModal
//         onSubmit={() => {
//           setSelectedStructure(null);
//         }}
//       />
//     </>
//   );
// };

// export default SalaryStructure;
