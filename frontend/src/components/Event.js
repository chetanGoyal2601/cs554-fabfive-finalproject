import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import noImage from "../img/download.jpeg";
// import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";

let path = "http://localhost:3001/";

const Event = () => {
  const [eventData, setEventData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  let { id } = useParams();
  let address;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`http://localhost:3001/event/${id}`);
        if (data) {
          setIsError(false);
          setEventData(data);
          setLoading(false);
        }
      } catch (e) {
        setIsError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isError) return <Alert severity="error">Error! Pokemon not found!</Alert>;

  if (eventData && eventData.address) {
    address = eventData.address;
    if (eventData.address2) address = address + ", " + eventData.address2;
  } else {
    address = "No Address provided";
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <Card variant="outlined">
        <CardHeader title={eventData.name} component="div" />
        <CardMedia
          component="img"
          image={
            eventData.image // && show.thumbnail[0].path
              ? path + eventData.image
              : noImage
          }
        />

        <CardContent component="div">
          <Typography variant="body2" color="textSecondary" component="div">
            <dl>
              <dt className="title">Time :</dt>
              {eventData && eventData.time ? (
                <dd>{eventData.time}</dd>
              ) : (
                <dd>N/A</dd>
              )}
              <br />
              <dt className="title">Address:</dt>

              {eventData && eventData.address ? (
                <dd>{address}</dd>
              ) : (
                <dd>N/A</dd>
              )}
              <br />
              <dt className="title">Description:</dt>
              <dd>{eventData.description}</dd>
            </dl>
            <br />
            <Link to="/events/page/0">Back to all events</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Event;
