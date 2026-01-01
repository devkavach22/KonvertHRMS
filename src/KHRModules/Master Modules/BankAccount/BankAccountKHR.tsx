import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "@/router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddEditBankAccountModal from "./AddEditBankAccountModal";
import {
  //   getBankAccounts,
  //   deleteBankAccount,
  BankAccount,
  getBankAccounts,
} from "./BankAccountServices";
import { toast } from "react-toastify";
import AddEditBankAccountModal from "./AddEditBankAccountModal";

const BankAccountKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getBankAccounts();
      const mappedData = response.map((item: any) => ({
        ...item,
        id: String(item.id),
        key: String(item.id),
        // Handle [id, name] array structure from API for the bank name
        display_bank: Array.isArray(item.bank_id)
          ? item.bank_id[1]
          : item.bank_name || "N/A",
      }));
      setData(mappedData);
    } catch (error) {
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //   const handleDelete = async (id: string) => {
  //     if (window.confirm("Delete this bank account?")) {
  //       try {
  //         await deleteBankAccount(id);
  //         toast.success("Account deleted");
  //         fetchData();
  //       } catch (error) {
  //         toast.error("Delete failed");
  //       }
  //     }
  //   };

  const columns = [
    {
      title: "Account Holder",
      dataIndex: "acc_holder_name",
      render: (text: string) => (
        <span className="fw-bold text-dark">{text}</span>
      ),
      sorter: (a: any, b: any) =>
        a.acc_holder_name.localeCompare(b.acc_holder_name),
    },
    {
      title: "Account Number",
      dataIndex: "acc_number",
      render: (text: string) => (
        <span className="text-blue fw-medium">{text}</span>
      ),
    },
    {
      title: "Bank Name",
      dataIndex: "display_bank",
    },
    {
      title: "IFSC",
      dataIndex: "ifsc_code",
    },
    {
      title: "Status",
      dataIndex: "is_trusted",
      render: (trusted: boolean) => (
        <span
          className={`badge ${
            trusted ? "badge-soft-success" : "badge-soft-secondary"
          }`}
        >
          {trusted ? "Trusted" : "Standard"}
        </span>
      ),
    },
    // {
    //   title: "Actions",
    //   render: (_: any, record: BankAccount) => (
    //     <div className="action-icon">
    //       <Link
    //         to="#"
    //         className="me-2"
    //         data-bs-toggle="modal"
    //         data-bs-target="#add_bank_account_modal"
    //         onClick={() => setSelectedAccount(record)}
    //       >
    //         <i className="ti ti-edit text-blue" />
    //       </Link>
    //       <Link to="#" onClick={() => handleDelete(String(record.id))}>
    //         <i className="ti ti-trash text-danger" />
    //       </Link>
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div onClick={() => setSelectedAccount(null)}>
            <CommonHeader
              title="Bank Accounts"
              parentMenu="HR"
              activeMenu="Accounts"
              routes={routes}
              buttonText="Add Account"
              modalTarget="#add_bank_account_modal"
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
                </div>
              ) : (
                <DatatableKHR data={data} columns={columns} selection={true} />
              )}
            </div>
          </div>
        </div>
      </div>
      <AddEditBankAccountModal onSuccess={fetchData} data={selectedAccount} />
    </>
  );
};

export default BankAccountKHR;
