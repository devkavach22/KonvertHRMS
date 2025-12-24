import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import copy from "clipboard-copy";
import { all_routes } from "../../../router/all_routes";

const ClipBoard: React.FC = () => {
  const inputCopyRef = useRef<HTMLInputElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const routes = all_routes;

  const handleCopy = () => {
    if (inputCopyRef.current) {
      copy(inputCopyRef.current.value);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const handleCut = () => {
    if (inputCopyRef.current) {
      copy(inputCopyRef.current.value);
      inputCopyRef.current.value = "";
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const textareaCopyRef = useRef<HTMLTextAreaElement>(null);
  const [isCopied1, setIsCopied1] = useState(false);

  const handleCopyTextArea = () => {
    if (textareaCopyRef.current) {
      copy(textareaCopyRef.current.value);
      setIsCopied1(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const handleCutTextArea = () => {
    if (textareaCopyRef.current) {
      copy(textareaCopyRef.current.value);
      textareaCopyRef.current.value = "";
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const [isCopied2, setIsCopied2] = useState(false);
  const otpRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (otpRef.current && !otpRef.current.contains(event.target as Node)) {
        if (window.getSelection()?.toString() !== '') {
          window.getSelection()?.removeAllRanges();
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleCopyOTP = () => {
    const otpValue = '22991';
    copy(otpValue);
    setIsCopied2(true);
  };

  const handleOtpClick = () => {
    if (window.getSelection()?.toString() !== '' && otpRef.current) {
      window.getSelection()?.removeAllRanges();
    }
  };

  const advancedParagraphRef = useRef<HTMLSpanElement>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopyLink = () => {
    if (advancedParagraphRef.current) {
      const linkToCopy = advancedParagraphRef.current.innerText;
      copy(linkToCopy);
      setCopiedLink(linkToCopy);
      clearSelection();
    }
  };

  const handleCopyHiddenCode = () => {
    const hiddenCode = '2291';
    copy(hiddenCode);
    setCopiedLink(null);
    clearSelection();
  };

  const clearSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  };

  return (
    <div>
      
    </div>
  );
};

export default ClipBoard;
