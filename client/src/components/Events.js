import React, { useState, useEffect } from "react";
import axios from "axios";
import noImage from "../img/Party.jpeg";
import { useParams, Link, useOutletContext } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
import { nanoid } from "nanoid";
import Button from "react-bootstrap/Button";
// import Container from "react-bootstrap/Container";
import Alert from "@mui/material/Alert";
// import { CardHeader } from "@mui/material";
let path = "/";

// let userId = "123";

const Events = () => {
  const auth = useOutletContext();
  const loggedInUser = auth.userId;
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [previous, setPrevious] = useState(true); // for checking if previous page is there or not
  const [next, setNext] = useState(true); // for checking if next page exists or not
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [loggedInUser, setLoggedInUser] = useState(null);

  let { page } = useParams();
  let card = null;

  async function updateRSVP(eventId) {
    try {
      const { data } = await axios.patch(
        `/event/${eventId}`,
        { data: { page: page, userId: loggedInUser } },
        {
          headers: { Accept: "application/json" },
        }
      );
      if (data.results.length > 0) {
        setEventData(data.results);
        setIsError(false);
      } else {
        setIsError(true);
        setErrorMessage();
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
        { data: { page: page, userId: loggedInUser } },
        {
          headers: { Accept: "application/json" },
        }
      );
      if (data.results.length >= 0) {
        setEventData(data.results);
        setIsError(false);
      } else {
        setIsError(true);
      }
      // if (data.deleted) {
      //   for (let i = 0; i < eventData.length; i++) {
      //     if (eventData[i]._id === eventId) {
      //       let newEventData = [...eventData];
      //       newEventData.splice(i, 1);
      //       setEventData(newEventData);
      //       break;
      //     }
      //   }
      // }
    } catch (e) {
      setIsError(true);
      console.log(e);
      setErrorMessage(e.response.data.error);
    }
  }

  // function removeRsvp(eventId, loggedInUser) {}

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`/event/page/${page}`);
        if (data.previous === null) setPrevious(false);
        else setPrevious(true);
        if (data.next === null) setNext(false);
        else setNext(true);

        // if (data.userId) setLoggedInUser(data.userId);

        if (data.results.length > 0) {
          setEventData(data.results);
          setIsError(false);
        } else if (data.results.length === 0 && page > 0) {
          setIsError(true);
        } else if (data.results.length === 0 && page === 0)
          setEventData(data.result);
        setLoading(false);
      } catch (e) {
        setIsError(true);
        console.log(e);
        setErrorMessage(e.response.data.error);
      }
    }
    fetchData();
  }, [page]);

  if (isError) {
    return (
      <Alert severity="error">
        {errorMessage ? errorMessage : "Error! Could not load page."}
      </Alert>
    );
  }

  const buildCard = (event) => {
    let currentDate = new Date();
    let eventDate = new Date(event.eventDate);
    let address;
    if (event && event.address) {
      address = event.address;
      if (event.address2 && event.address2.length > 0)
        address = address + ", " + event.address2;
    } else {
      address = "No Address provided";
    }
    return (
      <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={nanoid()}>
        <Card
          sx={{
            maxWidth: 380,
            border: 3,
            borderColor: "white",
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Link
            className="link"
            sx={{ fontWeight: 600 }}
            to={`/event/${event._id}`}
          >
            <CardMedia
              height={200}
              component="img"
              image={event.image ? path + event.image : noImage}
              alt={event._id}
            />
            <CardContent
              sx={{
                fontWeight: "bold",
                color: "black",
                fontSize: 25,
              }}
            >
              <Typography className="text-uppercase">
                {event.title.charAt(0).toUpperCase() + event.title.slice(1)}
              </Typography>
              <Typography variant="body2" color="black" component="p">
                Host :{" "}
                {event.hostName ? event.hostName : "No Host name Mentioned"}
              </Typography>
              <Typography variant="body2" color="black" component="p">
                {event.time ? event.time : "No Time Mentioned"}
              </Typography>
              <Typography variant="body2" color="black" component="p">
                {address}
              </Typography>
              <Typography variant="body2" color="black" component="p">
                Spots available :{" "}
                {event.seatsAvailable ? event.seatsAvailable : "None"}
              </Typography>
              {/* <blockquote className="blockquote mb-0">
                <p variant="body2" color="black" component="p">
                  {event.description
                    ? event.description.substring(0, 139) + "..."
                    : "No Description"}
                    <p class="text-secondary">More Info..</p>
                </p>
                </blockquote> */}
            </CardContent>
          </Link>
          {loggedInUser &&
          eventDate > currentDate &&
          event.rsvps &&
          event.host &&
          event.seatsAvailable &&
          !event.rsvps.includes(loggedInUser) &&
          event.host !== loggedInUser &&
          event.seatsAvailable > 0 ? (
            <Button
              size="sm"
              variant="dark"
              onClick={() => {
                updateRSVP(event._id);
              }}
            >
              RSVP
            </Button>
          ) : undefined}
          {loggedInUser &&
          eventDate > currentDate &&
          event.host &&
          loggedInUser === event.host ? (
            <div className="p-2">
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  deleteEvent(event._id);
                }}
              >
                Delete Event
              </Button>{" "}
              <Button
                size="sm"
                variant="secondary"
                as={Link}
                to={`/discussions/${event._id}`}
              >
                Enter Discussion
              </Button>{" "}
              <Button
                size="sm"
                variant="primary"
                as={Link}
                to={`/chat/${event._id}`}
              >
                Chat
              </Button>
            </div>
          ) : undefined}

          {loggedInUser &&
          event.rsvps &&
          eventDate > currentDate &&
          event.rsvps.includes(loggedInUser) ? (
            <div>
              <Button
                size="sm"
                as={Link}
                to={`/chat/${event._id}`}
                variant="primary"
              >
                Chat with host
              </Button>{" "}
              <Button
                size="sm"
                variant="secondary"
                as={Link}
                to={`/discussions/${event._id}`}
              >
                Enter Discussion
              </Button>{" "}
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  updateRSVP(event._id, loggedInUser);
                }}
              >
                Remove RSVP
              </Button>
            </div>
          ) : undefined}
          <br />
          <br />
        </Card>
      </Grid>
    );
  };

  if (eventData) {
    if (eventData.length === 0)
      return (
        <div>
          <h2>No Events!</h2>
        </div>
      );
    card =
      eventData &&
      eventData.map((event) => {
        return buildCard(event);
      });
  }

  if (loading) {
    return (
      <div>
        <h4>Loading....</h4>
      </div>
    );
  } else {
    let prevId = parseInt(page) - 1;
    let nextId = parseInt(page) + 1;
    return (
      <div>
        <br />
        {previous && (
          <Button variant="secondary" as={Link} to={`/events/page/${prevId}`}>
            Previous
          </Button>
        )}
        {next && (
          <Button variant="secondary" as={Link} to={`/events/page/${nextId}`}>
            Next
          </Button>
        )}
        <br />
        <br />
        <br />
        <Grid
          container
          className="confetti-Background"
          spacing={12}
          alignItems={"center"}
          paddingLeft={10}
          paddingRight={10}
        >
          {card}
        </Grid>
      </div>
    );
  }
};

export default Events;
