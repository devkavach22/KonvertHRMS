import React, { useEffect, useState } from "react";
import Select, { MultiValue, SingleValue, ActionMeta } from "react-select";

export type Option = {
  value: string;
  label: string;
};

export interface SelectProps {
  options: Option[];
  defaultValue?: Option | Option[]; // Updated to support array for multi-select
  value?: Option | Option[] | null; // Added value for controlled component usage
  className?: string;
  placeholder?: string;
  styles?: any;
  isMulti?: boolean; // Added isMulti prop
  // Updated onChange to handle SingleValue or MultiValue
  onChange?: (option: any, actionMeta?: ActionMeta<Option>) => void;
  disabled?: boolean;
  formatOptionLabel?: (
    data: any,
    formatOptionLabelMeta: any,
  ) => React.ReactNode;
}

const CommonSelect: React.FC<SelectProps> = ({
  options,
  defaultValue,
  value,
  className,
  placeholder = "Select",
  onChange,
  isMulti = false, // Default to false
  disabled = false,
  formatOptionLabel,
}) => {
  // Local state needs to handle Option | Option[] | undefined
  const [selectedOption, setSelectedOption] = useState<
    Option | Option[] | undefined
  >(value || defaultValue || undefined);

  // const customStyles = {
  //   option: (base: any, state: any) => ({
  //     ...base,
  //     color: "#6C7688",
  //     backgroundColor: state.isSelected ? "#70e4de" : "white",
  //     cursor: "pointer",
  //     "&:hover": {
  //       backgroundColor: state.isFocused ? "#2e37a4" : "white",
  //       color: state.isFocused ? "#fff" : "#2e37a4",
  //     },
  //   }),
  //   // Optional: Add styles for multi-select tags (multiValue)
  //   multiValue: (base: any) => ({
  //     ...base,
  //     backgroundColor: "rgba(46, 55, 164, 0.1)",
  //     borderRadius: "4px",
  //   }),
  //   multiValueLabel: (base: any) => ({
  //     ...base,
  //     color: "#2e37a4",
  //     fontWeight: "500",
  //   }),
  //   multiValueRemove: (base: any) => ({
  //     ...base,
  //     color: "#2e37a4",
  //     ":hover": {
  //       backgroundColor: "#2e37a4",
  //       color: "white",
  //     },
  //   }),
  // };

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      border: "1px solid #ced4da",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#2e37a4",
      },
    }),
    option: (base: any, state: any) => {
      // Determine background color to avoid any default "Red"
      let backgroundColor = "#ffffff";
      if (state.isSelected) {
        backgroundColor = "#2e37a4"; // Your Brand Blue
      } else if (state.isFocused) {
        backgroundColor = "rgba(46, 55, 164, 0.1)"; // Very Light Blue Hover
      }

      return {
        ...base,
        backgroundColor: backgroundColor,
        color: state.isSelected ? "#ffffff" : "#6C7688",
        cursor: "pointer",

        // FORCE OVERRIDE: This targets the browser's hover behavior directly
        ":hover": {
          backgroundColor: state.isSelected
            ? "#2e37a4"
            : "rgba(46, 55, 164, 0.1)",
          color: state.isSelected ? "#ffffff" : "#2e37a4",
        },

        // Kills the default focus/active behavior
        ":active": {
          backgroundColor: "#2e37a4",
          color: "#ffffff",
        },
      };
    },
  };
  const handleChange = (
    newValue: MultiValue<Option> | SingleValue<Option>,
    actionMeta: ActionMeta<Option>,
  ) => {
    // Cast newValue to any for internal state to avoid strict TS array vs object conflicts
    setSelectedOption(newValue as any);
    if (onChange) onChange(newValue, actionMeta);
  };

  // Sync state if defaultValue or value props change externally
  useEffect(() => {
    setSelectedOption(value || defaultValue || undefined);
  }, [defaultValue, value]);

  return (
    <Select
      isMulti={isMulti} // Enable/Disable multi-select
      classNamePrefix="react-select"
      className={className}
      theme={(theme) => ({
        ...theme,
        borderRadius: 6,
        colors: {
          ...theme.colors,
          primary: "#2e37a4", // Globally sets the focus color to your Navy Blue
        },
      })}
      styles={customStyles}
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
      isDisabled={disabled}
      formatOptionLabel={formatOptionLabel}
    />
  );
};

export default CommonSelect;
