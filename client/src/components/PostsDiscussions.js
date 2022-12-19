import PostDiscussion from "./PostDiscussion";

const PostsDiscussions = (props) => {
  return (
    <>
      {props.posts.map((post) => (
        <PostDiscussion
          key={post._id}
          post={post}
          onDelete={props.onDelete}
          onEdit={props.onEdit}
          addCommentToPost={props.addCommentToPost}
          likePost={props.likePost}
          unlikePost={props.unlikePost}
          userId={props.userId}
        />
      ))}
    </>
  );
};

export default PostsDiscussions;
