import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditRegCategory from "./AddEditRegCategory";
import {
  getRegCategories,
  deleteRegCategory,
  RegCategory,
} from "./RegCategoryService";

interface GroupedData {
  groupName: string;
  items: RegCategory[];
  count: number;
  isGroup: boolean;
}

const RegCategoryKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<RegCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<RegCategory | null>(
    null,
  );

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>("none");
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      // Direct Service Call
      const response: any = await getRegCategories();

      const rawArray = Array.isArray(response) ? response : [];

      const mappedData = rawArray.map((item: any) => ({
        ...item,
        id: String(item.id),
        key: String(item.id), // Unique key for Table
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteRegCategory(id);
        toast.success("Category deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  // Group by functionality
  const groupByOptions = [
    { value: "none", label: "No Grouping" },
    { value: "category_type", label: "Group by Category Type" },
  ];

  const getFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase();
  };

  const getCategoryType = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("leave") || lowerType.includes("vacation"))
      return "Leave Related";
    if (lowerType.includes("work") || lowerType.includes("office"))
      return "Work Related";
    if (lowerType.includes("medical") || lowerType.includes("health"))
      return "Medical Related";
    if (lowerType.includes("personal") || lowerType.includes("family"))
      return "Personal Related";
    if (lowerType.includes("late") || lowerType.includes("early"))
      return "Time Related";
    return "General";
  };

  const getWordCount = (text: string) => {
    if (!text) return "0 Words";
    const count = text.trim().split(/\s+/).length;
    return `${count} Word${count !== 1 ? "s" : ""}`;
  };

  const getNameLength = (text: string) => {
    if (!text) return "Unknown";
    const len = text.length;
    if (len <= 5) return "Short (1-5 chars)";
    if (len <= 10) return "Medium (6-10 chars)";
    if (len <= 20) return "Long (11-20 chars)";
    return "Very Long (21+ chars)";
  };

  const groupDataByField = (
    data: RegCategory[],
    field: string,
  ): GroupedData[] => {
    if (field === "none") return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = "";

      switch (field) {
        case "alphabetical":
          groupKey = getFirstLetter(item.type);
          break;
        case "category_type":
          groupKey = getCategoryType(item.type);
          break;
        case "word_count":
          groupKey = getWordCount(item.type);
          break;
        case "length":
          groupKey = getNameLength(item.type);
          break;
        default:
          groupKey = "All Categories";
      }

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {});

    // Sort groups alphabetically
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([groupName, items]: [string, any]): GroupedData => ({
          groupName,
          items,
          count: items.length,
          isGroup: true,
        }),
      );
  };

  const toggleGroupExpansion = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleAllGroups = (expand: boolean) => {
    if (expand) {
      setExpandedGroups(new Set(groupedData.map((group) => group.groupName)));
    } else {
      setExpandedGroups(new Set());
    }
  };

  const handleGroupByChange = (value: string) => {
    setGroupBy(value);
    if (value === "none") {
      setGroupedData([]);
      setExpandedGroups(new Set());
    } else {
      const grouped = groupDataByField(data, value);
      setGroupedData(grouped);
      // Expand first group by default
      if (grouped.length > 0) {
        setExpandedGroups(new Set([grouped[0].groupName]));
      }
    }
  };

  // Update grouped data when main data changes
  useEffect(() => {
    if (data.length > 0 && groupBy) {
      handleGroupByChange(groupBy);
    }
  }, [data, groupBy]);

  const renderGroupedTable = () => {
    if (groupBy === "none") {
      return (
        <DatatableKHR
          data={data}
          columns={columns}
          selection={true}
          textKey="type"
        />
      );
    }

    return (
      <div className="grouped-table">
        {groupedData.map((group: GroupedData, groupIndex: number) => (
          <div
            key={`group-${groupIndex}-${group.groupName}`}
            className="group-section mb-4"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* Group Header */}
            <div
              className="group-header bg-light p-3 border rounded cursor-pointer d-flex justify-content-between align-items-center"
              onClick={() => toggleGroupExpansion(group.groupName)}
              style={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e9ecef",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }}
            >
              <div className="d-flex align-items-center">
                <i
                  className={`ti ${expandedGroups.has(group.groupName) ? "ti-chevron-down" : "ti-chevron-right"} me-2`}
                ></i>
                <h6 className="mb-0 fw-bold">{group.groupName}</h6>
                <span className="badge badge-primary ms-2">
                  {group.count} categories
                </span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-category me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  {groupBy === "length" && (
                    <small className="text-info">
                      <i className="ti ti-ruler me-1"></i>
                      Avg Length:{" "}
                      <strong>
                        {Math.round(
                          group.items.reduce(
                            (sum, item) => sum + item.type.length,
                            0,
                          ) / group.count,
                        )}{" "}
                        chars
                      </strong>
                    </small>
                  )}
                  {groupBy === "word_count" && (
                    <small className="text-success">
                      <i className="ti ti-text-size me-1"></i>
                      Avg Words:{" "}
                      <strong>
                        {Math.round(
                          group.items.reduce(
                            (sum, item) => sum + item.type.split(/\s+/).length,
                            0,
                          ) / group.count,
                        )}
                      </strong>
                    </small>
                  )}
                  <small className="text-warning">
                    <i className="ti ti-list me-1"></i>
                    Sample:{" "}
                    <strong>
                      {group.items[0]?.type.substring(0, 15)}
                      {group.items[0]?.type.length > 15 ? "..." : ""}
                    </strong>
                  </small>
                </div>
              </div>
            </div>

            {/* Group Content */}
            {expandedGroups.has(group.groupName) && (
              <div
                className="group-content mt-2"
                style={{ borderTop: "1px solid #e9ecef" }}
              >
                <DatatableKHR
                  data={group.items}
                  columns={columns}
                  selection={true}
                  textKey="type"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const columns = [
    {
      title: "Category Type",
      dataIndex: "type",
      render: (text: string) => (
        <span className="fs-14 fw-bold text-dark">{text}</span>
      ),
      sorter: (a: RegCategory, b: RegCategory) => a.type.localeCompare(b.type),
    },
    // {
    //   title: "Created Date",
    //   dataIndex: "Created_Date",
    //   sorter: (a: RegCategory, b: RegCategory) =>
    //     a.Created_Date.localeCompare(b.Created_Date),
    // },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: RegCategory) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_reg_cat_modal"
            onClick={() => setSelectedCategory(record)}
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
          <div onClick={() => setSelectedCategory(null)}>
            <CommonHeader
              title="Regularization Category"
              parentMenu="Settings"
              activeMenu="Reg Category"
              routes={routes}
              buttonText="Add Category"
              modalTarget="#add_reg_cat_modal"
              rightActions={
                <>
                  {/* Group By Dropdown */}
                  <div className="dropdown me-2">
                    <button
                      className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-layout-grid me-1" />
                      {groupByOptions.find((opt) => opt.value === groupBy)
                        ?.label || "Group By"}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      {groupByOptions.map((option) => (
                        <li key={option.value}>
                          <button
                            className={`dropdown-item ${groupBy === option.value ? "active" : ""}`}
                            onClick={() => handleGroupByChange(option.value)}
                          >
                            <i
                              className={`ti ${groupBy === option.value ? "ti-check" : "ti-point"} me-2`}
                            />
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              }
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
                  <div className="mt-2">Fetching Categories...</div>
                </div>
              ) : (
                <>
                  {/* Group By Info */}
                  {groupBy !== "none" && (
                    <div className="alert alert-info m-3 mb-0 d-flex justify-content-between align-items-center">
                      <div>
                        <i className="ti ti-info-circle me-2"></i>
                        <strong>Grouped by:</strong>{" "}
                        {
                          groupByOptions.find((opt) => opt.value === groupBy)
                            ?.label
                        }
                        <span className="ms-2">
                          ({groupedData.length} groups, {data.length} total
                          categories)
                        </span>
                      </div>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => toggleAllGroups(true)}
                          title="Expand All Groups"
                        >
                          <i className="ti ti-chevrons-down me-1"></i>
                          Expand All
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => toggleAllGroups(false)}
                          title="Collapse All Groups"
                        >
                          <i className="ti ti-chevrons-up me-1"></i>
                          Collapse All
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Render Table or Grouped Table */}
                  <div className="p-3">{renderGroupedTable()}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddEditRegCategory
        onSuccess={fetchData}
        data={selectedCategory}
        onClose={() => setSelectedCategory(null)} // <--- ADD THIS LINE
      />
    </>
  );
};

export default RegCategoryKHR;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { all_routes } from "../../../router/all_routes";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import {
//   EmployeeRegcategories,
//   createRegCategory,
//   TBSelector,
//   updateState,
// } from "@/Store/Reducers/TBSlice";
// import type { AppDispatch } from "@/Store";

// interface RegCategory {
//   id: string;
//   key: string;
//   Category_Type: string;
//   Created_Date: string;
// }

// const RegCategoryKHR = () => {
//   const routes = all_routes;
//   const dispatch = useDispatch<AppDispatch>();
//   const [data, setData] = useState<RegCategory[]>([]);
//   const [type, setType] = useState("");
//   const [editData, setEditData] = useState<RegCategory | null>(null);

//   const {
//     isEmployeeRegcategories,
//     isEmployeeRegcategoriesFetching,
//     EmployeeRegcategoriesData,
//     isCreateRegCategory,
//     isCreateRegCategoryFetching,
//     isError,
//     errorMessage,
//   } = useSelector(TBSelector);

//   // Fetch categories on mount
//   useEffect(() => {
//     dispatch(EmployeeRegcategories());
//   }, []);

//   // Map data when fetched
//   useEffect(() => {
//     if (isEmployeeRegcategories && EmployeeRegcategoriesData?.data) {
//       const mappedData: RegCategory[] = EmployeeRegcategoriesData.data.map(
//         (item: any) => ({
//           id: String(item.id),
//           key: String(item.id),
//           Category_Type: item.type || "-",
//           Created_Date: item.create_date || "-",
//         })
//       );
//       setData(mappedData);
//       dispatch(updateState({ isEmployeeRegcategories: false }));
//     }
//   }, [isEmployeeRegcategories, EmployeeRegcategoriesData]);

//   // Handle create success
//   useEffect(() => {
//     if (isCreateRegCategory) {
//       toast.success("Category created successfully!");
//       setType("");
//       dispatch(updateState({ isCreateRegCategory: false }));
//       dispatch(EmployeeRegcategories());
//       // Close modal
//       const closeBtn = document.getElementById("close-btn-regcat");
//       closeBtn?.click();
//     }
//   }, [isCreateRegCategory]);

//   // Handle error
//   useEffect(() => {
//     if (isError && errorMessage) {
//       toast.error(errorMessage);
//       dispatch(updateState({ isError: false, errorMessage: "" }));
//     }
//   }, [isError, errorMessage]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!type.trim()) {
//       toast.error("Please enter a category type");
//       return;
//     }
//     dispatch(createRegCategory({ type: type.trim() }));
//   };

//   // Clear form when modal opens for new entry
//   useEffect(() => {
//     const modalElement = document.getElementById("add_regcategory");
//     const handleShow = () => {
//       if (!editData) setType("");
//     };
//     const handleHidden = () => {
//       setType("");
//       setEditData(null);
//     };
//     modalElement?.addEventListener("show.bs.modal", handleShow);
//     modalElement?.addEventListener("hidden.bs.modal", handleHidden);
//     return () => {
//       modalElement?.removeEventListener("show.bs.modal", handleShow);
//       modalElement?.removeEventListener("hidden.bs.modal", handleHidden);
//     };
//   }, [editData]);

//   const columns = [
//     {
//       title: "Category Type",
//       dataIndex: "Category_Type",
//       render: (text: string) => (
//         <span className="fs-14 fw-medium text-dark">{text}</span>
//       ),
//       sorter: (a: RegCategory, b: RegCategory) =>
//         a.Category_Type.localeCompare(b.Category_Type),
//     },
//     {
//       title: "Created Date",
//       dataIndex: "Created_Date",
//       sorter: (a: RegCategory, b: RegCategory) =>
//         a.Created_Date.localeCompare(b.Created_Date),
//     },
//   ];

//   return (
//     <>
//       <div className="page-wrapper">
//         <div className="content">
//           <div onClick={() => setEditData(null)}>
//             <CommonHeader
//               title="Regularization Category"
//               parentMenu="Settings"
//               activeMenu="Regularization Category"
//               routes={routes}
//               buttonText="Add Category"
//               modalTarget="#add_regcategory"
//             />
//           </div>

//           <div className="card">
//             <div className="card-body p-0">
//               {isEmployeeRegcategoriesFetching ? (
//                 <div className="text-center p-5">
//                   <div className="spinner-border text-primary" role="status"></div>
//                   <div className="mt-2">Loading Categories...</div>
//                 </div>
//               ) : (
//                 <DatatableKHR
//                   data={data}
//                   columns={columns}
//                   selection={true}
//                   textKey="Category_Type"
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Category Modal */}
//       <div className="modal custom-modal fade" id="add_regcategory" role="dialog">
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header border-0">
//               <h5 className="modal-title">Add Regularization Category</h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 id="close-btn-regcat"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label">
//                     Category Type <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     required
//                     value={type}
//                     onChange={(e) => setType(e.target.value)}
//                     placeholder="Enter category type (e.g., Work From Home)"
//                   />
//                 </div>
//                 <div className="modal-footer border-0">
//                   <button
//                     type="button"
//                     className="btn btn-light"
//                     data-bs-dismiss="modal"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     disabled={isCreateRegCategoryFetching}
//                   >
//                     {isCreateRegCategoryFetching ? "Creating..." : "Create Category"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RegCategoryKHR;
