import  { useEffect, useState } from 'react'
import { Button, Toast } from 'react-bootstrap';

const Toasts = () => {
    const [showTopLeftToast, setShowTopLeftToast] = useState(false);

    const handleTopLeftButtonClick = () => {
        setShowTopLeftToast(true);
    };

    const handleTopLeftToastClose = () => {
        setShowTopLeftToast(false);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowTopLeftToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showTopLeftToast]);

    const [showTopCenterToast, setShowTopCenterToast] = useState(false);

    const handleTopCenterButtonClick = () => {
        setShowTopCenterToast(true);
    };

    const handleTopCenterToastClose = () => {
        setShowTopCenterToast(false);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowTopCenterToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showTopCenterToast]);

    const [showTopEndToast, setShowTopEndToast] = useState(false);

    const handleTopEndButtonClick = () => {
        setShowTopEndToast(true);
    };

    const handleTopEndToastClose = () => {
        setShowTopEndToast(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowTopEndToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showTopEndToast]);

    const [showMiddleLeftToast, setShowMiddleLeftToast] = useState(false);

    const handleMiddleLeftButtonClick = () => {
        setShowMiddleLeftToast(true);
    };

    const handleMiddleLeftToastClose = () => {
        setShowMiddleLeftToast(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowMiddleLeftToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showMiddleLeftToast]);
    const [showMiddleCenterToast, setShowMiddleCenterToast] = useState(false);

    const handleMiddleCenterButtonClick = () => {
        setShowMiddleCenterToast(true);
    };

    const handleMiddleCenterToastClose = () => {
        setShowMiddleCenterToast(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowMiddleCenterToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showMiddleCenterToast]);

    const [showMiddleRightToast, setShowMiddleRightToast] = useState(false);

    const handleMiddleRightButtonClick = () => {
        setShowMiddleRightToast(true);
    };

    const handleMiddleRightToastClose = () => {
        setShowMiddleRightToast(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowMiddleRightToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showMiddleRightToast]);
    const [showBottomLeftToast, setShowBottomLeftToast] = useState(false);

    const handleBottomLeftButtonClick = () => {
        setShowBottomLeftToast(true);
    };

    const handleBottomLeftToastClose = () => {
        setShowBottomLeftToast(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowBottomLeftToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showBottomLeftToast]);

    const [showBottomCenterToast, setShowBottomCenterToast] = useState(false);

    const handleBottomCenterButtonClick = () => {
        setShowBottomCenterToast(true);
    };

    const handleBottomCenterToastClose = () => {
        setShowBottomCenterToast(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowBottomCenterToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showBottomCenterToast]);

    const [showBottomRightToast, setShowBottomRightToast] = useState(false);

    const handleBottomRightButtonClick = () => {
        setShowBottomRightToast(true);
    };

    const handleBottomRightToastClose = () => {
        setShowBottomRightToast(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowBottomRightToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showBottomRightToast]);

    const [showLiveToast, setShowLiveToast] = useState(false);

    const handleLiveToastButtonClick = () => {
        setShowLiveToast(true);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowLiveToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showLiveToast]);

    const handleLiveToastClose = () => {
        setShowLiveToast(false);
    };
    const [showPrimaryToast, setShowPrimaryToast] = useState(false);

    const handlePrimaryToastButtonClick = () => {
        setShowPrimaryToast(true);
    };

    const handlePrimaryToastClose = () => {
        setShowPrimaryToast(false);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowPrimaryToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showPrimaryToast]);

    const [showSecondaryToast, setShowSecondaryToast] = useState(false);

    const handleSecondaryToastButtonClick = () => {
        setShowSecondaryToast(true);
    };

    const handleSecondaryToastClose = () => {
        setShowSecondaryToast(false);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowSecondaryToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showSecondaryToast]);

    const [showWarningToast, setShowWarningToast] = useState(false);

    const handleWarningToastButtonClick = () => {
        setShowWarningToast(true);
    };

    const handleWarningToastClose = () => {
        setShowWarningToast(false);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowWarningToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showWarningToast]);

    const [showInfoToast, setShowInfoToast] = useState(false);
    const handleInfoToastButtonClick = () => {
        setShowInfoToast(true);
    };
    const handleInfoToastClose = () => {
        setShowInfoToast(false);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowInfoToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showInfoToast]);

    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const handleSuccessToastButtonClick = () => {
        setShowSuccessToast(true);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowSuccessToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showSuccessToast]);

    const handleSuccessToastClose = () => {
        setShowSuccessToast(false);
    };
    const [showDangerToast, setShowDangerToast] = useState(false);

    const handleDangerToastButtonClick = () => {
        setShowDangerToast(true);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowDangerToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showDangerToast]);

    const handleDangerToastClose = () => {
        setShowDangerToast(false);
    };
    const [showSolidPrimaryToast, setShowSolidPrimaryToast] = useState(false);

    const handleSolidPrimaryToastButtonClick = () => {
        setShowSolidPrimaryToast(true);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowSolidPrimaryToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showSolidPrimaryToast]);

    const handleSolidPrimaryToastClose = () => {
        setShowSolidPrimaryToast(false);
    };
    const [showSolidSecondaryToast, setShowSolidSecondaryToast] = useState(false);

    const handleSolidSecondaryToastButtonClick = () => {
        setShowSolidSecondaryToast(true);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowSolidSecondaryToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showSolidSecondaryToast]);

    const handleSolidSecondaryToastClose = () => {
        setShowSolidSecondaryToast(false);
    };

    const [showSolidWarningToast, setShowSolidWarningToast] = useState(false);

    const handleSolidWarningToastButtonClick = () => {
        setShowSolidWarningToast(true);
    };

    const handleSolidWarningToastClose = () => {
        setShowSolidWarningToast(false);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowSolidWarningToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showSolidWarningToast]);

    const [showSolidInfoToast, setShowSolidInfoToast] = useState(false);

    const handleSolidInfoToastButtonClick = () => {
        setShowSolidInfoToast(true);
    };

    const handleSolidInfoToastClose = () => {
        setShowSolidInfoToast(false);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowSolidInfoToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showSolidInfoToast]);

    const [showSolidSuccessToast, setShowSolidSuccessToast] = useState(false);

    const handleSolidSuccessToastButtonClick = () => {
        setShowSolidSuccessToast(true);
    };

    const handleSolidSuccessToastClose = () => {
        setShowSolidSuccessToast(false);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowSolidSuccessToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showSolidSuccessToast]);

    const [showSolidDangerToast, setShowSolidDangerToast] = useState(false);

    const handleSolidDangerToastButtonClick = () => {
        setShowSolidDangerToast(true);
    };

    const handleSolidDangerToastClose = () => {
        setShowSolidDangerToast(false);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowSolidDangerToast(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
    }, [showSolidDangerToast]);

    return (
        <div>
          
        </div>
    )
}

export default Toasts
