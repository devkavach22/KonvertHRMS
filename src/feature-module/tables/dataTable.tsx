import { datatable } from "../../core/data/json/datatable";
import Table from "../../core/common/dataTable/index";

type DataTableRow = {
  key: string;
  name: string;
  position: string;
  office: string;
  age: string;
  startDate: string;
  salary: string;
};

const DataTable = () => {
  const data = datatable;
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a: DataTableRow, b: DataTableRow) =>
        a.name.length - b.name.length,
    },
    {
      title: "Position",
      dataIndex: "position",
      sorter: (a: DataTableRow, b: DataTableRow) =>
        a.position.length - b.position.length,
    },
    {
      title: "Office",
      dataIndex: "office",
      sorter: (a: DataTableRow, b: DataTableRow) =>
        a.office.length - b.office.length,
    },
    {
      title: "Age",
      dataIndex: "age",
      sorter: (a: DataTableRow, b: DataTableRow) => a.age.length - b.age.length,
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      sorter: (a: DataTableRow, b: DataTableRow) =>
        a.startDate.length - b.startDate.length,
    },
    {
      title: "Salary",
      dataIndex: "salary",
      sorter: (a: DataTableRow, b: DataTableRow) =>
        a.salary.length - b.salary.length,
    },
  ];
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
     
        {/* /Page Header */}
     
      </div>
    </div>
  );
};

export default DataTable;
