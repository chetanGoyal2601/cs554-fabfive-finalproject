const CommentDiscussion = ({ commentText, commentUserName }) => {
  return (
    <div>
      <h4>{commentUserName}</h4>
      <p>{commentText}</p>
    </div>
  );
};

export default CommentDiscussion;
