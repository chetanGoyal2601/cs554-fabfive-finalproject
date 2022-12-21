import React, { useState } from "react";
import { useOutletContext, Navigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Alert from "@mui/material/Alert";
import { Container } from "@mui/system";

const CreateEvent = () => {
  const auth = useOutletContext();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [file, setFile] = useState();
  const [response, setResponse] = useState();
  const [value, setValue] = React.useState(dayjs(tomorrow));
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  // const [loggedInUser, setLoggedInUser] = useState(null);

  const [form, setForm] = useState({ address2: "" });
  const [errors, setErrors] = useState({});

  // console.log("user check", auth);
  const setField = (field, value) => {
    setForm({ ...form, [field]: value });

    if (!!errors[field]) setErrors({ ...errors, [field]: null });
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const { data } = await axios.get(`/event/user`);
  //       if (data) {
  //         if (data.userId) setLoggedInUser(data.userId);
  //       }
  //     } catch (e) {
  //       setIsError(true);
  //       setErrorMessage(e.response.data.error);
  //     }
  //   }
  //   fetchData();
  // });

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const validationForm = () => {
    const { title, description, address, capacity } = form;

    const newErrors = {};

    if (!title || title.trim() === "") newErrors.title = "Please enter a Title";

    if (!description || description.trim() === "")
      newErrors.description = "Please enter a Description";

    if (!address || address.trim() === "")
      newErrors.address = "Please enter an Address";
    else {
      if (!isNaN(address))
        newErrors.address = "Address cannot contain only numbers";
    }

    if (!capacity || capacity.trim() === "")
      newErrors.capacity = "Please enter an Capacity";
    else {
      if (isNaN(capacity)) newErrors.capacity = "Please enter a valid Capacity";
      if (capacity <= 0) newErrors.capacity = "Please enter a valid Capacity";
    }
    return newErrors;
  };

  const submit = async (event) => {
    event.preventDefault();

    const formErrors = validationForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      const { title, description, address, address2, capacity } = form;
      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", description);
      formData.append("title", title);
      formData.append("time", value);
      formData.append("capacity", capacity);
      formData.append("address", address);
      formData.append("address2", address2);
      formData.append("userId", auth.userId);
      try {
        const result = await axios.post("/event", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setResponse(result.data);
      } catch (e) {
        setIsError(true);
        console.log(e);
        setErrorMessage(e.response.data.error);
      }
    }
  };

  if (response && response._id) {
    // return <Alert severity="success">Event created Successfully.!</Alert>;
    return <Navigate to={`/event/${response._id}`} />;
  }

  if (isError)
    return (
      <Alert severity="error">
        {errorMessage ? errorMessage : "Error! Could not create event."}
      </Alert>
    );

  // if (loggedInUser && loggedInUser === "false") {
  //   //redirect to Login
  //   return <Navigate to="/" />;
  // } else {
  return (
    <div className="App Home-Page-Background">
      <Container>
        <div className="register">
          <div className="row">
            <div className="col-7">
              <div className="d-grid">
                <Button variant="secondary" size="md" active>
                  CREATE EVENT
                </Button>
              </div>
              <Form onSubmit={submit} id="form" className="flex flex-col">
                <label htmlFor="my-input"></label>
                <input
                  id="my-input"
                  filename={file}
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  accept="image/*"
                  // required
                ></input>
                <br />
                <Form.Group
                  className="mb-3"
                >
                  <Form.Label htmlFor="my-input1">Title : </Form.Label>
                  <br />
                  <Form.Control
                    id="my-input1"
                    onChange={(e) => setField("title", e.target.value)}
                    type="text"
                    placeholder="My Title"
                    required
                  />
                  <div className="red">{errors.title}</div>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                >
                  <Form.Label htmlFor="my-input2">Description : </Form.Label>
                  <Form.Control
                    id="my-input2"
                    onChange={(e) => setField("description", e.target.value)}
                    as="textarea"
                    rows={3}
                    cols={100}
                    required
                  />
                  <div className="red">{errors.description}</div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>Address : </Form.Label>
                  <Form.Control
                    
                    className="mb-3"
                    onChange={(e) => setField("address", e.target.value)}
                    type="text"
                    placeholder="1234 Main St"
                    required
                  />
                  <div className="red">{errors.address}</div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label >Address 2 : </Form.Label>
                  <Form.Control
                    
                    className="mb-3"
                    onChange={(e) => setField("address2", e.target.value)}
                    type="text"
                    placeholder="Apartment, studio, or floor"
                  />
                  <div className="red">{errors.address2}</div>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                >
                  <Form.Label htmlFor="my-input3">Capacity : </Form.Label>
                  <Form.Control
                    id="my-input3"
                    className="mb-3"
                    onChange={(e) => setField("capacity", e.target.value)}
                    type="number"
                    placeholder="Capacity"
                    required
                  />
                  <div className="red">{errors.capacity}</div>
                </Form.Group>
                
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <p> Select Date & Time:</p>
                  <DateTimePicker
                    label=" "
                    value={value}
                    onChange={handleChange}
                    type="datetime-local"
                    minDate={tomorrow}
                    maxDate={new Date().setFullYear(2023)}
                    // minTime={dayjs("2018-01-01T08:00")}
                    renderInput={(params) => <TextField {...params} />}
                  />
               
                </LocalizationProvider>

                <Button className="mt-3" variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </div>
            <div className="col-5">
              <img
                alt="MakeEventHappen"
                src={require("../img/logo_transparent.png")}
                className="img-size"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
// }
export default CreateEvent;
