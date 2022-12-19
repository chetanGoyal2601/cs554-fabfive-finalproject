import PropTypes from "prop-types";

const HeaderDiscussion = (props) => {
  return (
    <header>
      <h1>Discussion Forum</h1>
      <h2>{props.eventName}</h2>
    </header>
  );
};

HeaderDiscussion.defaultProps = {
  eventName: "Event at Stevens",
};

HeaderDiscussion.propTypes = {
  eventName: PropTypes.string,
};

export default HeaderDiscussion;
