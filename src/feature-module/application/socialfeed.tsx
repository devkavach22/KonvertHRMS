import { Link } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
const SocialFeed = () => {
  const [open1, setOpen1] = React.useState(false);
  const [toggle, setToggle] = React.useState(false);
  const [toggle2, setToggle2] = React.useState(false);
  const settings = {
    dots: false,
    autoplay: false,
    slidesToShow: 8,
    margin: 24,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 8,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
  const settings2 = {
    dots: false,
    autoplay: false,
    slidesToShow: 4,
    margin: 24,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        
        <div className="footer d-sm-flex align-items-center justify-content-between bg-white border-top p-3">
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
  );
};

export default SocialFeed;
