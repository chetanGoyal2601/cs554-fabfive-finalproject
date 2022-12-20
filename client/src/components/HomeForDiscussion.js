import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import axios from "axios";

import HeaderDiscussion from "./HeaderDiscussion";
import PostsDiscussions from "./PostsDiscussions";
import AddNewFormDiscussion from "./AddNewFormDiscussion";

const HomeForDiscussion = () => {
  let { eventId } = useParams();
  //const eventId = "2";
  const [posts, setPosts] = useState([]);
  const userDetails = useOutletContext();
  const userId = userDetails.userId;
  const userName = userDetails.name;

  useEffect(() => {
    const getPosts = async () => {
      const postsFromServer = await fetchPosts();
      setPosts(postsFromServer);
    };
    getPosts();
  }, []);

  //fetch posts for discussion page
  const fetchPosts = async () => {
    const res = await fetch(`/discussions/${eventId}`);
    const data = await res.json();
    return data.postList;
    //console.log(data.postList);
  };

  // add a new post on discussion page
  const addPost = async (postText) => {
    const res = await axios.post(
      `/discussions/${eventId}`,
      {
        data: { newPost: postText, userId: userId },
      },
      { headers: {} }
    );
    //console.log(res);
    const data = await res.data;
    //console.log(data);
    const newPost = data;
    newPost.userId = userId;
    newPost.userName = userName;
    // console.log(newPost);
    setPosts([newPost, ...posts]);
  };

  // edit a post on discussion page
  const editPost = async (editedPostText, postId) => {
    await axios.patch(
      `/discussions/editPost`,
      {
        data: { postId: postId, editedPost: editedPostText },
      },
      { headers: {} }
    );
    setPosts(
      posts.map((post) =>
        post._id === postId ? { ...post, text: editedPostText } : post
      )
    );
  };

  const likePost = async (postId) => {
    await axios.patch(
      `/discussions/like`,
      {
        data: { postId: postId, userId: userId },
      },
      { headers: {} }
    );
    setPosts(
      posts.map((post) =>
        post._id === postId
          ? { ...post, totalLikes: editLikeOnPost(post.likes, userId) }
          : post
      )
    );
    //console.log(posts, postId, userId);

    //console.log("Liked Post " + postId);
  };

  const editLikeOnPost = (likes, userId) => {
    //console.log(userId);
    likes.push(userId);
    return likes;
  };

  const unlikePost = async (postId) => {
    await axios.patch(
      `/discussions/disLike`,
      {
        data: { postId: postId, userId: userId },
      },
      { headers: {} }
    );
    setPosts(
      posts.map((post) =>
        post._id === postId
          ? { ...post, totalLikes: editUnLikeOnPost(post.likes, userId) }
          : post
      )
    );
    //console.log("Unliked post " + postId);
  };

  const editUnLikeOnPost = (likes, userId) => {
    const index = likes.indexOf(userId);
    if (index > -1) {
      // only splice array when item is found
      likes.splice(index, 1); // 2nd parameter means remove one item only
    }
    return likes;
  };

  // add a new comment to a post on discussion page
  const addCommentToPost = async (comment, postId) => {
    const res = await axios.put(
      `/discussions/comment`,
      {
        data: { postId: postId, newComment: comment, userId: userId },
      },
      { headers: {} }
    );
    const data = await res.data;
    const newComment = data;
    //console.log(newComment);
    setPosts(
      posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: editCommentsOnPost(post.comments, userName, newComment),
            }
          : post
      )
    );
  };

  const editCommentsOnPost = (comments, currentUserName, newComment) => {
    newComment.userName = currentUserName;
    //console.log(newComment);
    comments.push(newComment);
    //console.log(comments);
    return comments;
  };

  //delete post on discussion page
  const deletePost = async (id) => {
    await axios.delete(
      "/discussions/deletePost",
      {
        data: { postId: id },
      },
      { headers: {} }
    );
    setPosts(posts.filter((post) => post._id !== id));
  };

  return (
    <div>
      <HeaderDiscussion />
      <AddNewFormDiscussion onAdd={addPost} formType="post" />
      {posts.length > 0 ? (
        <PostsDiscussions
          userId={userId}
          posts={posts}
          onDelete={deletePost}
          onEdit={editPost}
          addCommentToPost={addCommentToPost}
          likePost={likePost}
          unlikePost={unlikePost}
        />
      ) : (
        "No Posts To Show"
      )}
    </div>
  );
};

export default HomeForDiscussion;
