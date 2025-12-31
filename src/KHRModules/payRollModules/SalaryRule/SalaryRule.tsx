import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { all_routes } from "@/router/all_routes";
import DatatableKHR from "@/CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "@/CommonComponent/HeaderKHR/HeaderKHR";

import AddSalaryRuleModal from "./AddSalaryRule";
import { getSalaryRules } from "./SalaryRuleService";

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
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSalaryRules();
      console.log(response,"responseddd");
      

      const mapped: SalaryRule[] = response.map((item: any) => ({
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
      }));

      setData(mapped);
    } catch (error) {
      toast.error("Failed to load salary rules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" />
                  <div className="mt-2">Loading Salary Rules...</div>
                </div>
              ) : (
                <DatatableKHR
                  data={data}
                  columns={columns}
                  selection={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <AddSalaryRuleModal onSuccess={fetchData} />
    </>
  );
};

export default SalaryRuleKHR;
