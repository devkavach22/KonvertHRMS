import  { useEffect } from 'react'
// import '../../../assets/icon/themify/themify.css'


const ThemifyIcons = () => {
  useEffect(() => {
    const loadCSS = async () => {
      // Dynamically import the CSS file
      await import('../../../assets/icon/themify/themify.css');
    };

    loadCSS();

    // Optionally, cleanup if you want to remove the CSS when the component unmounts
    return () => {
      // Find the link element with the href that includes the CSS file path and remove it
      const linkElement :any = document.querySelector('link[href*="themify.css"]');
      if (linkElement) {
        linkElement.parentNode.removeChild(linkElement);
      }
    };
  }, []);
  return (
    <div>
       <div className="page-wrapper cardhead">
        <div className="content container-fluid">
          {/* Page Header */}
       
          {/* /Page Header */}					
     
        </div>			
      </div>
    </div>
  )
}

export default ThemifyIcons