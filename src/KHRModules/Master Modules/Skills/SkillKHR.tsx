import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import DatatableKHR from "../../../CommonComponent/DataTableKHR/DatatableKHR";
import CommonHeader from "../../../CommonComponent/HeaderKHR/HeaderKHR";
import AddEditSkillModal from "./AddEditSkillModal";
import { getSkills, deleteSkill, Skill } from "./SkillServices";
import { toast } from "react-toastify";

const SkillKHR = () => {
  const routes = all_routes;
  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getSkills();
      console.log("Raw API Response:", response);

      // --- THE FIX: Robust Data Extraction ---
      // We check multiple levels to find where the array is hiding
      let rawArray = [];
      if (Array.isArray(response)) {
        rawArray = response;
      } else if (response?.data && Array.isArray(response.data)) {
        rawArray = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        rawArray = response.data.data;
      }

      const mappedData: Skill[] = rawArray.map((item: any) => {
        // Extracting Skill Names from objects
        const skillNamesArray = Array.isArray(item.skills)
          ? item.skills.map((s: any) => s.name)
          : [];

        // Extracting Level info from first level object
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

      console.log("Mapped Table Data:", mappedData);
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
        toast.success("Skill group deleted");
        fetchData();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const columns = [
    {
      title: "Skill Type",
      dataIndex: "skill_type_name",
      key: "skill_type_name",
      sorter: (a: Skill, b: Skill) =>
        a.skill_type_name.localeCompare(b.skill_type_name),
      render: (text: string) => (
        <span className="fw-bold text-dark">{text}</span>
      ),
    },
    {
      title: "Skills",
      dataIndex: "skill_names",
      key: "skill_names",
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
      title: "Level",
      dataIndex: "skill_level_name",
      key: "skill_level_name",
      render: (text: string) => (
        <span className="badge badge-pill bg-outline-info">{text}</span>
      ),
    },
    {
      title: "Progress",
      dataIndex: "level_progress",
      key: "level_progress",
      render: (progress: number) => (
        <div
          className="d-flex align-items-center"
          style={{ minWidth: "100px" }}
        >
          <div className="progress w-100 me-2" style={{ height: "6px" }}>
            <div
              className={`progress-bar ${
                progress > 70 ? "bg-success" : "bg-warning"
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <small>{progress}%</small>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      render: (_: any, record: Skill) => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#add_skill_modal"
            onClick={() => setSelectedSkill(record)}
          >
            <i className="ti ti-edit text-primary" />
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
          />
          ;
        </div>
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center p-4">Loading skills...</div>
            ) : (
              <DatatableKHR data={data} columns={columns} selection={true} />
            )}
          </div>
        </div>
      </div>
      <AddEditSkillModal onSuccess={fetchData} data={selectedSkill} />
    </div>
  );
};

export default SkillKHR;
