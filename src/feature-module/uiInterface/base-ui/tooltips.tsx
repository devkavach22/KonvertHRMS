import { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";

const Tooltips = () => {
  const renderTooltip = (props: any) => (
    <Tooltip id="tooltip-primary" className="tooltip-primary" {...props}>
      Primary Tooltip
    </Tooltip>
  );
  const renderTooltipSecondary = (props: any) => (
    <Tooltip id="tooltip-secondary" className="tooltip-secondary" {...props}>
      Secondary Tooltip
    </Tooltip>
  );
  const renderTooltipWarning = (props: any) => (
    <Tooltip id="tooltip-warning" className="tooltip-warning" {...props}>
      Warning Tooltip
    </Tooltip>
  );
  const renderTooltipInfo = (props: any) => (
    <Tooltip id="tooltip-warning" className="tooltip-info" {...props}>
      Info Tooltip
    </Tooltip>
  );
  const renderTooltipSuccess = (props: any) => (
    <Tooltip id="tooltip-success" className="tooltip-success" {...props}>
      Success Tooltip
    </Tooltip>
  );
  const renderTooltipDanger = (props: any) => (
    <Tooltip id="tooltip-success" className="tooltip-danger" {...props}>
      Danger Tooltip
    </Tooltip>
  );
  const renderTooltipLight = (props: any) => (
    <Tooltip id="tooltip-light" className="tooltip-light" {...props}>
      Danger Tooltip
    </Tooltip>
  );
  const renderTooltipDark = (props: any) => (
    <Tooltip id="tooltip-dark" className="tooltip-darh" {...props}>
      Danger Tooltip
    </Tooltip>
  );
  const renderTooltipHover = (props: any) => (
    <Tooltip id="tooltip-example" {...props}>
      Popover title
    </Tooltip>
  );
  const tooltipContent = (
    <div>
      <em>Tooltip</em> <u>with</u> <b>HTML</b>
    </div>
  );
  const [showTooltip, setShowTooltip] = useState(true);

  const handleClick = () => {
    setShowTooltip(!showTooltip);
  };

  const tooltipContenthtml = (
    <Tooltip id="tooltip-html" show={showTooltip}>
      <em>Tooltip</em> <u>with</u> <b>HTML</b>
    </Tooltip>
  );

  const tooltipContentDisable = (
    <Tooltip id="disabled-tooltip">Disabled tooltip</Tooltip>
  );

  const tooltipContentLink = <Tooltip id="link-tooltip">Link Tooltip</Tooltip>;
  const tooltipContentImg = <Tooltip id="avatar-tooltip">Marina Kai</Tooltip>;
  const tooltipContentImg2 = <Tooltip id="avatar-tooltip">Alex Carey</Tooltip>;
  const tooltipContentImg3 = <Tooltip id="avatar-tooltip">Alex Carey</Tooltip>;

  return (
    <div>
      {/* Page Wrapper */}
     
      {/* /Page Wrapper */}
    </div>
  );
};

export default Tooltips;
