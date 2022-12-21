import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

const HeaderDiscussion = (props) => {
  return (
    <div className="mt-3">
       
       <div className="d-grid mb-3">
          <Button style={{fontSize:"25px",fontWeight:"700",fontStyle:"italic"}} variant="light" size="lg" disabled>
          
            Discussion Forum for 
         
       
            {' '}{props.eventName}
          </Button>
        </div>
    </div>
    
  );
};

HeaderDiscussion.defaultProps = {
  eventName: "Event at Stevens",
};

HeaderDiscussion.propTypes = {
  eventName: PropTypes.string,
};

export default HeaderDiscussion;
