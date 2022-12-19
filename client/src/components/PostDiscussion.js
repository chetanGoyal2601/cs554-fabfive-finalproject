import CommentsDiscussion from "./CommentsDiscussion";
import AddNewFormDiscussion from "./AddNewFormDiscussion";
import EditPostFormDiscussion from "./EditPostFormDiscussion";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import ButttonDiscussion from "./ButttonDiscussion";

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
      <div>
        <h3>
          {post.userName}
          {userId === post.postUserId && (
            <FaTimes
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => onDelete(post._id)}
            />
          )}
        </h3>
        {showPost && <p>{post.text}</p>}
      </div>

      {/* Form to edit post */}
      {!showPost && (
        <EditPostFormDiscussion
          onEdit={onEdit}
          postId={post._id}
          textInPost={post.text}
          changeShowPost={changeShowPost}
        />
      )}

      {/* Button for liking and disliking */}
      {toLike() ? (
        <ButttonDiscussion
          buttonName="Like"
          onClick={() => likePost(post._id, userId)}
        />
      ) : (
        <ButttonDiscussion
          buttonName="Unlike"
          onClick={() => unlikePost(post._id, userId)}
        />
      )}
      {/* Button to view comments */}
      <ButttonDiscussion
        buttonName="View Comments"
        onClick={toggleCommentsAreShowing}
      />

      {/* Button to edit post */}
      {showPost && userId === post.postUserId && (
        <ButttonDiscussion buttonName="Edit Post" onClick={changeShowPost} />
      )}

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
    </div>
  );
};

export default PostDiscussion;
