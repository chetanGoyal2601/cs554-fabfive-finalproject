import React, { useState, useEffect } from "react";
import { useParams, Link, useOutletContext, Navigate } from "react-router-dom";
import axios from "axios";
import noImage from "../img/Party.jpeg";
// import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "react-bootstrap/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "react-bootstrap/Button";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Nav from "react-bootstrap/Nav";
import { Circle } from "better-react-spinkit";

let path = "/";
const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const Event = () => {
  const auth = useOutletContext();
  const loggedInUser = auth.userId;
  const [eventData, setEventData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  // const [loggedInUser, setLoggedInUser] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [value, setValue] = React.useState(0);
  const [hover, setHover] = React.useState(-1);

  let { id } = useParams();
  let address;

  async function updateRSVP(eventId) {
    try {
      const { data } = await axios.patch(
        `/event/${eventId}`,
        { data: { page: null, userId: loggedInUser } },
        {
          headers: { Accept: "application/json" },
        }
      );
      if (data) {
        // if (data.userId) setLoggedInUser(data.userId);
        setIsError(false);
        setEventData(data.event);
        setLoading(false);
      } else {
        setIsError(true);
      }
    } catch (e) {
      setIsError(true);
      console.log(e);
      setErrorMessage(e.response.data.error);
    }
  }

  async function deleteEvent(eventId) {
    try {
      const { data } = await axios.delete(
        `/event/${eventId}`,
        { data: { page: null, userId: loggedInUser } },
        {
          headers: { Accept: "application/json" },
        }
      );
      if (data) {
        // if (data.userId) setLoggedInUser(data.userId);
        setIsError(false);
        setIsDeleted(true);
        setLoading(false);
      } else {
        setIsError(true);
      }
    } catch (e) {
      console.log(e);
      setIsError(true);
      setErrorMessage(e.response.data.error);
    }
  }

  async function setRating(eventId, rating) {
    try {
      const { data } = await axios.post(
        `/event/rating/${eventId}`,
        { data: { page: null, userId: loggedInUser, rating } },
        {
          headers: { Accept: "application/json" },
        }
      );
      if (data) {
        // if (data.userId) setLoggedInUser(data.userId);
        for (let rating of data.event.ratings) {
          if (loggedInUser === rating.userId) {
            setValue(rating.rating);
          }
        }
        setIsError(false);
        setLoading(false);
      } else {
        setIsError(true);
      }
    } catch (e) {
      console.log(e);
      setIsError(true);
      setErrorMessage(e.response.data.error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`/event/${id}`);
        if (data) {
          // if (data.userId) setLoggedInUser(data.userId);
          setIsError(false);
          setEventData(data);
          setLoading(false);
        }
      } catch (e) {
        setIsError(true);
        console.log(e);
        setErrorMessage(e.response.data.error);
      }
    }
    fetchData();
  }, [id]);

  if (isDeleted)
    // return <Alert severity="success">Event was successfully deleted</Alert>;
    return <Navigate to={`/events/page/0`} />;

  if (isError)
    return (
      <Alert severity="error">
        {errorMessage ? errorMessage : "Error! Could not load page."}
      </Alert>
    );

  if (eventData && eventData.address) {
    address = eventData.address;
    if (eventData.address2 && eventData.address2.length > 0)
      address = address + ", " + eventData.address2;
  } else {
    address = "No Address provided";
  }

  if (loading) {
    return (
      <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
          <div>
              <img src={require('../img/logo_transparent.png')}
                  alt="Loading.."
                  style={{ height:"20rem",width:"20rem", marginBottom: 10}}
                  height={300}
              />
              <Circle color="black" size={120} />
          </div>
      </center>
  );
  } else {
    let currentDate = new Date();
    let eventDate = new Date(eventData.eventDate);
    let userRating = null;
    let sum = 0;

    for (let rating of eventData.ratings) {
      if (loggedInUser === rating.userId) {
        userRating = rating.rating;
        break;
      }
    }

    for (let rating of eventData.ratings) {
      sum += rating.rating;
    }

    return (
      <div className="purple_background">
        <div className="row">
          <div className="col p-4">
            <Card
              bg="light"
              style={{
                width: "50rem",
                height: "auto",
                alignItems: "center",
                marginLeft: "auto",
                marginRight: "auto",
                paddingTop: "auto",
                paddingBottom: "auto",
                borderRadius: "20px",
                overflow: "hidden",
                borderColor: "#1e0a3c",
                borderWidth: 6,
              }}
            >
              <CardHeader title={eventData.time} component="div" />
              <CardMedia
                style={{
                  width: "30rem",
                  height: "28rem",
                  borderBottomRightRadius: "20px",
                  borderBottomLeftRadius: "20px",
                }}
                component="img"
                alt="EventsImage"
                image={
                  eventData.image // && show.thumbnail[0].path
                    ? path + eventData.image
                    : noImage
                }
              />

              <CardContent component="div">
                {/* <Typography variant="body2" color="black" component="div"> */}
                {eventData && eventData.title ? (
                  <Card.Header><p className="text-uppercase" style={{fontSize:"30px",fontWeight:"bolder",fontStyle:"italic",color:"black"}}>{eventData.title}</p></Card.Header>
                ) : (
                  <Card.Header>N/A</Card.Header>
                )}
                <Card.Body>
                  <Card.Title> Hostname :</Card.Title>
                  {eventData && eventData.hostName ? (
                    <Card.Text>{eventData.hostName}</Card.Text>
                  ) : (
                    <Card.Text>N/A</Card.Text>
                  )}
                  <Card.Title> Time :</Card.Title>
                  {eventData && eventData.time ? (
                    <Card.Text>{eventData.time}</Card.Text>
                  ) : (
                    <Card.Text>N/A</Card.Text>
                  )}
                  <Card.Title>Address: </Card.Title>

                  {eventData && eventData.address ? (
                    <Card.Text>{address}</Card.Text>
                  ) : (
                    <Card.Text>N/A</Card.Text>
                  )}
                  {eventDate > currentDate && (
                    <Card.Title>
                      Spots available :{" "}
                      {eventData.seatsAvailable
                        ? eventData.seatsAvailable
                        : "None"}
                    </Card.Title>
                  )}
                  <Card.Title>Description: </Card.Title>
                  <Card.Text className="text-wrap">
                    {eventData.description}
                  </Card.Text>

                  {loggedInUser &&
                    eventData.host &&
                    eventData.host !== loggedInUser &&
                    eventData.rsvps &&
                    eventData.rsvps.includes(loggedInUser) &&
                    eventData.eventDate &&
                    eventDate < currentDate ? (
                      <div>
                        <Typography component="legend">
                          Rate the host
                        </Typography>
                        <Rating
                          name="hover-feedback"
                          value={value ? value : userRating}
                          precision={0.5}
                          getLabelText={getLabelText}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setValue(newValue);
                              setRating(eventData._id, newValue);
                            }
                          }}
                          onChangeActive={(event, newHover) => {
                            setHover(newHover);
                          }}
                          emptyIcon={
                            <StarIcon
                              style={{ opacity: 0.55 }}
                              fontSize="inherit"
                            />
                          }
                        />
                        {value !== null && (
                          <Box sx={{ ml: 2 }}>
                            {labels[hover !== -1 ? hover : value]}
                          </Box>
                        )}
                      </div>
                    ) : undefined}
                  {loggedInUser &&
                    eventData.eventDate &&
                    eventDate > currentDate &&
                    eventData.rsvps &&
                    eventData.host &&
                    eventData.seatsAvailable &&
                    !eventData.rsvps.includes(loggedInUser) &&
                    eventData.host !== loggedInUser &&
                    eventData.seatsAvailable > 0 ? (
                      <Button
                        size="md"
                        variant="dark"
                        onClick={() => {
                          updateRSVP(eventData._id);
                        }}
                      >
                        RSVP
                      </Button>
                    ) : undefined}
                  {loggedInUser &&
                    eventDate < currentDate &&
                    eventData.host &&
                    loggedInUser === eventData.host ? (
                      <div>
                        <Typography component="legend">Host Rating</Typography>
                        <Rating
                          name="read-only"
                          value={sum / eventData.ratings.length}
                          readOnly
                        />
                      </div>
                    ) : undefined}
                  {loggedInUser &&
                    eventDate > currentDate &&
                    eventData.host &&
                    loggedInUser === eventData.host ? (
                      <div className="mb-2">
                        <Button
                          size="md"
                          variant="danger"
                          onClick={() => {
                            deleteEvent(eventData._id);
                          }}
                        >
                          Delete Event
                        </Button>{" "}
                        <Button
                          size="md"
                          variant="primary"
                          as={Link}
                          to={`/discussions/${eventData._id}`}
                        >
                          Enter Discussion
                        </Button>{" "}
                        <Button
                          size="md"
                          variant="dark"
                          as={Link}
                          to={`/chat/${eventData._id}`}
                        >
                          Chat
                        </Button>
                      </div>
                    ) : undefined}

                  {loggedInUser &&
                    eventDate &&
                    eventDate > currentDate &&
                    eventData.rsvps &&
                    eventData.rsvps.includes(loggedInUser) ? (
                      <div className="mb-2">
                        <Button
                          size="md"
                          as={Link}
                          to={`/chat/${eventData._id}`}
                          variant="primary"
                        >
                          Chat with host
                        </Button>{' '}
                        <Button
                          size="md"
                          variant="secondary"
                          as={Link}
                          to={`/discussions/${eventData._id}`}
                        >
                          Enter Discussion
                        </Button>{" "}
                        <Button
                          size="md"
                          variant="danger"
                          onClick={() => {
                            updateRSVP(eventData._id, loggedInUser);
                          }}
                        >
                          Remove RSVP
                        </Button>
                      </div>
                    ) : undefined}
                  <br />
                  <Nav.Link
                    as={Link}
                    to="/events/page/0"
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#1e0a3c",
                    }}
                  >
                    Back to all events
                  </Nav.Link>
                </Card.Body>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
};

export default Event;
