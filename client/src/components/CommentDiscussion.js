const CommentDiscussion = ({ commentText, commentUserName }) => {
  return (
    <div>
      <p  style={{fontWeight:"bold",fontSize:"16px"}}>{commentUserName}</p>
      <p style={{fontSize:"15px",fontWeight:"500"}}><span>{commentText}</span></p>
    </div>
  );
};

export default CommentDiscussion;
