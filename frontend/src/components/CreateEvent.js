import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const CreateEvent = () => {
  let path = "http://localhost:3001/";
  const [file, setFile] = useState();
  const [response, setResponse] = useState();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [startDate, setStartDate] = React.useState(dayjs("2022-04-07"));

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);
    formData.append("title", title);
    formData.append("time", time);
    formData.append("capacity", capacity);
    formData.append("address", address);
    formData.append("address2", address2);

    const result = await axios.post("http://localhost:3001/event", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setResponse(result.data);
  };

  return (
    <div className="App">
      <Form onSubmit={submit}>
        <input
          filename={file}
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          accept="image/*"
          alt="Jeff"
        ></input>
        <br />
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Title : </Form.Label>
          <br />
          <Form.Control
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="My Title"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Description : </Form.Label>
          <br />
          <Form.Control
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            as="textarea"
            rows={3}
            cols={100}
          />
        </Form.Group>
        {/* <label>Description</label>
        <input
          onChange={(e) => setDescription(e.target.value)}
          type="text"
        ></input> */}
        {/* <label>Title</label>
        <input onChange={(e) => setTitle(e.target.value)} type="text"></input>
        <br /> */}
        {/* <label>Time</label>
        <input onChange={(e) => setTime(e.target.value)} type="text"></input>
        <br /> */}
        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Address : </Form.Label>
          <br />
          <Form.Control
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            placeholder="1234 Main St"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress2">
          <Form.Label>Address 2 : </Form.Label>
          <br />
          <Form.Control
            onChange={(e) => setAddress2(e.target.value)}
            type="text"
            placeholder="Apartment, studio, or floor"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Time : </Form.Label>
          <br />
          <Form.Control
            onChange={(e) => setTime(e.target.value)}
            type="text"
            placeholder="Time"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Capacity : </Form.Label>
          <br />
          <Form.Control
            onChange={(e) => setCapacity(e.target.value)}
            type="number"
            placeholder="Capacity"
          />
        </Form.Group>
        {/* <label>Capacity</label>
        <input
          onChange={(e) => setCapacity(e.target.value)}
          type="number"
        ></input>
        <button type="submit">Submit</button> */}
      </Form>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
      {response && response.title && <p>{response.title}</p>}
      {response && response.description && <p>{response.description}</p>}
      {response && response.time && <p>{response.time}</p>}
      {response && response.capacity && <p>{response.capacity}</p>}
      {response && response.address && <p>{response.address}</p>}
      {response && response.address2 && <p>{response.address2}</p>}
      {response && response.image && (
        <img alt="Jeff" src={path + response.image} />
      )}
    </div>
  );
};

export default CreateEvent;
