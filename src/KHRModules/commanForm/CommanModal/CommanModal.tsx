import React, { useRef } from "react";

interface CommonModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitText?: string;
  isLoading?: boolean;
}

const CommonModal: React.FC<CommonModalProps> = ({
  id,
  title,
  children,
  onSubmit,
  submitText = "Save",
  isLoading = false,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Expose close function via ref or call it externally
  const closeModal = () => {
    if (closeButtonRef.current) {
      closeButtonRef.current.click();
    }
  };

  // Attach closeModal to window for external access
  React.useEffect(() => {
    (window as any)[`closeModal_${id}`] = closeModal;
    return () => {
      delete (window as any)[`closeModal_${id}`];
    };
  }, [id]);

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
              ref={closeButtonRef}
              disabled={isLoading}
            />
          </div>

          <div className="modal-body">{children}</div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              data-bs-dismiss="modal"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                submitText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
