import React from "react";

interface CommonModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitText?: string;
}

const CommonModal: React.FC<CommonModalProps> = ({
  id,
  title,
  children,
  onSubmit,
  submitText = "Save",
}) => {
  return (
    <div className="modal fade" id={id} role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>

          <div className="modal-body">{children}</div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onSubmit}>
              {submitText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
