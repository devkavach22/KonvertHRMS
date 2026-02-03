import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "@/router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import {
  BankAccount,
  getBankAccounts,
  deleteBankAccount,
} from "./BankAccountServices";
import { toast } from "react-toastify";
import AddEditBankAccountModal from "./AddEditBankAccountModal";

interface GroupedData {
  groupName: string;
  items: BankAccount[];
  count: number;
  isGroup: boolean;
}

const BankAccountKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null,
  );

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>('none');
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getBankAccounts();

      // FIX: Map the specific [id, name] structure from your backend
      const mappedData = response.map((item: any) => ({
        ...item,
        id: String(item.id),
        key: String(item.id),

        // Extract Bank Name from [id, "Name"]
        display_bank: Array.isArray(item.bank_id)
          ? item.bank_id[1]
          : item.bank_name || "N/A",

        // Extract Partner/Account Holder from [id, "Name"]
        display_partner: Array.isArray(item.partner_id)
          ? item.partner_id[1]
          : item.partner_name || "N/A",

        // Extract Currency from [id, "Name"]
        display_currency: Array.isArray(item.currency_id)
          ? item.currency_id[1]
          : item.currency || "INR",

        // Handle boolean 'false' for empty IFSC
        display_ifsc:
          item.bank_iafc_code === false ? "N/A" : item.bank_iafc_code,
      }));

      setData(mappedData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this bank account?")) {
      try {
        await deleteBankAccount(id);
        toast.success("Account deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  // Group by functionality
  const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'bank_name', label: 'Group by Bank' },
    { value: 'currency', label: 'Group by Currency' },
    { value: 'ifsc_availability', label: 'Group by IFSC Availability' },
    { value: 'account_type', label: 'Group by Account Type' }
  ];



  const getAccountType = (accountNumber: string) => {
    if (!accountNumber) return 'Unknown Type';
    
    const length = accountNumber.length;
    const firstDigit = accountNumber.charAt(0);
    
    // Common Indian bank account number patterns
    if (length >= 15 && length <= 18) return 'Savings Account (15-18 digits)';
    if (length >= 9 && length <= 14) return 'Current Account (9-14 digits)';
    if (length >= 6 && length <= 8) return 'Short Account (6-8 digits)';
    if (firstDigit === '0') return 'Zero-Prefix Account';
    if (length > 18) return 'Long Account (18+ digits)';
    return 'Standard Account';
  };

  const getIfscAvailability = (ifsc: string) => {
    if (!ifsc || ifsc === 'N/A' || ifsc === '-' || ifsc === '') return 'No IFSC Code';
    if (ifsc.length === 11) return 'Valid IFSC (11 chars)';
    if (ifsc.length < 11) return 'Short IFSC Code';
    return 'Long IFSC Code';
  };

  const getAccountNumberPattern = (accountNumber: string) => {
    if (!accountNumber) return 'No Pattern';
    
    const hasLetters = /[a-zA-Z]/.test(accountNumber);
    const hasNumbers = /[0-9]/.test(accountNumber);
    const hasSpecialChars = /[^a-zA-Z0-9]/.test(accountNumber);
    
    if (hasLetters && hasNumbers && hasSpecialChars) return 'Alphanumeric + Special';
    if (hasLetters && hasNumbers) return 'Alphanumeric';
    if (hasNumbers && hasSpecialChars) return 'Numeric + Special';
    if (hasNumbers) return 'Numeric Only';
    if (hasLetters) return 'Alphabetic Only';
    return 'Other Pattern';
  };

  const groupDataByField = (data: BankAccount[], field: string): GroupedData[] => {
    if (field === 'none') return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = '';
      
      switch (field) {
        case 'bank_name':
          groupKey = (item as any).display_bank || 'Unknown Bank';
          break;
        case 'currency':
          groupKey = (item as any).display_currency || 'Unknown Currency';
          break;
        case 'ifsc_availability':
          groupKey = getIfscAvailability((item as any).display_ifsc);
          break;
        case 'account_type':
          groupKey = getAccountType(item.acc_number);
          break;
      
      
        default:
          groupKey = 'All Accounts';
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
      return <DatatableKHR data={data} columns={columns} selection={true} />;
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
                <span className="badge badge-primary ms-2">{group.count} accounts</span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-credit-card me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  {groupBy === 'ifsc_availability' && (
                    <small className="text-info">
                      <i className="ti ti-code me-1"></i>
                      With IFSC: <strong>{group.items.filter(item => 
                        (item as any).display_ifsc && 
                        (item as any).display_ifsc !== 'N/A' && 
                        (item as any).display_ifsc !== '-'
                      ).length}</strong>
                    </small>
                  )}
                  {groupBy === 'account_type' && (
                    <small className="text-success">
                      <i className="ti ti-hash me-1"></i>
                      Avg Length: <strong>{Math.round(group.items.reduce((sum, item) => sum + (item.acc_number?.length || 0), 0) / group.count)} digits</strong>
                    </small>
                  )}
                  {groupBy === 'currency' && (
                    <small className="text-warning">
                      <i className="ti ti-currency-rupee me-1"></i>
                      Currency: <strong>{group.groupName}</strong>
                    </small>
                  )}
                  <small className="text-secondary">
                    <i className="ti ti-list me-1"></i>
                    Sample: <strong>{group.items[0]?.acc_number?.substring(0, 8)}***</strong>
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
                  selection={true}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const columns = [
    // {
    //   title: "Account Holder",
    //   dataIndex: "display_partner", // Uses the mapped name
    //   render: (text: string) => (
    //     <span className="fw-bold text-dark">{text}</span>
    //   ),
    //   sorter: (a: any, b: any) =>
    //     (a.display_partner || "").localeCompare(b.display_partner || ""),
    // },
    {
      title: "Bank Name",
      dataIndex: "display_bank",
      render: (text: string) => <span className="fw-medium">{text}</span>,
    },
    {
      title: "Account Number",
      dataIndex: "acc_number",
      render: (text: string) => (
        <span className="text-primary font-monospace">{text}</span>
      ),
    },
    {
      title: "Currency",
      dataIndex: "display_currency",
    },
    {
      title: "IFSC",
      dataIndex: "display_ifsc",
      render: (text: string) => <span className="text-muted">{text}</span>,
    },
    {
      title: "Actions",
      render: (_: any, record: BankAccount) => (
        <div className="d-flex align-items-center">
          <Link
            to="#"
            className="btn btn-sm btn-light me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_bank_account_modal"
            onClick={() => setSelectedAccount(record)}
            title="Edit"
          >
            <i className="ti ti-edit text-blue" />
          </Link>
          <Link
            to="#"
            className="btn btn-sm btn-light"
            onClick={() => handleDelete(String(record.id))}
            title="Delete"
          >
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
          <div onClick={() => setSelectedAccount(null)}>
            <CommonHeader
              title="Bank Accounts"
              parentMenu="HR"
              activeMenu="Accounts"
              routes={routes}
              buttonText="Add Account"
              modalTarget="#add_bank_account_modal"
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
                <div className="text-center p-5">
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
                          ({groupedData.length} groups, {data.length} total accounts)
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
      </div>
      <AddEditBankAccountModal
        onSuccess={fetchData}
        data={selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </>
  );
};

export default BankAccountKHR;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "@/router/all_routes";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// // import AddEditBankAccountModal from "./AddEditBankAccountModal";
// import {
//   //   getBankAccounts,
//   //   deleteBankAccount,
//   BankAccount,
//   getBankAccounts,
// } from "./BankAccountServices";
// import { toast } from "react-toastify";
// import AddEditBankAccountModal from "./AddEditBankAccountModal";

// const BankAccountKHR = () => {
//   const routes = all_routes;
//   const [data, setData] = useState<BankAccount[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
//     null
//   );

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await getBankAccounts();
//       const mappedData = response.map((item: any) => ({
//         ...item,
//         id: String(item.id),
//         key: String(item.id),
//         // Handle [id, name] array structure from API for the bank name
//         display_bank: Array.isArray(item.bank_id)
//           ? item.bank_id[1]
//           : item.bank_name || "N/A",
//       }));
//       setData(mappedData);
//     } catch (error) {
//       toast.error("Failed to load accounts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   //   const handleDelete = async (id: string) => {
//   //     if (window.confirm("Delete this bank account?")) {
//   //       try {
//   //         await deleteBankAccount(id);
//   //         toast.success("Account deleted");
//   //         fetchData();
//   //       } catch (error) {
//   //         toast.error("Delete failed");
//   //       }
//   //     }
//   //   };

//   const columns = [
//     // {
//     //   title: "Account Holder",
//     //   dataIndex: "acc_holder_name",
//     //   render: (text: string) => (
//     //     <span className="fw-bold text-dark">{text}</span>
//     //   ),
//     //   sorter: (a: any, b: any) =>
//     //     a.acc_holder_name.localeCompare(b.acc_holder_name),
//     // },
//     {
//       title: "Account Number",
//       dataIndex: "acc_number",
//       render: (text: string) => (
//         <span className="text-blue fw-medium">{text}</span>
//       ),
//     },
//     {
//       title: "Bank Name",
//       dataIndex: "display_bank",
//     },
//     {
//       title: "IFSC",
//       dataIndex: "ifsc_code",
//     },
//     {
//       title: "Status",
//       dataIndex: "is_trusted",
//       render: (trusted: boolean) => (
//         <span
//           className={`badge ${
//             trusted ? "badge-soft-success" : "badge-soft-secondary"
//           }`}
//         >
//           {trusted ? "Trusted" : "Standard"}
//         </span>
//       ),
//     },
//     // {
//     //   title: "Actions",
//     //   render: (_: any, record: BankAccount) => (
//     //     <div className="action-icon">
//     //       <Link
//     //         to="#"
//     //         className="me-2"
//     //         data-bs-toggle="modal"
//     //         data-bs-target="#add_bank_account_modal"
//     //         onClick={() => setSelectedAccount(record)}
//     //       >
//     //         <i className="ti ti-edit text-blue" />
//     //       </Link>
//     //       <Link to="#" onClick={() => handleDelete(String(record.id))}>
//     //         <i className="ti ti-trash text-danger" />
//     //       </Link>
//     //     </div>
//     //   ),
//     // },
//   ];

//   return (
//     <>
//       <div className="page-wrapper">
//         <div className="content">
//           <div onClick={() => setSelectedAccount(null)}>
//             <CommonHeader
//               title="Bank Accounts"
//               parentMenu="HR"
//               activeMenu="Accounts"
//               routes={routes}
//               buttonText="Add Account"
//               modalTarget="#add_bank_account_modal"
//             />
//           </div>

//           <div className="card">
//             <div className="card-body p-0">
//               {loading ? (
//                 <div className="text-center p-5">
//                   <div
//                     className="spinner-border text-primary"
//                     role="status"
//                   ></div>
//                 </div>
//               ) : (
//                 <DatatableKHR data={data} columns={columns} selection={true} />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <AddEditBankAccountModal onSuccess={fetchData} data={selectedAccount} />
//     </>
//   );
// };

// export default BankAccountKHR;
