import { Link } from 'react-router-dom'
import CollapseHeader from '../../../core/common/collapse-header/collapse-header'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../../router/all_routes'

const PaySlip = () => {
    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    {/* Breadcrumb */}
                  
                    {/* /Breadcrumb */}
                    {/* Invoices */}
                   
                    {/* /Invoices */}
                </div>
                {/* Footer */}
                <div className="footer d-sm-flex align-items-center justify-content-between bg-white border-top p-3">
                    <p className="mb-0">2014 - 2025 © SmartHR.</p>
                    <p>
                        Designed &amp; Developed By{" "}
                        <Link to="#" className="text-primary">
                            Dreams
                        </Link>
                    </p>
                </div>
                {/* /Footer */}
            </div>
            {/* /Page Wrapper */}
        </>
    )
}

export default PaySlip
