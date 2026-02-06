import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditWorkEntryTypeModal from "./AddEditWorkEntryTypeModal";

import {
  getWorkEntryTypes,
  deleteWorkEntryType,
  WorkEntryType as WorkEntryTypeType,
  APIWorkEntryType,
} from "./WorkEntryTypeServices";

interface GroupedData {
  groupName: string;
  items: WorkEntryTypeType[];
  count: number;
  isGroup: boolean;
}

const WorkEntryType = () => {
  const routes = all_routes;
  const [data, setData] = useState<WorkEntryTypeType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<WorkEntryTypeType | null>(
    null,
  );

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>('none');
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getWorkEntryTypes();
      const safeResult = Array.isArray(result) ? result : [];

      const mappedData: WorkEntryTypeType[] = safeResult.map(
        (item: APIWorkEntryType) => ({
          id: String(item.id),
          key: String(item.id),
          name: typeof item.name === "string" ? item.name : "-",
          code: typeof item.code === "string" ? item.code : "-",
          external_code:
            typeof item.external_code === "string" ? item.external_code : "-",
          sequence: item.sequence || 0,
          color: item.color || 0,
          is_unforeseen: item.is_unforeseen || false,
          is_leave: item.is_leave || false,
          round_days: (typeof item.round_days === "string"
            ? item.round_days
            : "NO") as "NO" | "HALF" | "FULL",
        }),
      );

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load work entry types", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      await deleteWorkEntryType(id);
      fetchData();
    }
  };

  // Group by functionality
  const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'round_days', label: 'Group by Round Days' },
    { value: 'is_leave', label: 'Group by Leave Status' },
    { value: 'is_unforeseen', label: 'Group by Unforeseen Status' }
  ];





  const getLeaveStatus = (isLeave: boolean) => {
    return isLeave ? 'Leave Types' : 'Non-Leave Types';
  };

  const getUnforeseenStatus = (isUnforeseen: boolean) => {
    return isUnforeseen ? 'Unforeseen Types' : 'Planned Types';
  };

  const getColorRange = (color: number) => {
    if (color === 0) return 'No Color (0)';
    if (color <= 3) return 'Low Range (1-3)';
    if (color <= 6) return 'Medium Range (4-6)';
    if (color <= 9) return 'High Range (7-9)';
    return 'Very High Range (10+)';
  };

  const groupDataByField = (data: WorkEntryTypeType[], field: string): GroupedData[] => {
    if (field === 'none') return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = '';
      
      switch (field) {
        case 'round_days':
          groupKey = item.round_days || 'NO';
          break;
        case 'is_leave':
          groupKey = getLeaveStatus(item.is_leave);
          break;
        case 'is_unforeseen':
          groupKey = getUnforeseenStatus(item.is_unforeseen);
      
          break;
      
        default:
          groupKey = 'All Entry Types';
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
      return <DatatableKHR data={data} columns={columns} selection={true} textKey="name" />;
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
                    <i className="ti ti-clock me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  {groupBy === 'is_leave' && (
                    <small className="text-info">
                      <i className="ti ti-calendar-off me-1"></i>
                      Leave Types: <strong>{group.items.filter(item => item.is_leave).length}</strong>
                    </small>
                  )}
                  {groupBy === 'is_unforeseen' && (
                    <small className="text-warning">
                      <i className="ti ti-alert-triangle me-1"></i>
                      Unforeseen: <strong>{group.items.filter(item => item.is_unforeseen).length}</strong>
                    </small>
                  )}
                  {groupBy === 'color_range' && (
                    <small className="text-success">
                      <i className="ti ti-palette me-1"></i>
                      Avg Color: <strong>{Math.round(group.items.reduce((sum, item) => sum + item.color, 0) / group.count)}</strong>
                    </small>
                  )}
                  <small className="text-secondary">
                    <i className="ti ti-list me-1"></i>
                    Sample: <strong>{group.items[0]?.name.substring(0, 12)}{group.items[0]?.name.length > 12 ? '...' : ''}</strong>
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
                  textKey="name"
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
      title: "Name",
      dataIndex: "name",
      render: (text: string) => <h6 className="fs-14 fw-medium">{text}</h6>,
      sorter: (a: WorkEntryTypeType, b: WorkEntryTypeType) =>
        a.name.length - b.name.length,
    },
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Round Days",
      dataIndex: "round_days",
      render: (text: string) => (
        <span className="badge badge-pill bg-light text-dark">{text}</span>
      ),
    },
    {
      title: "Color",
      dataIndex: "color",
      render: (color: number) => (
        <span className="badge bg-primary rounded-circle p-2">{color}</span>
      ),
    },
    {
      title: "Unforeseen",
      dataIndex: "is_unforeseen",
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      title: "Is Leave",
      dataIndex: "is_leave",
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: WorkEntryTypeType) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_work_entry_type"
            onClick={() => setSelectedItem(record)}
          >
            <i className="ti ti-edit" />
          </Link>
          <Link to="#" onClick={() => handleDelete(record.id!)}>
            <i className="ti ti-trash" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content">
            <div onClick={() => setSelectedItem(null)}>
              <CommonHeader
                title="Work Entry Types"
                parentMenu="HR"
                activeMenu="Work Entries"
                routes={routes}
                buttonText="Add Work Entry Type"
                modalTarget="#add_work_entry_type"
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
              <div className="card-body">
                {loading ? (
                  <div className="text-center p-4">Loading data...</div>
                ) : (
                  <>
                    {/* Group By Info */}
                    {groupBy !== 'none' && (
                      <div className="alert alert-info mb-3 d-flex justify-content-between align-items-center">
                        <div>
                          <i className="ti ti-info-circle me-2"></i>
                          <strong>Grouped by:</strong> {groupByOptions.find(opt => opt.value === groupBy)?.label}
                          <span className="ms-2">
                            ({groupedData.length} groups, {data.length} total entry types)
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
                    {renderGroupedTable()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <AddEditWorkEntryTypeModal
          onSuccess={fetchData}
          data={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </div>
    </>
  );
};

export default WorkEntryType;
