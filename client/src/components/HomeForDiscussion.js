import { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
//React Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
//Components
import HeaderDiscussion from "./HeaderDiscussion";
import PostsDiscussions from "./PostsDiscussions";
import AddNewFormDiscussion from "./AddNewFormDiscussion";

const HomeForDiscussion = () => {
  let { eventId } = useParams();
  //const eventId = "2";
  //const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [rsvp, setRsvp] = useState(false);
  const [eventName, setEventName] = useState("");
  const userDetails = useOutletContext();
  const userId = userDetails.userId;
  const userName = userDetails.name;
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      const dataFromServer = await fetchPosts();
      setPosts(dataFromServer.postList);
      setRsvp(dataFromServer.rsvpBool);
      setEventName(dataFromServer.eventName);
    };
    getPosts();
  }, []);

  //fetch posts for discussion page
  const fetchPosts = async () => {
    const res = await axios.get(`/discussions/${eventId}/${userId}`);
    //console.log(res);
    const data = await res.data;
    return data;
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
          ? {
              ...post,
              likes: editLikeOnPost(post.likes, userId),
              totalLikes: post.totalLikes + 1,
            }
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
          ? {
              ...post,
              likes: editUnLikeOnPost(post.likes, userId),
              totalLikes: post.totalLikes - 1,
            }
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
    <>
      {rsvp ? (
        <div className="Discussion-Background">
          <Container>
            <Row>
              <Col>
                <HeaderDiscussion eventName={eventName} />
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
                  <p
                    className="text-uppercase"
                    style={{
                      fontWeight: "bold",
                      fontStyle: "italic",
                      fontSize: "20px",
                      color: "crimson",
                    }}
                  >
                    No Posts to Show!!
                  </p>
                )}
              </Col>
            </Row>
          </Container>
        </div>
      ) : (
        <div>
          <h1>RSVP to participate in discussion!</h1>
          <button onClick={() => navigate(-1)}>Go back</button>
        </div>
      )}
    </>
  );
};

export default HomeForDiscussion;
