// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import CommonSelect from "../../../core/common/commonSelect";
// import { LeaveRequest } from "./LeaveServices";
// import Instance from "../../../api/axiosInstance";

// interface Props {
//   onSuccess: () => void;
//   data: LeaveRequest | null;
// }

// const AddEditLeaveModal: React.FC<Props> = ({ onSuccess, data }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [formData, setFormData] = useState({
//     employees_selection: [] as any[],
//     type: "Casual Leave",
//     from_date: "",
//     to_date: "",
//     reason: "",
//   });

//   useEffect(() => {
//     // Fetch employees for dropdown
//     Instance.get("/api/employees").then((res) => {
//       setEmployees(
//         res.data.data.map((e: any) => ({ value: e.id, label: e.name }))
//       );
//     });
//   }, []);

//   useEffect(() => {
//     if (data) {
//       setFormData({
//         employees_selection: data.employees_selection.map((e) =>
//           String(e.id || e)
//         ),
//         type: data.type,
//         from_date: data.from_date,
//         to_date: data.to_date,
//         reason: data.reason,
//       });
//     } else {
//       setFormData({
//         employees_selection: [],
//         type: "Casual Leave",
//         from_date: "",
//         to_date: "",
//         reason: "",
//       });
//     }
//   }, [data]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       // if (data?.id) await updateLeave(data.id, formData);
//       // else await addLeave(formData);
//       toast.success("Saved successfully");
//       onSuccess();
//       document.getElementById("close-leave-modal")?.click();
//     } catch (error) {
//       toast.error("Error saving leave");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="modal fade" id="add_leave_modal" role="dialog">
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content">
//           <div className="modal-header border-0">
//             <h4 className="fw-bold">Leave Master Entry</h4>
//             <button
//               type="button"
//               id="close-leave-modal"
//               className="btn-close"
//               data-bs-dismiss="modal"
//             ></button>
//           </div>
//           <div className="modal-body">
//             <form onSubmit={handleSubmit}>
//               <div className="row g-3">
//                 <div className="col-md-12 bg-light p-3 rounded border mb-3">
//                   <label className="fw-bold fs-13">Select Employees *</label>
//                   <CommonSelect
//                     isMulti={true}
//                     options={employees}
//                     value={employees.filter((e: any) =>
//                       formData.employees_selection.includes(String(e.value))
//                     )}
//                     onChange={(val) =>
//                       setFormData({
//                         ...formData,
//                         employees_selection: val
//                           ? val.map((v: any) => v.value)
//                           : [],
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="fs-13">Leave Type</label>
//                   <CommonSelect
//                     options={[
//                       { value: "Casual Leave", label: "Casual" },
//                       { value: "Sick Leave", label: "Sick" },
//                     ]}
//                     value={{ value: formData.type, label: formData.type }}
//                     onChange={(val) =>
//                       setFormData({ ...formData, type: val.value })
//                     }
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <label className="fs-13">From Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     value={formData.from_date}
//                     onChange={(e) =>
//                       setFormData({ ...formData, from_date: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <label className="fs-13">To Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     value={formData.to_date}
//                     onChange={(e) =>
//                       setFormData({ ...formData, to_date: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="col-md-12">
//                   <label className="fs-13">Reason</label>
//                   <textarea
//                     className="form-control"
//                     rows={3}
//                     value={formData.reason}
//                     onChange={(e) =>
//                       setFormData({ ...formData, reason: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>
//               <div className="modal-footer border-0 mt-4">
//                 <button
//                   type="submit"
//                   className="btn btn-primary px-5"
//                   disabled={isSubmitting}
//                 >
//                   Save Leave
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddEditLeaveModal;
