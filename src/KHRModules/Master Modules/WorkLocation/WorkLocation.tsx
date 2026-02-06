import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditWorkLocationModal from "./AddEditWorkLocationModal";
import moment from "moment";

import {
  getWorkLocations,
  deleteWorkLocation,
  WorkLocation as WorkLocationType,
  APIWorkLocation,
} from "./WorkLocationServices";

interface GroupedData {
  groupName: string;
  items: WorkLocationType[];
  count: number;
  isGroup: boolean;
}

const WorkLocation = () => {
  const routes = all_routes;
  const [data, setData] = useState<WorkLocationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] =
    useState<WorkLocationType | null>(null);

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>('none');
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getWorkLocations();
      const safeResult = Array.isArray(result) ? result : [];

      const mappedData: WorkLocationType[] = safeResult.map(
        (item: APIWorkLocation) => ({
          id: String(item.id),
          key: String(item.id),
          name: item.name || "-",
          location_type: item.location_type || "office",
          created_date: item.create_date || "-", // Changed to match common API response field
        }),
      );

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load work locations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await deleteWorkLocation(id);
      fetchData();
    }
  };

  // Group by functionality
  const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'location_type', label: 'Group by Location Type' },
    { value: 'location_category', label: 'Group by Location Category' },
  ];


  const getLocationCategory = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('office') || lowerName.includes('corporate') || lowerName.includes('hq') || lowerName.includes('headquarters')) return 'Office Locations';
    if (lowerName.includes('branch') || lowerName.includes('regional') || lowerName.includes('satellite')) return 'Branch Offices';
    if (lowerName.includes('warehouse') || lowerName.includes('storage') || lowerName.includes('depot')) return 'Warehouse & Storage';
    if (lowerName.includes('factory') || lowerName.includes('plant') || lowerName.includes('manufacturing')) return 'Manufacturing';
    if (lowerName.includes('retail') || lowerName.includes('store') || lowerName.includes('shop')) return 'Retail Locations';
    if (lowerName.includes('remote') || lowerName.includes('home') || lowerName.includes('virtual')) return 'Remote Locations';
    if (lowerName.includes('field') || lowerName.includes('site') || lowerName.includes('project')) return 'Field Locations';
    if (lowerName.includes('lab') || lowerName.includes('research') || lowerName.includes('development')) return 'Research & Development';
    return 'General Locations';
  };



  const getCreatedMonth = (dateStr: string) => {
    if (!dateStr || dateStr === '-') return 'Unknown Date';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch {
      return 'Invalid Date';
    }
  };

  const groupDataByField = (data: WorkLocationType[], field: string): GroupedData[] => {
    if (field === 'none') return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = '';
      
      switch (field) {
        case 'location_type':
          groupKey = item.location_type ? item.location_type.charAt(0).toUpperCase() + item.location_type.slice(1) : 'Unknown Type';
          break;
      
        case 'location_category':
          groupKey = getLocationCategory(item.name);
          break;
        case 'created_month':
          groupKey = getCreatedMonth(item.created_date);
          break;
        default:
          groupKey = 'All Locations';
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
                <span className="badge badge-primary ms-2">{group.count} locations</span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-map-pin me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  {groupBy === 'name_length' && (
                    <small className="text-info">
                      <i className="ti ti-ruler me-1"></i>
                      Avg Length: <strong>{Math.round(group.items.reduce((sum, item) => sum + item.name.length, 0) / group.count)} chars</strong>
                    </small>
                  )}
                  {groupBy === 'location_type' && (
                    <small className="text-success">
                      <i className="ti ti-category me-1"></i>
                      Type: <strong>{group.groupName}</strong>
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
      title: "Work Location Name",
      dataIndex: "name",
      render: (text: string) => <h6 className="fs-14 fw-medium">{text}</h6>,
      sorter: (a: WorkLocationType, b: WorkLocationType) =>
        a.name.length - b.name.length,
    },
    {
      title: "Location Type",
      dataIndex: "location_type",
      render: (type: string) => (
        <span className="badge badge-pill bg-light text-dark text-capitalize">
          {type}
        </span>
      ),
      sorter: (a: WorkLocationType, b: WorkLocationType) =>
        a.location_type.localeCompare(b.location_type),
    },
    // {
    //   title: "Created Date",
    //   dataIndex: "created_date",
    //   render: (date: string) => {
    //     if (!date || date === "-") return <span>-</span>;
    //     return <span>{moment(date).format("DD MMM YYYY")}</span>;
    //   },
    //   sorter: (a: WorkLocationType, b: WorkLocationType) =>
    //     new Date(a.created_date).getTime() - new Date(b.created_date).getTime(),
    // },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: any, record: WorkLocationType) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_work_location"
            onClick={() => setSelectedLocation(record)}
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
            <div onClick={() => setSelectedLocation(null)}>
              <CommonHeader
                title="Work Locations"
                parentMenu="HR"
                activeMenu="Locations"
                routes={routes}
                buttonText="Add Work Location"
                modalTarget="#add_work_location"
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
                            ({groupedData.length} groups, {data.length} total locations)
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
        <AddEditWorkLocationModal
          onSuccess={fetchData}
          data={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      </div>
    </>
  );
};

export default WorkLocation;
