import PropTypes from "prop-types";

const ButttonDiscussion = (props) => {
  return (
    <button
      className={props.className}
      type={props.typeOfButton}
      onClick={props.onClick}
    >
      {props.buttonName}
    </button>
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
