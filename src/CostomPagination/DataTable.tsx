import React from "react";
import { useFetchData } from "@/apiHandling/Hook/useFetchData";
import ReusableDataTable from "./ReusableDataTable";

const DataTable: React.FC = () => {
  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row: any) => (
        <span style={{ color: "#CD5C5C", fontWeight: "600" }}>
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    {
      key: "company",
      label: "Position",
      render: (row: any) => row.company?.title || "N/A",
    },
    {
      key: "city",
      label: "Office",
      render: (row: any) => row.address?.city || "N/A",
    },
    { key: "age", label: "Age" },
    { key: "birthDate", label: "Start Date" },
    {
      key: "salary",
      label: "Salary",
      render: (row: any) => (
        <span style={{ color: "#28a745", fontWeight: "600" }}>
          ${row.bank?.cardNumber ? "100,000" : "50,000"}
        </span>
      ),
    },
  ];

  return (
    <ReusableDataTable
      title="User Data Table"
      description="List of all users with search and pagination"
      columns={columns}
      fetchDataHook={useFetchData}
    />
  );
};

export default DataTable;
