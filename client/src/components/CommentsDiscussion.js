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
        <div>No Comments yet...</div>
      )}
    </>
  );
};

export default CommentsDiscussion;
