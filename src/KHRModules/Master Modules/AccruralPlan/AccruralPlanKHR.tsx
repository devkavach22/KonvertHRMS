import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditAccruralPlanModal from "./AddEditAccruralPlanModal";
import {
  getAccruralPlans,
  deleteAccruralPlan,
  AccruralPlan,
} from "./AccruralPlanServices";
import { toast } from "react-toastify";

const AccruralPlanKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<AccruralPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<AccruralPlan | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getAccruralPlans();

      // Handle response structure variations (array or object with data key)
      const rawArray =
        response?.data || (Array.isArray(response) ? response : []);

      const mappedData = rawArray.map((item: any) => ({
        ...item,
        id: String(item.id),
        key: String(item.id),
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load accrual plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this accrual plan?")) {
      try {
        await deleteAccruralPlan(id);
        toast.success("Plan deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete plan");
      }
    }
  };

  const columns = [
    {
      title: "Plan Name",
      dataIndex: "name",
      render: (text: string) => (
        <span className="fs-14 fw-bold text-dark">{text}</span>
      ),
      sorter: (a: AccruralPlan, b: AccruralPlan) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Carryover Date",
      dataIndex: "carryover_date",
      render: (text: string) => (
        <span className="badge bg-soft-info text-info text-capitalize">
          {text ? text.replace("_", " ") : "-"}
        </span>
      ),
    },
    {
      title: "Gain Time",
      dataIndex: "accrued_gain_time",
      render: (text: string) => (
        <span className="text-capitalize">{text || "-"}</span>
      ),
    },
    {
      title: "Based on Worked Time",
      dataIndex: "is_based_on_worked_time",
      render: (val: boolean) =>
        val ? (
          <span className="badge bg-soft-success text-success">Yes</span>
        ) : (
          <span className="badge bg-soft-secondary text-secondary">No</span>
        ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: AccruralPlan) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_accrural_plan_modal"
            onClick={() => setSelectedPlan(record)}
          >
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link to="#" onClick={() => handleDelete(String(record.id))}>
            <i className="ti ti-trash text-danger" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedPlan(null)}>
            <CommonHeader
              title="Accrual Plan"
              parentMenu="HR"
              activeMenu="Accrual Plans"
              routes={routes}
              buttonText="Add Plan"
              modalTarget="#add_accrural_plan_modal"
            />
          </div>

          <div className="card">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <div className="mt-2">Fetching Plans...</div>
                </div>
              ) : (
                <DatatableKHR data={data} columns={columns} selection={true} />
              )}
            </div>
          </div>
        </div>
      </div>

      <AddEditAccruralPlanModal onSuccess={fetchData} data={selectedPlan} />
    </>
  );
};

export default AccruralPlanKHR;
