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

  const EmpAttendancevalidateForm = (data: any) => {
    let temp: any = {};
    let valid = true;

    if (!data.from_date) {
      temp.from_date = "Date is required";
      valid = false;
    }

    if (!data.reg_category) {
      temp.reg_category = "Category is required";
      valid = false;
    }

    if (!data.reg_reason || data.reg_reason.length < 5) {
      temp.reg_reason = "Reason must be at least 5 characters";
      valid = false;
    }

    return valid;
  };

  const validateStructureType = (data: any) => {
    const errors: any = {};

    if (!data.name || !data.name.trim()) {
      errors.name = "Structure Type is required";
    }

    if (!data.country) {
      errors.country = "Country is required";
    }

    if (!data.default_wage_type) {
      errors.default_wage_type = "Default Wage Type is required";
    }

    if (!data.default_schedule_pay) {
      errors.default_schedule_pay = "Default Scheduled Pay is required";
    }

    if (!data.default_working_hours) {
      errors.default_working_hours = "Default Working Hours is required";
    }

    if (!data.regular_pay_structure) {
      errors.regular_pay_structure = "Regular Pay Structure is required";
    }

    if (!data.default_work_entry_type) {
      errors.default_work_entry_type = "Default Work Entry Type is required";
    }

    return errors;
  };

  const validateSalaryRule = (data: any) => {
    const errors: any = {};

    // BASIC
    if (!data.name) errors.name = "Rule name is required";
    if (!data.code) errors.code = "Code is required";
    if (!data.category_id) errors.category_id = "Category is required";
    if (!data.struct_id) errors.struct_id = "Salary structure is required";
    if (!data.sequence || data.sequence < 1)
      errors.sequence = "Sequence must be at least 1";

    // CONDITIONS
    if (data.condition_select === "range") {
      if (!data.condition_range)
        errors.condition_range = "Range based on is required";
      if (!data.condition_range_min)
        errors.condition_range_min = "Min value is required";
      if (!data.condition_range_max)
        errors.condition_range_max = "Max value is required";
    }

    if (data.condition_select === "other_input") {
      if (!data.condition_other_input_id)
        errors.condition_other_input_id = "Other input is required";
    }

    if (data.condition_select === "python") {
      if (!data.condition_python)
        errors.condition_python = "Python condition is required";
    }

    // COMPUTATION
    if (data.amount_select === "fix") {
      if (!data.amount_fix)
        errors.amount_fix = "Fixed amount is required";
      if (!data.quantity) errors.quantity = "Quantity is required";
    }

    if (data.amount_select === "percentage") {
      if (!data.amount_percentage)
        errors.amount_percentage = "Percentage is required";
      if (!data.amount_percentage_based)
        errors.amount_percentage_based = "Percentage based on is required";
      if (!data.quantity) errors.quantity = "Quantity is required";
    }

    if (data.amount_select === "other_input") {
      if (!data.amount_other_input_id)
        errors.amount_other_input_id = "Other input is required";
    }

    if (data.amount_select === "python") {
      if (!data.amount_python_compute)
        errors.amount_python_compute = "Python code is required";
    }

    return errors;
  };

  return { validateAttendancePolicy, validateSalaryRule, validateEmployeeContract, EmpAttendancevalidateForm, validateStructureType };
};
