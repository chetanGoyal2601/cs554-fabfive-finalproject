import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Alert from "@mui/material/Alert";

const CreateEvent = () => {
  const [file, setFile] = useState();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [response, setResponse] = useState();
  // const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [value, setValue] = React.useState(dayjs(new Date()));
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`http://localhost:3001/event/user`);
        if (data) {
          if (data.userId) setLoggedInUser(data.userId);

          setIsError(false);
        }
      } catch (e) {
        setIsError(true);
        setErrorMessage(e.response.data.error);
      }
    }
    fetchData();
  });

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);
    formData.append("title", title);
    formData.append("time", value);
    formData.append("capacity", capacity);
    formData.append("address", address);
    formData.append("address2", address2);

    try {
      const result = await axios.post("http://localhost:3001/event", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(result.data);
    } catch (e) {
      setIsError(true);
      setErrorMessage(e.response.data.error);
    }
  };

  if (response && response._id) {
    return <Alert severity="success">Event created Successfully.!</Alert>;
    // return <Navigate to={`/event/${response._id}`} />;
  }

  if (isError)
    return (
      <Alert severity="error">
        {errorMessage ? errorMessage : "Error! Could not create event."}
      </Alert>
    );

  if (loggedInUser && loggedInUser === "false") {
    console.log("Redirect");
    //redirect to Login
    return <Navigate to="/" />;
  } else {
    return (
      <div className="App">
        <Form onSubmit={submit}>
          <input
            filename={file}
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            accept="image/*"
            alt="Jeff"
            required
          ></input>
          <br />
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title : </Form.Label>
            <br />
            <Form.Control
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="My Title"
              required
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
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>Address : </Form.Label>
            <br />
            <Form.Control
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="1234 Main St"
              required
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
            <Form.Label>Capacity : </Form.Label>
            <br />
            <Form.Control
              onChange={(e) => setCapacity(e.target.value)}
              type="number"
              placeholder="Capacity"
              required
            />
          </Form.Group>
          <br />
          <br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Event Date & Time"
              value={value}
              onChange={handleChange}
              type="datetime-local"
              minDate={new Date()}
              maxDate={new Date().setFullYear(2023)}
              minTime={dayjs("2018-01-01T08:00")}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <br />
          <button type="submit">Submit</button>
        </Form>
      </div>
    );
  }
};

export default CreateEvent;
