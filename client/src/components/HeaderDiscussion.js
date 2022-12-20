import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

const HeaderDiscussion = (props) => {
  return (
    <div className="mt-3">
       
       <div className="d-grid mb-3">
          <Button style={{fontSize:"25px",fontWeight:"700",fontStyle:"italic"}} variant="light" size="lg" active>
          <div className="mb-3">
          <h1 style={{fontSize:"30px",fontWeight:"700",color:"#1e0a3c",fontStyle:"italic"}} variant="danger" size="lg" active>
            Discussion Forum
          </h1>
        </div>
            {props.eventName}
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
