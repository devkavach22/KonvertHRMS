import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../../router/all_routes';
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';
import React from 'react';

const Gallery = () => {
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [open3, setOpen3] = React.useState(false);
    const [open4, setOpen4] = React.useState(false);
    const [open5, setOpen5] = React.useState(false);
    const [open6, setOpen6] = React.useState(false);
    const [open7, setOpen7] = React.useState(false);
    const [open8, setOpen8] = React.useState(false);
    const [open9, setOpen9] = React.useState(false);

    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    {/* Breadcrumb */}
                 
                    {/* /Breadcrumb */}
                    {/* Gallery */}
                  
                    {/* /Gallery */}
                </div>
                <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
                    <p className="mb-0">2014 - 2025 © SmartHR.</p>
                    <p>
                        Designed &amp; Developed By{" "}
                        <Link to="#" className="text-primary">
                            Dreams
                        </Link>
                    </p>
                </div>
            </div>
            {/* /Page Wrapper */}
        </>

    )
}

export default Gallery
