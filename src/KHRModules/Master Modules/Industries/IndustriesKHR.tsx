import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditIndustriesModal from "./AddEditIndustriesModal";
import { getIndustries, deleteIndustry, Industry } from "./IndustriesServices";
import { toast } from "react-toastify";
import { all_routes } from "@/router/all_routes";

interface GroupedData {
  groupName: string;
  items: Industry[];
  count: number;
  isGroup: boolean;
}

const IndustriesKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    null,
  );

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>('none');
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

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

  // Group by functionality
  const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'industry_sector', label: 'Group by Industry Sector' }
  ];



  const getIndustrySector = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('tech') || lowerName.includes('software') || lowerName.includes('it') || lowerName.includes('digital') || lowerName.includes('computer')) return 'Technology';
    if (lowerName.includes('health') || lowerName.includes('medical') || lowerName.includes('pharma') || lowerName.includes('hospital') || lowerName.includes('care')) return 'Healthcare';
    if (lowerName.includes('finance') || lowerName.includes('bank') || lowerName.includes('insurance') || lowerName.includes('investment') || lowerName.includes('credit')) return 'Financial Services';
    if (lowerName.includes('education') || lowerName.includes('school') || lowerName.includes('university') || lowerName.includes('training') || lowerName.includes('learning')) return 'Education';
    if (lowerName.includes('retail') || lowerName.includes('store') || lowerName.includes('shop') || lowerName.includes('commerce') || lowerName.includes('sales')) return 'Retail & Commerce';
    if (lowerName.includes('manufacturing') || lowerName.includes('factory') || lowerName.includes('production') || lowerName.includes('industrial') || lowerName.includes('automotive')) return 'Manufacturing';
    if (lowerName.includes('construction') || lowerName.includes('building') || lowerName.includes('real estate') || lowerName.includes('property') || lowerName.includes('architecture')) return 'Construction & Real Estate';
    if (lowerName.includes('transport') || lowerName.includes('logistics') || lowerName.includes('shipping') || lowerName.includes('delivery') || lowerName.includes('aviation')) return 'Transportation & Logistics';
    if (lowerName.includes('energy') || lowerName.includes('oil') || lowerName.includes('gas') || lowerName.includes('renewable') || lowerName.includes('utilities')) return 'Energy & Utilities';
    if (lowerName.includes('food') || lowerName.includes('restaurant') || lowerName.includes('agriculture') || lowerName.includes('farming') || lowerName.includes('beverage')) return 'Food & Agriculture';
    if (lowerName.includes('media') || lowerName.includes('entertainment') || lowerName.includes('advertising') || lowerName.includes('marketing') || lowerName.includes('publishing')) return 'Media & Entertainment';
    if (lowerName.includes('consulting') || lowerName.includes('professional') || lowerName.includes('legal') || lowerName.includes('accounting') || lowerName.includes('advisory')) return 'Professional Services';
    return 'Other Industries';
  };

  const getNameLength = (text: string) => {
    const length = text.length;
    if (length <= 8) return 'Short (≤8 chars)';
    if (length <= 15) return 'Medium (9-15 chars)';
    if (length <= 25) return 'Long (16-25 chars)';
    return 'Very Long (25+ chars)';
  };





  const groupDataByField = (data: Industry[], field: string): GroupedData[] => {
    if (field === 'none') return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = '';
      
      switch (field) {
        case 'industry_sector':
          groupKey = getIndustrySector(item.name);
          break;
        default:
          groupKey = 'All Industries';
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
      return (
        <div className="table-responsive">
          <DatatableKHR data={data} columns={columns} />
        </div>
      );
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
                <span className="badge badge-primary ms-2">{group.count} industries</span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-building me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  {groupBy === 'name_length' && (
                    <small className="text-info">
                      <i className="ti ti-ruler me-1"></i>
                      Avg Length: <strong>{Math.round(group.items.reduce((sum, item) => sum + item.name.length, 0) / group.count)} chars</strong>
                    </small>
                  )}
                  {groupBy === 'industry_sector' && (
                    <small className="text-success">
                      <i className="ti ti-category me-1"></i>
                      Sector: <strong>{group.groupName}</strong>
                    </small>
                  )}
                  <small className="text-warning">
                    <i className="ti ti-list me-1"></i>
                    Sample: <strong>{group.items[0]?.name.substring(0, 15)}{group.items[0]?.name.length > 15 ? '...' : ''}</strong>
                  </small>
                </div>
              </div>
            </div>

            {/* Group Content */}
            {expandedGroups.has(group.groupName) && (
              <div className="group-content mt-2" style={{ borderTop: '1px solid #e9ecef' }}>
                <div className="table-responsive">
                  <DatatableKHR 
                    data={group.items} 
                    columns={columns}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
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
              <>
                {/* Group By Info */}
                {groupBy !== 'none' && (
                  <div className="alert alert-info m-3 mb-0 d-flex justify-content-between align-items-center">
                    <div>
                      <i className="ti ti-info-circle me-2"></i>
                      <strong>Grouped by:</strong> {groupByOptions.find(opt => opt.value === groupBy)?.label}
                      <span className="ms-2">
                        ({groupedData.length} groups, {data.length} total industries)
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
      <AddEditIndustriesModal
        onSuccess={fetchData}
        data={selectedIndustry}
        onClose={() => setSelectedIndustry(null)}
      />
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
