import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Container } from "@mui/system";

const CreateEvent = () => {
  let path = "http://localhost:3001/";
  const [file, setFile] = useState();
  const [response, setResponse] = useState();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  // const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [value, setValue] = React.useState(dayjs(new Date()));

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

    const result = await axios.post("http://localhost:3001/event", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setResponse(result.data);
  };

  return (
   
    <div className="App Home-Page-Background">
    <Container className="form-background">
    <div className="register">
      <div className="row">
      <div className="col-7">
      <div className="d-grid">
        <Button variant="secondary" size="md" active >
         CREATE EVENT
        </Button>
      </div>
        <Form onSubmit={submit} id='form' className='flex flex-col'>
        <label for="my-input">
        </label>
            <input id="my-input"
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
          {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Time : </Form.Label>
            <br />
            <Form.Control
              onChange={(e) => setTime(e.target.value)}
              type="text"
              placeholder="Time"
            />
          </Form.Group> */}
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
          {/* <label>Capacity</label>
          <input
            onChange={(e) => setCapacity(e.target.value)}
            type="number"
          ></input>*/}

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
          <Button variant="primary" type="submit">Submit</Button>
        </Form>

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
    <div className="col-5">
        <img alt="MakeEventHappen" src={require('../img/logo_transparent.png')} className="img-size"/>
     </div>
     </div>
   </div>
    </Container>
    </div>
   
  );
};

export default CreateEvent;
