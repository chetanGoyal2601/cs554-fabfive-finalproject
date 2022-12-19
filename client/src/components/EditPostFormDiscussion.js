import { useState } from "react";

const EditPostFormDiscussion = ({
  onEdit,
  postId,
  textInPost,
  changeShowPost,
}) => {
  const [text, setText] = useState(textInPost);
  const cancelState = { button: 1 };

  const onSubmit = (e) => {
    //console.log(postId);
    e.preventDefault();
    if (cancelState.button === 1) {
      changeShowPost();
      return;
    }
    if (!textValidation(text)) {
      alert(`Please edit post with some value in it!`);
      setText(textInPost);
      return;
    }
    onEdit(text, postId);
    setText("");
    changeShowPost();
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label></label>
        <input
          type="text"
          placeholder="Edit post"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></input>
      </div>
      <input
        type="submit"
        value="Submit"
        onClick={() => (cancelState.button = 0)}
      ></input>
      <input
        type="submit"
        value="Cancel"
        onClick={() => (cancelState.button = 1)}
      ></input>
    </form>
  );
};

//to check if text is string type
function textValidation(text) {
  if (!text) return false;
  if (typeof text !== "string") return false;
  if (text.trim().length === 0) return false;
  //console.log("Hello111text");
  return true;
}

export default EditPostFormDiscussion;
