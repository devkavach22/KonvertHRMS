import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditIndustriesModal from "./AddEditIndustriesModal";
import { getIndustries, deleteIndustry, Industry } from "./IndustriesServices";
import { toast } from "react-toastify";
import { all_routes } from "@/router/all_routes";

const IndustriesKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    null
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getIndustries();

      // Robust Data Extraction
      let rawArray: any[] = [];
      if (Array.isArray(response)) rawArray = response;
      else if (response?.data && Array.isArray(response.data))
        rawArray = response.data;
      else if (response?.data?.data && Array.isArray(response.data.data))
        rawArray = response.data.data;

      const mapped = rawArray.map((item: any) => ({
        id: String(item.id),
        name: item.name || "-",
        full_name: item.full_name || "-",
        key: String(item.id),
      }));
      setData(mapped);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load industries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this industry?")) {
      try {
        await deleteIndustry(id);
        toast.success("Industry deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete industry");
      }
    }
  };

  const columns = [
    {
      title: "Industry Name",
      dataIndex: "name",
      sorter: (a: Industry, b: Industry) => a.name.localeCompare(b.name),
      render: (text: string) => (
        <span className="fs-14 fw-bold text-dark">{text}</span>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      sorter: (a: Industry, b: Industry) =>
        a.full_name.localeCompare(b.full_name),
      render: (text: string) => <span className="text-muted">{text}</span>,
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: Industry) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_industry_modal"
            onClick={() => setSelectedIndustry(record)}
          >
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id!)}>
            <i className="ti ti-trash text-danger" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div onClick={() => setSelectedIndustry(null)}>
          <CommonHeader
            title="Industries"
            parentMenu="HR"
            activeMenu="Industries"
            routes={routes}
            buttonText="Add Industry"
            modalTarget="#add_industry_modal"
          />
        </div>
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2 text-muted fw-semibold">
                  Loading Industries...
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <DatatableKHR data={data} columns={columns} />
              </div>
            )}
          </div>
        </div>
      </div>
      <AddEditIndustriesModal onSuccess={fetchData} data={selectedIndustry} />
    </div>
  );
};

export default IndustriesKHR;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddEditIndustriesModal from "./AddEditIndustriesModal";
// import { getIndustries, deleteIndustry, Industry } from "./IndustriesServices";
// import { toast } from "react-toastify";
// import { all_routes } from "@/router/all_routes";

// const IndustriesKHR = () => {
//   const routes = all_routes;
//   const [data, setData] = useState<Industry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
//     null
//   );

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response: any = await getIndustries();
//       const rawArray = response?.data || response || [];
//       const mapped = rawArray.map((item: any) => ({
//         id: String(item.id),
//         name: item.name || "-",
//         full_name: item.full_name || "-",
//         key: String(item.id),
//       }));
//       setData(mapped);
//     } catch (error) {
//       toast.error("Failed to load industries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (window.confirm("Delete this industry?")) {
//       await deleteIndustry(id);
//       toast.success("Industry deleted");
//       fetchData();
//     }
//   };

//   const columns = [
//     { title: "Industry Name", dataIndex: "name", sorter: true },
//     { title: "Full Name", dataIndex: "full_name", sorter: true },
//     {
//       title: "Actions",
//       render: (_: any, record: Industry) => (
//         <div className="action-icon d-inline-flex">
//           <Link
//             to="#"
//             className="me-2"
//             data-bs-toggle="modal"
//             data-bs-target="#add_industry_modal"
//             onClick={() => setSelectedIndustry(record)}
//           >
//             <i className="ti ti-edit text-primary" />
//           </Link>
//           <Link to="#" onClick={() => handleDelete(record.id!)}>
//             <i className="ti ti-trash text-danger" />
//           </Link>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div onClick={() => setSelectedIndustry(null)}>
//           <CommonHeader
//             title="Industries"
//             parentMenu="HR"
//             activeMenu="Industries"
//             routes={routes}
//             buttonText="Add Industry"
//             modalTarget="#add_industry_modal"
//           />
//         </div>
//         <div className="card">
//           <div className="card-body">
//             {loading ? (
//               <div className="text-center p-4">Loading...</div>
//             ) : (
//               <DatatableKHR data={data} columns={columns} />
//             )}
//           </div>
//         </div>
//       </div>
//       <AddEditIndustriesModal onSuccess={fetchData} data={selectedIndustry} />
//     </div>
//   );
// };

// export default IndustriesKHR;
