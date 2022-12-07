import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { nanoid } from "nanoid";

import Alert from "@mui/material/Alert";
let path = "http://localhost:3001/";
let userId = "123";

const Events = () => {
  const [isError, setIsError] = useState(false);
  const [previous, setPrevious] = useState(true); // for checking if previous page is there or not
  const [next, setNext] = useState(true); // for checking if next page exists or not
  const [eventData, setEventData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);

  let { page } = useParams();
  let card = null;

  async function updateRSVP(eventId) {
    try {
      const { data } = await axios.patch(
        `http://localhost:3001/event/${eventId}`,
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
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteEvent(eventId) {
    try {
      const { data } = await axios.delete(
        `http://localhost:3001/event/${eventId}`,
        { data: { page: page } },
        {
          headers: { Accept: "application/json" },
        }
      );
      if (data.results.length > 0) {
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
      console.log(e);
    }
  }

  function joinDiscussion(eventId, loggedInUser) {}

  function chatWithHost(eventId, loggedInUser) {}

  // function removeRsvp(eventId, loggedInUser) {}

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/event/page/${page}`
        );
        if (data.previous === null) setPrevious(false);
        else setPrevious(true);
        if (data.next === null) setNext(false);
        else setNext(true);

        if (data.userId) setLoggedInUser(data.userId);

        if (data.results.length > 0) {
          setEventData(data.results);
          setIsError(false);
        } else {
          setIsError(true);
        }
        setLoading(false);
      } catch (e) {
        setIsError(true);
      }
    }
    fetchData();
  }, [page]);

  if (isError) {
    return <Alert severity="error">Error! Page not found!</Alert>;
  }

  const buildCard = (event) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={nanoid()}>
        {/* <div key={pokemon.name}> */}
        <Card sx={{ maxWidth: 350, border: 3, borderColor: "red" }}>
          <Link className="pokelink" to={`/event/${event._id}`}>
            <CardMedia
              component="img"
              image={path + event.image}
              alt={event._id}
            />
            <CardContent>
              <Typography
                sx={{
                  borderBottom: "1px solid #178577",
                  fontWeight: "bold",
                  color: "#ee0000",
                }}
                gutterBottom
                variant="h6"
                component="h2"
              >
                {event.title.charAt(0).toUpperCase() + event.title.slice(1)}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {event.time ? event.time : "No Time Mentioned"}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {event.address
                  ? event.address + ", " + event.address2
                  : "No Address Mentioned"}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Spots available :{" "}
                {event.seatsAvailable
                  ? event.seatsAvailable
                  : "No capacity Mentioned"}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {event.description
                  ? event.description.substring(0, 139) + "..."
                  : "No Description"}
                <span>More Info</span>
              </Typography>
            </CardContent>
          </Link>
          {loggedInUser &&
            event.rsvps &&
            event.host &&
            event.seatsAvailable &&
            !event.rsvps.includes(loggedInUser) &&
            event.host !== loggedInUser &&
            event.seatsAvailable > 0 && (
              <Button
                variant="contained"
                onClick={() => {
                  updateRSVP(event._id);
                }}
              >
                RSVP
              </Button>
            )}
          {loggedInUser && event.host && loggedInUser === event.host && (
            <div>
              <Button
                variant="contained"
                onClick={() => {
                  deleteEvent(event._id);
                }}
              >
                Delete Event
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  joinDiscussion(event._id, loggedInUser);
                }}
              >
                Enter Discussion
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  chatWithHost(event._id, loggedInUser);
                }}
              >
                Chat
              </Button>
            </div>
          )}

          {loggedInUser &&
            event.rsvps &&
            event.rsvps.includes(loggedInUser) && (
              <div>
                <Button
                  variant="contained"
                  onClick={() => {
                    chatWithHost(event._id, loggedInUser);
                  }}
                >
                  Chat with Host
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    joinDiscussion(event._id, loggedInUser);
                  }}
                >
                  Enter Discussion
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    updateRSVP(event._id, loggedInUser);
                  }}
                >
                  Remove RSVP
                </Button>
              </div>
            )}
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
        <h2>Loading....</h2>
      </div>
    );
  } else {
    let prevId = parseInt(page) - 1;
    let nextId = parseInt(page) + 1;
    return (
      <div>
        <br />
        {previous && (
          <Link className="showlink" to={`/events/page/${prevId}`}>
            Previous
          </Link>
        )}
        {next && (
          <Link className="showlink" to={`/events/page/${nextId}`}>
            Next
          </Link>
        )}
        <br />
        <br />
        <br />
        <Grid container spacing={5}>
          {card}
        </Grid>
      </div>
    );
  }
};

export default Events;
