import React from "react";

interface VolunteerFieldProps {
  disabled?: boolean;
  readOnly?: boolean;
  pendingChange?: boolean;
  pendingChangeDetails?: {
    oldValue: string;
    newValue: string;
  };
}

interface WithVolunteerSupportProps {
  getFieldProps: (fieldName: string) => VolunteerFieldProps;
}

// HOC to add volunteer support to form components
export const withVolunteerSupport = <P extends object>(
  Component: React.ComponentType<P & VolunteerFieldProps>
) => {
  return React.forwardRef<
    any,
    P & { name: string } & WithVolunteerSupportProps
  >(({ getFieldProps, name, ...props }, ref) => {
    const fieldProps = getFieldProps(name);

    return <Component ref={ref} {...(props as P)} {...fieldProps} />;
  });
};

// Enhanced form components with volunteer support
export const EnhancedFormInput = withVolunteerSupport(
  React.forwardRef<any, any>((props, ref) => {
    const { FormInput } = require("./form-input");
    return <FormInput ref={ref} {...props} />;
  })
);

export const EnhancedFormDropdown = withVolunteerSupport(
  React.forwardRef<any, any>((props, ref) => {
    const { FormDropdown } = require("./form-dropdown");
    return <FormDropdown ref={ref} {...props} />;
  })
);

export const EnhancedFormDatePicker = withVolunteerSupport(
  React.forwardRef<any, any>((props, ref) => {
    const { FormDatePicker } = require("./form-date-picker");
    return <FormDatePicker ref={ref} {...props} />;
  })
);

export const EnhancedFormCheckbox = withVolunteerSupport(
  React.forwardRef<any, any>((props, ref) => {
    const { FormCheckbox } = require("./form-checkbox");
    return <FormCheckbox ref={ref} {...props} />;
  })
);
