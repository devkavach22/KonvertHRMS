import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditSkillModal from "./AddEditSkillModal";
import { getSkills, deleteSkill, Skill } from "./SkillServices";
import { toast } from "react-toastify";

interface GroupedData {
  groupName: string;
  items: Skill[];
  count: number;
  isGroup: boolean;
}

const SkillKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Group by functionality
  const [groupBy, setGroupBy] = useState<string>('none');
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getSkills();

      // Robust Data Extraction
      let rawArray: any[] = [];
      if (Array.isArray(response)) rawArray = response;
      else if (response?.data && Array.isArray(response.data))
        rawArray = response.data;
      else if (response?.data?.data && Array.isArray(response.data.data))
        rawArray = response.data.data;

      const mappedData: Skill[] = rawArray.map((item: any) => {
        const skillNamesArray = Array.isArray(item.skills)
          ? item.skills.map((s: any) => s.name)
          : [];

        const firstLevel =
          item.levels && item.levels.length > 0 ? item.levels[0] : {};

        return {
          id: String(item.skill_type_id),
          key: String(item.skill_type_id),
          skill_type_name: item.skill_type_name || "-",
          skill_names: skillNamesArray,
          skill_level_name: firstLevel.name || "-",
          level_progress: Number(firstLevel.level_progress) || 0,
          default_level: firstLevel.default_level || false,
        };
      });

      setData(mappedData);
    } catch (error) {
      console.error("Failed to load skills", error);
      toast.error("Could not load skills list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this skill group?")) {
      try {
        await deleteSkill(id);
        toast.success("Skill group deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  // Group by functionality
  const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'skill_category', label: 'Group by Skill Category' },
    { value: 'proficiency_level', label: 'Group by Proficiency Level' },
    { value: 'skill_count', label: 'Group by Skill Count' },
    { value: 'progress_range', label: 'Group by Progress Range' }
  ];



  const getSkillCategory = (skillTypeName: string) => {
    const lowerName = skillTypeName.toLowerCase();
    if (lowerName.includes('technical') || lowerName.includes('programming') || lowerName.includes('coding') || lowerName.includes('development')) return 'Technical Skills';
    if (lowerName.includes('language') || lowerName.includes('communication') || lowerName.includes('writing') || lowerName.includes('speaking')) return 'Language & Communication';
    if (lowerName.includes('management') || lowerName.includes('leadership') || lowerName.includes('team') || lowerName.includes('project')) return 'Management & Leadership';
    if (lowerName.includes('design') || lowerName.includes('creative') || lowerName.includes('art') || lowerName.includes('ui') || lowerName.includes('ux')) return 'Design & Creative';
    if (lowerName.includes('sales') || lowerName.includes('marketing') || lowerName.includes('business') || lowerName.includes('customer')) return 'Sales & Marketing';
    if (lowerName.includes('finance') || lowerName.includes('accounting') || lowerName.includes('budget') || lowerName.includes('analysis')) return 'Finance & Analysis';
    if (lowerName.includes('soft') || lowerName.includes('interpersonal') || lowerName.includes('social') || lowerName.includes('emotional')) return 'Soft Skills';
    if (lowerName.includes('certification') || lowerName.includes('license') || lowerName.includes('qualification')) return 'Certifications';
    return 'General Skills';
  };

  const getProficiencyLevel = (progress: number) => {
    if (progress === 0) return 'Not Started (0%)';
    if (progress <= 25) return 'Beginner (1-25%)';
    if (progress <= 50) return 'Intermediate (26-50%)';
    if (progress <= 75) return 'Advanced (51-75%)';
    if (progress <= 90) return 'Expert (76-90%)';
    return 'Master (91-100%)';
  };

  const getSkillCount = (skillNames: string[]) => {
    const count = skillNames.length;
    if (count === 0) return 'No Skills';
    if (count === 1) return 'Single Skill';
    if (count <= 3) return 'Few Skills (2-3)';
    if (count <= 6) return 'Multiple Skills (4-6)';
    if (count <= 10) return 'Many Skills (7-10)';
    return 'Extensive Skills (10+)';
  };

  const getProgressRange = (progress: number) => {
    if (progress === 0) return 'No Progress (0%)';
    if (progress <= 20) return 'Low Progress (1-20%)';
    if (progress <= 40) return 'Fair Progress (21-40%)';
    if (progress <= 60) return 'Good Progress (41-60%)';
    if (progress <= 80) return 'High Progress (61-80%)';
    return 'Excellent Progress (81-100%)';
  };

  const groupDataByField = (data: Skill[], field: string): GroupedData[] => {
    if (field === 'none') return [];

    const grouped = data.reduce((acc: any, item) => {
      let groupKey = '';
      
      switch (field) {
        case 'skill_category':
          groupKey = getSkillCategory(item.skill_type_name);
          break;
        case 'proficiency_level':
          groupKey = getProficiencyLevel(item.level_progress);
          break;
        case 'skill_count':
          groupKey = getSkillCount(item.skill_names);
          break;
        case 'default_level':
          groupKey = item.skill_level_name || 'No Level Set';
          break;
        case 'progress_range':
          groupKey = getProgressRange(item.level_progress);
          break;
        default:
          groupKey = 'All Skills';
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
          <DatatableKHR data={data} columns={columns} selection={true} />
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
                <span className="badge badge-primary ms-2">{group.count} skill types</span>
              </div>
              <div className="group-stats">
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="ti ti-award me-1"></i>
                    Total: <strong>{group.count}</strong>
                  </small>
                  {groupBy === 'proficiency_level' && (
                    <small className="text-info">
                      <i className="ti ti-trending-up me-1"></i>
                      Avg Progress: <strong>{Math.round(group.items.reduce((sum, item) => sum + item.level_progress, 0) / group.count)}%</strong>
                    </small>
                  )}
                  {groupBy === 'skill_count' && (
                    <small className="text-success">
                      <i className="ti ti-list me-1"></i>
                      Total Skills: <strong>{group.items.reduce((sum, item) => sum + item.skill_names.length, 0)}</strong>
                    </small>
                  )}
                  {groupBy === 'progress_range' && (
                    <small className="text-warning">
                      <i className="ti ti-chart-line me-1"></i>
                      Range: <strong>{Math.min(...group.items.map(item => item.level_progress))}% - {Math.max(...group.items.map(item => item.level_progress))}%</strong>
                    </small>
                  )}
                  <small className="text-secondary">
                    <i className="ti ti-tag me-1"></i>
                    Sample: <strong>{group.items[0]?.skill_type_name.substring(0, 15)}{group.items[0]?.skill_type_name.length > 15 ? '...' : ''}</strong>
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
                    selection={true}
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
      title: "Skill Type",
      dataIndex: "skill_type_name",
      render: (text: string) => (
        <span className="fs-14 fw-bold text-dark">{text}</span>
      ),
      sorter: (a: Skill, b: Skill) =>
        a.skill_type_name.localeCompare(b.skill_type_name),
    },
    {
      title: "Skills",
      dataIndex: "skill_names",
      render: (skills: string[]) => (
        <div className="d-flex flex-wrap gap-1">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="badge bg-soft-primary text-primary border border-primary-light"
            >
              {skill}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Default Level",
      dataIndex: "skill_level_name",
      render: (text: string) => (
        <span className="badge bg-light text-dark border">{text}</span>
      ),
    },
    {
      title: "Proficiency",
      dataIndex: "level_progress",
      render: (progress: number) => (
        <div
          className="d-flex align-items-center"
          style={{ minWidth: "100px" }}
        >
          <div className="progress w-100 me-2" style={{ height: "6px" }}>
            <div
              className={`progress-bar ${
                progress >= 75
                  ? "bg-success"
                  : progress >= 50
                    ? "bg-info"
                    : "bg-warning"
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <small className="fw-medium">{progress}%</small>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      width: "100px",
      render: (_: any, record: Skill) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_skill_modal"
            onClick={() => setSelectedSkill(record)}
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
        <div onClick={() => setSelectedSkill(null)}>
          <CommonHeader
            title="Skills"
            parentMenu="HR"
            activeMenu="Skills"
            routes={routes}
            buttonText="Add Skill"
            modalTarget="#add_skill_modal"
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
                  Loading Skills...
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
                        ({groupedData.length} groups, {data.length} total skill types)
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
      <AddEditSkillModal
        onSuccess={fetchData}
        data={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </div>
  );
};

export default SkillKHR;
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../../router/all_routes";
// import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
// import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
// import AddEditSkillModal from "./AddEditSkillModal";
// import { getSkills, deleteSkill, Skill } from "./SkillServices";
// import { toast } from "react-toastify";

// const SkillKHR = () => {
//   const routes = all_routes;
//   const [data, setData] = useState<Skill[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response: any = await getSkills();
//       console.log("Raw API Response:", response);

//       // --- THE FIX: Robust Data Extraction ---
//       // We check multiple levels to find where the array is hiding
//       let rawArray = [];
//       if (Array.isArray(response)) {
//         rawArray = response;
//       } else if (response?.data && Array.isArray(response.data)) {
//         rawArray = response.data;
//       } else if (response?.data?.data && Array.isArray(response.data.data)) {
//         rawArray = response.data.data;
//       }

//       const mappedData: Skill[] = rawArray.map((item: any) => {
//         // Extracting Skill Names from objects
//         const skillNamesArray = Array.isArray(item.skills)
//           ? item.skills.map((s: any) => s.name)
//           : [];

//         // Extracting Level info from first level object
//         const firstLevel =
//           item.levels && item.levels.length > 0 ? item.levels[0] : {};

//         return {
//           id: String(item.skill_type_id),
//           key: String(item.skill_type_id),
//           skill_type_name: item.skill_type_name || "-",
//           skill_names: skillNamesArray,
//           skill_level_name: firstLevel.name || "-",
//           level_progress: Number(firstLevel.level_progress) || 0,
//           default_level: firstLevel.default_level || false,
//         };
//       });

//       console.log("Mapped Table Data:", mappedData);
//       setData(mappedData);
//     } catch (error) {
//       console.error("Failed to load skills", error);
//       toast.error("Could not load skills list");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (window.confirm("Are you sure you want to delete this skill group?")) {
//       try {
//         await deleteSkill(id);
//         toast.success("Skill group deleted");
//         fetchData();
//       } catch (error) {
//         toast.error("Delete failed");
//       }
//     }
//   };

//   const columns = [
//     {
//       title: "Skill Type",
//       dataIndex: "skill_type_name",
//       key: "skill_type_name",
//       sorter: (a: Skill, b: Skill) =>
//         a.skill_type_name.localeCompare(b.skill_type_name),
//       render: (text: string) => (
//         <span className="fw-bold text-dark">{text}</span>
//       ),
//     },
//     {
//       title: "Skills",
//       dataIndex: "skill_names",
//       key: "skill_names",
//       render: (skills: string[]) => (
//         <div className="d-flex flex-wrap gap-1">
//           {skills.map((skill, index) => (
//             <span
//               key={index}
//               className="badge bg-soft-primary text-primary border border-primary-light"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       ),
//     },
//     {
//       title: "Level",
//       dataIndex: "skill_level_name",
//       key: "skill_level_name",
//       render: (text: string) => (
//         <span className="badge badge-pill bg-outline-info">{text}</span>
//       ),
//     },
//     {
//       title: "Progress",
//       dataIndex: "level_progress",
//       key: "level_progress",
//       render: (progress: number) => (
//         <div
//           className="d-flex align-items-center"
//           style={{ minWidth: "100px" }}
//         >
//           <div className="progress w-100 me-2" style={{ height: "6px" }}>
//             <div
//               className={`progress-bar ${
//                 progress > 70 ? "bg-success" : "bg-warning"
//               }`}
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//           <small>{progress}%</small>
//         </div>
//       ),
//     },
//     {
//       title: "Actions",
//       dataIndex: "id",
//       key: "id",
//       render: (_: any, record: Skill) => (
//         <div className="action-icon d-inline-flex">
//           <Link
//             to="#"
//             className="me-2"
//             data-bs-toggle="modal"
//             data-bs-target="#add_skill_modal"
//             onClick={() => setSelectedSkill(record)}
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
//         <div onClick={() => setSelectedSkill(null)}>
//           <CommonHeader
//             title="Skills"
//             parentMenu="HR"
//             activeMenu="Skills"
//             routes={routes}
//             buttonText="Add Skill"
//             modalTarget="#add_skill_modal"
//           />
//           ;
//         </div>
//         <div className="card">
//           <div className="card-body">
//             {loading ? (
//               <div className="text-center p-4">Loading skills...</div>
//             ) : (
//               <DatatableKHR data={data} columns={columns} selection={true} />
//             )}
//           </div>
//         </div>
//       </div>
//       <AddEditSkillModal onSuccess={fetchData} data={selectedSkill} />
//     </div>
//   );
// };

// export default SkillKHR;
