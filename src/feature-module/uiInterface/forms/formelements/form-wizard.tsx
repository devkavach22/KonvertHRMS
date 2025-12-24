import { useState } from "react";

const FormWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalDetails: { firstName: "", lastName: "", phone: "", email: "" },
    addressDetails: { address1: "", address2: "", landmark: "", town: "" },
    paymentDetails: { cardName: "", cardType: "", cardNumber: "", cvv: "", expiration: "" },
  });

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (
    step: keyof typeof formData,
    field: string,
    value: string
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [step]: { ...prevData[step], [field]: value },
    }));
  };

  return (
    <div className="page-wrapper">
   
    </div>
  );
};

export default FormWizard;
