import React from "react";

interface AlertButton {
  label: string;
  className: string;
  onClick?: () => void;
}

interface CommonAlertCardProps {
  alertType:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info";
  iconClass: string;
  title: string;
  message: string;
  buttons?: AlertButton[];
}

const CommonAlertCard: React.FC<CommonAlertCardProps> = ({
  alertType,
  iconClass,
  title,
  message,
  buttons = [],
}) => {
  return (
    <div className="card bg-white border-0">
      <div className={`alert custom-alert1 alert-${alertType}`}>
        <button
          type="button"
          className="btn-close ms-auto"
          data-bs-dismiss="alert"
          aria-label="Close"
        >
          <i className="fas fa-xmark" />
        </button>

        <div className="text-center px-5 pb-0">
          <div className="custom-alert-icon">
            <i className={`${iconClass} flex-shrink-0`} />
          </div>

          <h5>{title}</h5>
          <p>{message}</p>

          <div>
            {buttons.map((btn, index) => (
              <button
                key={index}
                className={`btn btn-sm ${btn.className} m-1`}
                onClick={btn.onClick}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonAlertCard;
