import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Alert from "@mui/material/Alert";
let path = "http://localhost:3001/";

const Events = () => {
  const [isError, setIsError] = useState(false);
  const [previous, setPrevious] = useState(true); // for checking if previous page is there or not
  const [next, setNext] = useState(true); // for checking if next page exists or not
  const [eventData, setEventData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  let { page } = useParams();

  function updateRSVP(eventId) {}

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
  let card;

  const buildCard = (event) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={event.title}>
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
                  : "No Time Mentioned"}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Spots available :{" "}
                {event.capacity ? event.capacity : "No capacity Mentioned"}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {event.description
                  ? event.description.substring(0, 139) + "..."
                  : "No Description"}
                <span>More Info</span>
              </Typography>
            </CardContent>
          </Link>
          <Button
            variant="contained"
            onClick={() => {
              updateRSVP(event.id);
            }}
          >
            RSVP
          </Button>
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
