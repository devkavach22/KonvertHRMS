import  { useEffect, useRef } from "react";
import dragula from "dragula";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";

const DragAndDrop = () => {
  const leftContainerRef = useRef(null);
  const rightContainerRef = useRef(null);

  useEffect(() => {
    const leftContainer = leftContainerRef.current;
    const rightContainer = rightContainerRef.current;

    if (leftContainer && rightContainer) {
      dragula([leftContainer, rightContainer]);
    }
  }, []);
  return (
    <>
    </>
  );
};

export default DragAndDrop;
