import CommentDiscussion from "./CommentDiscussion";
const CommentsDiscussion = (props) => {
  return (
    <>
      {props.comments.length > 0 ? (
        props.comments.map((comment) => (
          <CommentDiscussion
            key={comment._id}
            commentText={comment.text}
            commentUserName={comment.userName ? comment.userName : "Someone"}
          />
        ))
      ) : (
        <p style={{fontSize:"18px",fontWeight:"600"}}><span>No Comments Yet!</span></p>
      )}
    </>
  );
};

export default CommentsDiscussion;
