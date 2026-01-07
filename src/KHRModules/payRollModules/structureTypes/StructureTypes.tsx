import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { all_routes } from "@/router/all_routes";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

import AddStructureTypeModal from "./AddStructureType";
import {
  GetStructureTypes,
  TBSelector,
  updateState,
} from "@/Store/Reducers/TBSlice";
import { useDispatch, useSelector } from "react-redux";

/* ================= TYPES ================= */

interface StructureType {
  id: number;
  name: string;
  country: string;
  default_wage_type: string;
  default_schedule_pay: string;
  default_working_hours: string;
  regular_pay_structure: string;
  default_work_entry_type: string;
}

/* ================= COMPONENT ================= */

const StructureTypeKHR = () => {
  const routes = all_routes;

  const [data, setData] = useState<StructureType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const {
    isGetStructureTypes,
    isGetStructureTypesFetching,
    GetStructureTypesData,
  } = useSelector(TBSelector);

  const [selectedStructure, setSelectedStructure] =
    useState<StructureType | null>(null);

  /* ================= FETCH ================= */

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response: any = await getStructureTypes();
  //     console.log(response, "rrrr");

  //     const list = Array.isArray(response)
  //       ? response
  //       : Array.isArray(response?.data)
  //       ? response.data
  //       : [];

  //     const mappedData: StructureType[] = list.map((item: any) => ({
  //       id: item.id,

  //       name: item.name || "-",

  //       country: Array.isArray(item.country_id) ? item.country_id[1] : "-",

  //       default_wage_type: item.wage_type || "-",

  //       default_schedule_pay: item.default_schedule_pay || "-",

  //       default_working_hours: Array.isArray(item.default_resource_calendar_id)
  //         ? item.default_resource_calendar_id[1]
  //         : "-",

  //       regular_pay_structure: Array.isArray(item.default_struct_id)
  //         ? item.default_struct_id[1]
  //         : "-",

  //       default_work_entry_type: Array.isArray(item.default_work_entry_type_id)
  //         ? item.default_work_entry_type_id[1]
  //         : "-",
  //     }));

  //     setData(mappedData);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to load structure types");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   dispatch(GetStructureTypes());
  // }, []);

  useEffect(() => {
    if (isGetStructureTypes) {
      const mappedData: StructureType[] = GetStructureTypesData?.data?.map(
        (item: any) => {
          return {
            id: item.id,

            name: item.name || "-",

            country: Array.isArray(item.country_id) ? item.country_id[1] : "-",

            default_wage_type: item.wage_type || "-",

            default_schedule_pay: item.default_schedule_pay || "-",

            default_working_hours: Array.isArray(
              item.default_resource_calendar_id
            )
              ? item.default_resource_calendar_id[1]
              : "-",

            regular_pay_structure: Array.isArray(item.default_struct_id)
              ? item.default_struct_id[1]
              : "-",

            default_work_entry_type: Array.isArray(
              item.default_work_entry_type_id
            )
              ? item.default_work_entry_type_id[1]
              : "-",
          };
        }
      );
      setData(mappedData);
      dispatch(updateState({ isGetStructureTypes: false }));
    }
  }, [isGetStructureTypes, isGetStructureTypesFetching]);

  /* ================= TABLE COLUMNS ================= */

  const columns = [
    {
      title: "Structure Type",
      dataIndex: "name",
      sorter: (a: StructureType, b: StructureType) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: (a: StructureType, b: StructureType) =>
        a.country.localeCompare(b.country),
    },
    {
      title: "Wage Type",
      dataIndex: "default_wage_type",
      render: (text: string) => (
        <span className="badge badge-info-transparent">{text}</span>
      ),
    },
    {
      title: "Scheduled Pay",
      dataIndex: "default_schedule_pay",
    },
    {
      title: "Working Hours",
      dataIndex: "default_working_hours",
    },
    {
      title: "Regular Pay Structure", // ✅ NEW COLUMN
      dataIndex: "regular_pay_structure",
      sorter: (a: StructureType, b: StructureType) =>
        a.regular_pay_structure.localeCompare(b.regular_pay_structure),
      render: (text: string) => (
        <span className="badge badge-warning-transparent">{text}</span>
      ),
    },
    {
      title: "Work Entry Type",
      dataIndex: "default_work_entry_type",
      render: (text: string) => (
        <span className="badge badge-success-transparent">{text}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_: any, record: StructureType) => (
        <button
          className="btn btn-sm btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#add_structure_type"
          onClick={() => setSelectedStructure(record)}
        >
          Edit
        </button>
      ),
    },
  ];

  /* ================= UI ================= */

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <CommonHeader
            title="Structure Types"
            parentMenu="Payroll"
            activeMenu="Structure Types"
            routes={routes}
            buttonText="Add Structure Type"
            modalTarget="#add_structure_type"
          />

          <div className="card">
            <div className="card-body p-0">
              {isGetStructureTypesFetching ? (
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

      {/* ================= MODAL ================= */}
      {/* <AddStructureTypeModal
        onSubmit={() => {
          fetchData();
          setSelectedStructure(null);
        }}
      /> */}
    </>
  );
};

export default StructureTypeKHR;
