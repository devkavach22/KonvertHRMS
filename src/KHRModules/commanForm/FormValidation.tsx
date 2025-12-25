export const useFormValidation = () => {
 const validateAttendancePolicy = (data: any) => {
  const errors: any = {};

  if (!data.name) {
    errors.name = "Name is required";
  }

  if (!data.latitude) {
    errors.latitude = "Latitude is required";
  }

  if (!data.longitude) {
    errors.longitude = "Longitude is required";
  }

  const radius = Number(data.radius_km);
  if (!radius || radius <= 0) {
    errors.radius_km = "Radius must be greater than 0";
  }

  if (!data.employees_selection?.length) {
    errors.employees_selection = "Select at least one employee";
  }

  return errors;
};


 const validateEmployeeContract = (data: any) => {
  const errors: any = {};

  /* ================= Employee Info ================= */
  if (!data.employee_name) {
    errors.employee_name = "Employee is required";
  }

  if (!data.contract_start_date) {
    errors.contract_start_date = "Contract start date is required";
  }

  if (!data.contract_end_date) {
    errors.contract_end_date = "Contract end date is required";
  }

  if (
    data.contract_start_date &&
    data.contract_end_date &&
    new Date(data.contract_end_date) < new Date(data.contract_start_date)
  ) {
    errors.contract_end_date =
      "Contract end date must be after start date";
  }

  if (!data.working_schedule) {
    errors.working_schedule = "Working schedule is required";
  }

  if (!data.work_entry_source) {
    errors.work_entry_source = "Work entry source is required";
  }

  /* ================= Salary Structure ================= */
  if (!data.salary_structure_type) {
    errors.salary_structure_type = "Salary structure type is required";
  }

  if (!data.department) {
    errors.department = "Department is required";
  }

  if (!data.job_position) {
    errors.job_position = "Job position is required";
  }

  if (!data.contract_type) {
    errors.contract_type = "Contract type is required";
  }

  /* ================= Salary Info ================= */
  if (!data.wage_type) {
    errors.wage_type = "Wage type is required";
  }

  if (!data.schedule_pay) {
    errors.schedule_pay = "Schedule pay is required";
  }

  const wage = Number(data.wage);
  if (!wage || wage <= 0) {
    errors.wage = "Wage must be greater than 0";
  }

  /* ================= Allowances ================= */
  if (data.allowances) {
    Object.keys(data.allowances).forEach((key) => {
      const value = Number(data.allowances[key]);
      if (value < 0) {
        errors.allowances = errors.allowances || {};
        errors.allowances[key] = "Amount cannot be negative";
      }
    });
  }

  /* ================= Deductions ================= */
  if (data.deductions) {
    Object.keys(data.deductions).forEach((key) => {
      const value = Number(data.deductions[key]);
      if (value < 0) {
        errors.deductions = errors.deductions || {};
        errors.deductions[key] = "Amount cannot be negative";
      }
    });
  }

  return errors;
};


  return { validateAttendancePolicy, validateEmployeeContract };
};
