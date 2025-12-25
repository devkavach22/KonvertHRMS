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


  return { validateAttendancePolicy };
};
