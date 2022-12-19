import { useState } from "react";

const AddNewFormDiscussion = ({ onAdd, formType }) => {
  const [text, setText] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!textValidation(text)) {
      alert(`Please add ${formType} with some value in it!`);
      setText("");
      return;
    }
    onAdd({ text });
    setText("");
  };

  return (
    <form name="AddForm" onSubmit={onSubmit}>
      <div>
        <label></label>
        <input
          type="text"
          placeholder={
            formType === "post"
              ? "Ask/share anything about this event...."
              : "Make a new comment...."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></input>
      </div>
      <input type="submit" value={`Add ${formType}`}></input>
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

export default AddNewFormDiscussion;
