import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from 'react-bootstrap/InputGroup';

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
  
    <Form className="mb-3" name="AddForm" onSubmit={onSubmit}>
      <label htmlFor="my-input"></label>
        <InputGroup  className="mb-3">
          <Form.Control id="my-input"
            type="text"
            placeholder={
              formType === "post"
                ? "Ask/share anything about this event...."
                : "Make a new comment...."
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></Form.Control>
          <Button variant="primary" type="submit" >{`Add ${formType}`}</Button>
        </InputGroup>
    </Form>

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
