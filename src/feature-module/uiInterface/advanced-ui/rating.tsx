import { useState } from "react";
import ReactStarsRating from "react-awesome-stars-rating";
import { RotateCcw } from "react-feather";
import { Link } from "react-router-dom";

const Rating = () => {
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [rating4, setRating4] = useState(0);
  const [rating5, setRating5] = useState(0);
  const [hoverCount, setHoverCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleRatingChange = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };
  const handleStarHover = () => {
    setHoverCount((prevCount) => Math.min(prevCount + 1, 5));
  };
  const handleRatingChange1 = (newRating: any) => {
    setRating1(newRating);
  };
  const handleReset = () => {
    setRating3(0);
  };

  const handleRatingChange2 = (newRating: any) => {
    setRating2(newRating);
  };
  const handleRatingChange3 = (newRating: any) => {
    setRating3(newRating);
  };
  const handleRatingChange4 = (newRating: any) => {
    setRating4(newRating);
  };
  const handleRatingChange5 = (newRating: any) => {
    setRating5(newRating);
  };
  return (
    <div className="page-wrapper cardhead">
   
    </div>
  );
};

export default Rating;
