import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

const ButttonDiscussion = (props) => {
  return (
    <Button variant={props.variant} size="sm"
      className={props.className} 
      type={props.typeOfButton}
      onClick={props.onClick}
    >
      {props.buttonName}
    </Button>
  );
};

ButttonDiscussion.defaultProps = {
  buttonName: "Submit",
  typeOfButton: "button",
  onclick: () => {
    console.log("Button clicked, but no functionality defined on clicking it");
  },
};

ButttonDiscussion.propTypes = {
  buttonName: PropTypes.string,
  typeOfButton: PropTypes.string,
  onClick: PropTypes.func,
};

export default ButttonDiscussion;
