import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import {
  ContractType,
  deleteContractType,
  getContractTypes,
} from "./HRContractTypeServices";
import { toast } from "react-toastify";
import { all_routes } from "@/router/all_routes";
import AddEditHRContractTypeModal from "./AddEditHRContractTypeModal";

interface GroupedData {
  groupName: string;
  items: ContractType[];
  count: number;
  isGroup: boolean;
}

const HRContractTypeKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<ContractType | null>(null);

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>('none');
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getContractTypes();
      const rawArray = response?.data || response || [];
      const mapped = rawArray.map((item: any) => ({
        id: String(item.id),
        name: item.name || "-",
        code: item.code || "-",
        country_name: item.country_name || "-",
        key: String(item.id),
      }));
      setData(mapped);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this contract type?")) {
      try {
        await deleteContractType(id);
        toast.success("Deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete record");
      }
    }
  };

  // Group by functionality
  const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'contract_category', label: 'Group by Contract Category' },
    { value: 'alphabetical', label: 'Group by First Letter' },
    { value: 'code_pattern', label: 'Group by Code Pattern' },
    { value: 'name_length', label: 'Group by Name Length' },
    { value: 'employment_type', label: 'Group by Employment Type' },
    { value: 'duration_type', label: 'Group by Duration Type' }
  ];

  const getFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase();
  };

  const getContractCategory = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('permanent') || lowerName.includes('regular') || lowerName.includes('full time') || lowerName.includes('fulltime')) return 'Permanent Contracts';
    if (lowerName.includes('temporary') || lowerName.includes('temp') || lowerName.includes('contract') || lowerName.includes('fixed')) return 'Temporary Contracts';
    if (lowerName.includes('part time') || lowerName.includes('parttime') || lowerName.includes('part-time')) return 'Part-Time Contracts';
    if (lowerName.includes('intern') || lowerName.includes('trainee') || lowerName.includes('apprentice')) return 'Training Contracts';
    if (lowerName.includes('consultant') || lowerName.includes('freelance') || lowerName.includes('contractor')) return 'Consulting Contracts';
    if (lowerName.includes('probation') || lowerName.includes('trial') || lowerName.includes('provisional')) return 'Probationary Contracts';
    if (lowerName.includes('seasonal') || lowerName.includes('project') || lowerName.includes('casual')) return 'Seasonal/Project Contracts';
    return 'General Contracts';
  };

  const getCodePattern = (code: string) => {
    if (!code || code === '-') return 'No Code';
    
    const hasNumbers = /\d/.test(code);
    const hasLetters = /[a-zA-Z]/.test(code);
    const hasSpecialChars = /[^a-zA-Z0-9]/.test(code);
    
    if (hasLetters && hasNumbers && hasSpecialChars) return 'Alphanumeric + Special';
    if (hasLetters && hasNumbers) return 'Alphanumeric Codes';
    if (hasNumbers && hasSpecialChars) return 'Numeric + Special';
    if (hasLetters && hasSpecialChars) return 'Alphabetic + Special';
    if (hasNumbers) return 'Numeric Only';
    if (hasLetters) return 'Alphabetic Only';
    return 'Other Pattern';
  };

  const getNameLength = (text: string) => {
    const length = text.length;
    if (length <= 10) return 'Short Names (≤10 chars)';
    if (length <= 20) return 'Medium Names (11-20 chars)';
    if (length <= 30) return 'Long Names (21-30 chars)';
    return 'Very Long Names (30+ chars)';
  };

  const getEmploymentType = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('employee') || lowerName.includes('staff') || lowerName.includes('worker')) return 'Employee Contracts';
    if (lowerName.includes('manager') || lowerName.includes('executive') || lowerName.includes('director')) return 'Management Contracts';
    if (lowerName.includes('vendor') || lowerName.includes('supplier') || lowerName.includes('partner')) return 'Vendor Contracts';
    if (lowerName.includes('service') || lowerName.includes('maintenance') || lowerName.includes('support')) return 'Service Contracts';
    return 'Standard Contracts';
  };

  const getDurationType = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('annual') || lowerName.includes('yearly') || lowerName.includes('year')) return 'Annual Contracts';
    if (lowerName.includes('monthly') || lowerName.includes('month')) return 'Monthly Contracts';
    if (lowerName.includes('daily') || lowerName.includes('day') || lowerName.includes('hourly')) return 'Short-term Contracts';
    if (lowerName.includes('indefinite') || lowerName.includes('permanent') || lowerName.includes('ongoing')) return 'Indefinite Contracts';
    return 'Standard Duration';
  };

  const groupDataByField = (data: ContractType[], field: string): GroupedData[] => {
    if (field === 'none') return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = '';
      
      switch (field) {
        case 'contract_category':
          groupKey = getContractCategory(item.name);
          break;
        case 'alphabetical':
          groupKey = getFirstLetter(item.name);
          break;
        case 'code_pattern':
          groupKey = getCodePattern(item.code);
          break;
        case 'name_length':
          groupKey = getNameLength(item.name);
          break;
        case 'employment_type':
          groupKey = getEmploymentType(item.name);
          break;
        case 'duration_type':
          groupKey = getDurationType(item.name);
          break;
        default:
          groupKey = 'All Contract Types';
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
      .map(([groupName, items]: [string, any]): GroupedData => ({
        groupName,
        items,
        count: items.length,
        isGroup: true
      }));
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
      setExpandedGroups(new Set(groupedData.map(group => group.groupName)));
    } else {
      setExpandedGroups(new Set());
    }
  };

  const handleGroupByChange = (value: string) => {
    setGroupBy(value);
    if (value === 'none') {
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
    if (data.length > 0 && groupBy !== 'none') {
      handleGroupByChange(groupBy);
    }
  }, [data]);

  const renderGroupedTable = () => {
    if (groupBy === 'none') {
      return <DatatableKHR data={data} columns={columns} />;
    }

    return (
      <div className="grouped-table">
        {groupedData.map((group: GroupedData, groupIndex: number) => (
          <div 
            key={`group-${groupIndex}-${group.groupName}`} 
            className="group-section mb-4" 
            style={{
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {/* Group Header */}
            <div 
              className="group-header bg-light p-3 border rounded cursor-pointer d-flex justify-content-between align-items-center"
              onClick={() => toggleGroupExpansion(group.groupName)}
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid #e9ecef'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
            >
              <div className="d-flex align-items-center">
                <i className={`ti ${expandedGroups.has(group.groupName) ? 'ti-chevron-down' : 'ti-chevron-right'} me-2`}></i>
                <h6 className="mb-0 fw-bold">{group.groupName}</h6>
                <span className="badge badge-primary ms-2">{group.count} types</span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-file-text me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  {groupBy === 'code_pattern' && (
                    <small className="text-info">
                      <i className="ti ti-code me-1"></i>
                      With Codes: <strong>{group.items.filter(item => item.code && item.code !== '-').length}</strong>
                    </small>
                  )}
                  {groupBy === 'name_length' && (
                    <small className="text-success">
                      <i className="ti ti-ruler me-1"></i>
                      Avg Length: <strong>{Math.round(group.items.reduce((sum, item) => sum + item.name.length, 0) / group.count)} chars</strong>
                    </small>
                  )}
                  {groupBy === 'contract_category' && (
                    <small className="text-warning">
                      <i className="ti ti-category me-1"></i>
                      Category: <strong>{group.groupName.split(' ')[0]}</strong>
                    </small>
                  )}
                  <small className="text-secondary">
                    <i className="ti ti-list me-1"></i>
                    Sample: <strong>{group.items[0]?.name.substring(0, 15)}{group.items[0]?.name.length > 15 ? '...' : ''}</strong>
                  </small>
                </div>
              </div>
            </div>

            {/* Group Content */}
            {expandedGroups.has(group.groupName) && (
              <div className="group-content mt-2" style={{ borderTop: '1px solid #e9ecef' }}>
                <DatatableKHR 
                  data={group.items} 
                  columns={columns}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const columns = [
    { title: "Contract Name", dataIndex: "name", sorter: true },
    {
      title: "Code",
      dataIndex: "code",
      sorter: true,
      render: (text: string) => (
        <span className="badge badge-soft-info">{text}</span>
      ),
    },
    // { title: "Country", dataIndex: "country_name", sorter: true },
    {
      title: "Actions",
      render: (_: any, record: ContractType) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_contract_type_modal"
            // FIX: Pass a copy {...record} to force modal useEffect to run
            onClick={() => setSelectedItem({ ...record })}
          >
            <i className="ti ti-edit text-primary" />
          </Link>
          <Link to="#" onClick={() => handleDelete(String(record.id))}>
            <i className="ti ti-trash text-danger" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content"> 
        <div onClick={() => setSelectedItem(null)}>
          <CommonHeader
            title="HR Contract Type"
            parentMenu="HR"
            activeMenu="HR Contract Type"
            routes={routes}
            buttonText="Add Contract Type"
            modalTarget="#add_contract_type_modal"
            rightActions={
              <>
                {/* Group By Dropdown */}
                <div className="dropdown me-2">
                  <button
                    className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-layout-grid me-1" />
                    {groupByOptions.find(opt => opt.value === groupBy)?.label || 'Group By'}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {groupByOptions.map((option) => (
                      <li key={option.value}>
                        <button
                          className={`dropdown-item ${groupBy === option.value ? 'active' : ''}`}
                          onClick={() => handleGroupByChange(option.value)}
                        >
                          <i className={`ti ${groupBy === option.value ? 'ti-check' : 'ti-point'} me-2`} />
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
        <div className="card shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center p-4">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
              </div>
            ) : (
              <>
                {/* Group By Info */}
                {groupBy !== 'none' && (
                  <div className="alert alert-info m-3 mb-0 d-flex justify-content-between align-items-center">
                    <div>
                      <i className="ti ti-info-circle me-2"></i>
                      <strong>Grouped by:</strong> {groupByOptions.find(opt => opt.value === groupBy)?.label}
                      <span className="ms-2">
                        ({groupedData.length} groups, {data.length} total contract types)
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
                <div className="p-3">
                  {renderGroupedTable()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <AddEditHRContractTypeModal onSuccess={fetchData} data={selectedItem} />
    </div>
  );
};

export default HRContractTypeKHR;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import {
//   ContractType,
//   deleteContractType,
//   getContractTypes,
// } from "./HRContractTypeServices";
// import { toast } from "react-toastify";
// import { all_routes } from "@/router/all_routes";
// import AddEditHRContractTypeModal from "./AddEditHRContractTypeModal";

// const HRContractTypeKHR = () => {
//   const routes = all_routes;
//   const [data, setData] = useState<ContractType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedItem, setSelectedItem] = useState<ContractType | null>(null);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response: any = await getContractTypes();
//       const rawArray = response?.data || response || [];
//       const mapped = rawArray.map((item: any) => ({
//         id: String(item.id),
//         name: item.name || "-",
//         code: item.code || "-",
//         country_name: item.country_name || "-",
//         key: String(item.id),
//       }));
//       setData(mapped);
//     } catch (error) {
//       toast.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (window.confirm("Are you sure?")) {
//       await deleteContractType(id);
//       toast.success("Deleted successfully");
//       fetchData();
//     }
//   };

//   const columns = [
//     { title: "Contract Name", dataIndex: "name", sorter: true },
//     { title: "Code", dataIndex: "code", sorter: true },
//     { title: "Country", dataIndex: "country_name", sorter: true },
//     {
//       title: "Actions",
//       render: (_: any, record: ContractType) => (
//         <div className="action-icon d-inline-flex">
//           <Link
//             to="#"
//             className="me-2"
//             data-bs-toggle="modal"
//             data-bs-target="#add_contract_type_modal"
//             onClick={() => setSelectedItem(record)}
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
//         <div onClick={() => setSelectedItem(null)}>
//           <CommonHeader
//             title="HR Contract Type"
//             parentMenu="HR"
//             activeMenu="HR Contract Type"
//             routes={routes}
//             buttonText="Add Contract Type"
//             modalTarget="#add_contract_type_modal"
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
//       <AddEditHRContractTypeModal onSuccess={fetchData} data={selectedItem} />
//     </div>
//   );
// };

// export default HRContractTypeKHR;
