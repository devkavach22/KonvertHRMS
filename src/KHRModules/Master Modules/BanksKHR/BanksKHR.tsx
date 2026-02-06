import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditBanksKHRModal from "./AddEditBanksKHRModal";
import { getBanks, deleteBank, Bank } from "./BanksServices";
import { toast } from "react-toastify";

interface GroupedData {
  groupName: string;
  items: Bank[];
  count: number;
  isGroup: boolean;
}

const BanksKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<Bank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>('none');
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getBanks();

      /** * FIX: Extracting the array from the "banks" key as per your JSON structure.
       * We also check for fallback keys to ensure the component doesn't crash.
       */
      const rawArray =
        response?.banks ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      const mappedData = rawArray.map((item: any) => ({
        ...item,
        id: String(item.id),
        key: String(item.id), // Unique key for AntDesign table logic
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load bank list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this bank?")) {
      try {
        await deleteBank(id);
        toast.success("Bank deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete bank");
      }
    }
  };

  // Group by functionality
  const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'bank_type', label: 'Group by Bank Type' },
    { value: 'code_availability', label: 'Group by Code Availability' },
    { value: 'regional_classification', label: 'Group by Regional Classification' }
  ];



  const getBankType = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('state bank') || lowerName.includes('sbi') || lowerName.includes('public sector')) return 'Public Sector Banks';
    if (lowerName.includes('hdfc') || lowerName.includes('icici') || lowerName.includes('axis') || lowerName.includes('kotak') || lowerName.includes('private')) return 'Private Sector Banks';
    if (lowerName.includes('cooperative') || lowerName.includes('urban') || lowerName.includes('rural') || lowerName.includes('district')) return 'Cooperative Banks';
    if (lowerName.includes('regional') || lowerName.includes('gramin') || lowerName.includes('local')) return 'Regional Rural Banks';
    if (lowerName.includes('foreign') || lowerName.includes('international') || lowerName.includes('global')) return 'Foreign Banks';
    if (lowerName.includes('payment') || lowerName.includes('wallet') || lowerName.includes('digital')) return 'Payment Banks';
    if (lowerName.includes('small finance') || lowerName.includes('microfinance') || lowerName.includes('micro')) return 'Small Finance Banks';
    return 'Other Banks';
  };

  const getCodeAvailability = (bank: Bank) => {
    const hasSwift = bank.swift_code && bank.swift_code !== '-';
    const hasMicr = bank.micr_code && bank.micr_code !== '-';
    const hasBic = bank.bic && bank.bic !== '-';
    
    const codeCount = [hasSwift, hasMicr, hasBic].filter(Boolean).length;
    
    if (codeCount === 3) return 'Complete Codes (All 3)';
    if (codeCount === 2) return 'Partial Codes (2 of 3)';
    if (codeCount === 1) return 'Minimal Codes (1 of 3)';
    return 'No Codes Available';
  };

  const getContactStatus = (bank: Bank) => {
    const hasPhone = bank.phone && bank.phone !== '-';
    const hasEmail = bank.email && bank.email !== '-';
    
    if (hasPhone && hasEmail) return 'Complete Contact Info';
    if (hasPhone || hasEmail) return 'Partial Contact Info';
    return 'No Contact Info';
  };

  const getNameLength = (text: string) => {
    const length = text.length;
    if (length <= 15) return 'Short Names (≤15 chars)';
    if (length <= 30) return 'Medium Names (16-30 chars)';
    if (length <= 45) return 'Long Names (31-45 chars)';
    return 'Very Long Names (45+ chars)';
  };

  const getRegionalClassification = (name: string) => {
    const lowerName = name.toLowerCase();
    console.log(lowerName,"lowername");
    
    if (lowerName.includes('national') || lowerName.includes('india') || lowerName.includes('bharti') || lowerName.includes('all india')) return 'National Banks';
    if (lowerName.includes('mumbai') || lowerName.includes('maharashtra') || lowerName.includes('western')) return 'Western Region';
    if (lowerName.includes('delhi') || lowerName.includes('punjab') || lowerName.includes('haryana') || lowerName.includes('northern')) return 'Northern Region';
    if (lowerName.includes('bangalore') || lowerName.includes('chennai') || lowerName.includes('karnataka') || lowerName.includes('tamil') || lowerName.includes('southern')) return 'Southern Region';
    if (lowerName.includes('kolkata') || lowerName.includes('bengal') || lowerName.includes('assam') || lowerName.includes('eastern')) return 'Eastern Region';
    if (lowerName.includes('rajasthan') || lowerName.includes('gujarat') || lowerName.includes('madhya') || lowerName.includes('central')) return 'Central Region';
    return 'Multi-Regional Banks';
  };
  

  const groupDataByField = (data: Bank[], field: string): GroupedData[] => {
    if (field === 'none') return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = '';
      
      switch (field) {
        case 'bank_type':
          groupKey = getBankType(item.name);
          break;
        case 'code_availability':
          groupKey = getCodeAvailability(item);
          break;
        case 'contact_status':
          groupKey = getContactStatus(item);
          break;
        case 'name_length':
          groupKey = getNameLength(item.name);
          break;
        case 'regional_classification':
          groupKey = getRegionalClassification(item.name);
          break;
        default:
          groupKey = 'All Banks';
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
                <span className="badge badge-primary ms-2">{group.count} banks</span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-building-bank me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  {groupBy === 'code_availability' && (
                    <small className="text-info">
                      <i className="ti ti-code me-1"></i>
                      With Codes: <strong>{group.items.filter(item => 
                        (item.swift_code && item.swift_code !== '-') || 
                        (item.micr_code && item.micr_code !== '-') || 
                        (item.bic && item.bic !== '-')
                      ).length}</strong>
                    </small>
                  )}
                  {groupBy === 'contact_status' && (
                    <small className="text-success">
                      <i className="ti ti-phone me-1"></i>
                      With Contact: <strong>{group.items.filter(item => 
                        (item.phone && item.phone !== '-') || 
                        (item.email && item.email !== '-')
                      ).length}</strong>
                    </small>
                  )}
                  {groupBy === 'name_length' && (
                    <small className="text-warning">
                      <i className="ti ti-ruler me-1"></i>
                      Avg Length: <strong>{Math.round(group.items.reduce((sum, item) => sum + item.name.length, 0) / group.count)} chars</strong>
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
    {
      title: "Bank Name",
      dataIndex: "name",
      render: (text: string) => (
        <span className="fs-14 fw-bold text-dark">{text}</span>
      ),
      sorter: (a: Bank, b: Bank) => a.name.localeCompare(b.name),
    },
    {
      title: "BIC (IFSC)",
      dataIndex: "bic",
      render: (text: string) => (
        <span className="badge bg-soft-info text-info">{text || "-"}</span>
      ),
    },
    {
      title: "Swift Code",
      dataIndex: "swift_code",
      render: (text: string) => text || "-",
    },
    {
      title: "MICR Code",
      dataIndex: "micr_code",
      render: (text: string) => text || "-",
    },
    {
      title: "Contact",
      dataIndex: "phone",
      render: (_: any, record: Bank) => (
        <div className="d-flex flex-column">
          <span className="fs-12">
            <i className="ti ti-phone me-1"></i>
            {record.phone}
          </span>
          <span className="fs-12 text-muted">
            <i className="ti ti-mail me-1"></i>
            {record.email}
          </span>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: Bank) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_bank_modal"
            onClick={() => setSelectedBank(record)}
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
          <div onClick={() => setSelectedBank(null)}>
            <CommonHeader
              title="Bank Master"
              parentMenu="HR"
              activeMenu="Banks"
              routes={routes}
              buttonText="Add Bank"
              modalTarget="#add_bank_modal"
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

          <div className="card">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <div className="mt-2">Fetching Bank Records...</div>
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
                          ({groupedData.length} groups, {data.length} total banks)
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

      <AddEditBanksKHRModal
        onSuccess={fetchData}
        data={selectedBank}
        onClose={() => setSelectedBank(null)}
      />
    </>
  );
};

export default BanksKHR;
