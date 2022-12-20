import CommentsDiscussion from "./CommentsDiscussion";
import AddNewFormDiscussion from "./AddNewFormDiscussion";
import EditPostFormDiscussion from "./EditPostFormDiscussion";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import ButttonDiscussion from "./ButttonDiscussion";
import Card from "react-bootstrap/Card";

const PostDiscussion = ({
  post,
  onDelete,
  onEdit,
  addCommentToPost,
  likePost,
  unlikePost,
  userId,
}) => {
  const [showPost, setShowPost] = useState(true);
  //const [comments, setComments] = useState(post.comments);
  const [commentsAreShowing, setcommentsAreShowing] = useState(false);

  const toLike = () => {
    if (post.likes.filter((likeId) => likeId === userId).length !== 0) {
      return false;
    }
    return true;
  };

  // add a new comment on discussion page for a post
  const addComment = (comment) => {
    //console.log(comment);
    //const _id = Math.floor(Math.random() * 10000) + 1;
    //console.log(id);
    addCommentToPost(comment, post._id);
    //setComments([newComment, ...comments]);
  };

  const changeShowPost = () => {
    showPost ? setShowPost(false) : setShowPost(true);
  };

  const toggleCommentsAreShowing = () => {
    commentsAreShowing
      ? setcommentsAreShowing(false)
      : setcommentsAreShowing(true);
  };
  return (
    <div>
      <Card style={{width:"40rem",marginLeft:"auto",marginRight:"auto"}} className="mb-3">
        <p className="text-uppercase" style={{fontWeight:"bold",fontSize:"20px"}}>
            {post.userName}
            {userId === post.postUserId && (
                  <FaTimes
                    style={{ color: "red", cursor: "pointer", marginLeft:"10"}}
                    onClick={() => onDelete(post._id)}
                  />
            )}
          </p>
          {showPost && <p style={{fontWeight:"500",fontStyle:"italic",fontSize:"18px"}}>{post.text}</p>}
        
     

      {/* Form to edit post */}
      {!showPost && (
        <EditPostFormDiscussion
          onEdit={onEdit}
          postId={post._id}
          textInPost={post.text}
          changeShowPost={changeShowPost}
        />
      )}

      {/* div to show total likes */}
      <div><p className="text-uppercase" style={{fontWeight:"bold",fontSize:"18px"}}>Total Likes: {post.totalLikes}</p></div>

      {/* Button for liking and disliking */}
      <div className="mb-3">
          {toLike() ? (
            <ButttonDiscussion
              buttonName="Like"
              variant="dark"
              onClick={() => likePost(post._id, userId)}
            />
          ) : (
            <ButttonDiscussion
              buttonName="Unlike"
              variant="secondary"
              onClick={() => unlikePost(post._id, userId)}
            />
          )} {' '}
          {/* Button to view comments */}
          <ButttonDiscussion
            buttonName="View Comments"
            variant="primary"
            onClick={toggleCommentsAreShowing}
          />{' '}

          {/* Button to edit post */}
          {showPost && userId === post.postUserId && (
            <ButttonDiscussion 
            variant="danger"
            buttonName="Edit Post" onClick={changeShowPost} />
          )}
        </div>
      {/* Form to add a comment */}
            <AddNewFormDiscussion
              onAdd={addComment}
              formType="comment"
            ></AddNewFormDiscussion>
            

            {/* Component to view all comments */}
            {commentsAreShowing && (
              <>
                <div>
                  <CommentsDiscussion comments={post.comments}></CommentsDiscussion>
                </div>
              </>
            )}
      </Card>
    </div>
  );
};

export default PostDiscussion;
