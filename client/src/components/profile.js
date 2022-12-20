import React from 'react'
import  {useEffect,useState } from "react";
import axios from 'axios';
// import '../css/User.css';
import { useOutletContext } from 'react-router-dom';
import { Routes,Route, Link, useParams,useNavigate } from 'react-router-dom';
import 
{
 CardActionArea, 
 CardContent, 
 CardMedia, 
 Grid, 
 Typography, 
 makeStyles} from '@material-ui/core';
import '../App.css';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		backgroundColor: '#FEE715FF',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});


export default function Form() {
  const navigate = useNavigate();
  const classes = useStyles();
  const regex = /(<([^>]+)>)/gi;
  const [data, setData] = useState(" ");
  const [host_past, setHost_past] = useState([]);
  const [rsvp_past, setRsvp_past] = useState([]);
  const [host_future, setHost_future] = useState([]);
  const [rsvp_future, setRsvp_future] = useState([]);
  const auth = useOutletContext();
  let card1 = null;
  let card2= null;
  let card3 = null;
  let card4 = null;


  useEffect(() => {
    async function fetchData(){
    let data2={}
    data2.email=auth.email
    console.log(data2)
    const res = await axios.post('http://localhost:8000/user/userwithemail', data2)
      setData(res?.data?.data)
      setHost_past(res?.data?.hosted_past);
      setHost_future(res?.data?.hosted_future);
      setRsvp_past(res?.data?.reserve_past);
      setRsvp_future(res?.data?.reserve_future);
    }
    fetchData();
}, []);





    const buildCard = (show) => {
      return (
        <Grid className="mb-3" item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Card onClick={() => navigate(`/event/${show._id}`)} className={classes.card} variant="light" bg="light" text='dark' >
            <CardActionArea component='div'>
                              <CardContent>
                                  <p style={{fontSize:"20px",fontWeight:"700"}}>
                                      {show.title}
                                  </p>
                                  <Typography variant='body2' color='black' component='p' className='map'>
                                      {show.description ? show.description.replace(regex, '').substring(0, 139) + '...' : 'No Description'}
                    <br></br>
                    <p className="text-uppercase" style={{fontSize:"13px",fontWeight:"600",color:"crimson"}}>More Info..</p>
                                  </Typography>
                              </CardContent>
                          {/* </Link> */}
                      </CardActionArea>
          </Card>
        </Grid>
      );
    };

    if (host_past) {
      if (host_past.length === 0)
      {
      card1 ="no past hosted events"
      }
    card1 =
    host_past &&
    host_past.map((show) => {
        return buildCard(show);
    });
  }

  if (host_future) {
    if (host_future.length === 0)
    {
      card2 ="no future hosted events"
      }
    card2 =
    host_future &&
    host_future.map((show) => {
        return buildCard(show);
    });
  }

  if (rsvp_past) {
    if (rsvp_past.length === 0)
    {
      card3 ="no past rsvp events"
      }
    card3 =
    rsvp_past &&
    rsvp_past.map((show) => {
        return buildCard(show);
    });
  }

  if (rsvp_future) {
    if (rsvp_future.length === 0)
    {
      card4 ="no future rsvp events"
      }
    card4 =
    rsvp_future &&
    rsvp_future.map((show) => {
        return buildCard(show);
    });
  }

  return (
    <section>
      {data !==null ?
      (<div  className="concert-Background">
        <Card  variant="secondary" text="dark" className='mb-3 '
              style={{
                width: "50rem",
                height: "auto",
                alignItems: "center",
                marginLeft: "auto",
                marginRight: "auto",
                paddingTop: "auto",
                paddingBottom: "auto",
                overflow: "hidden",
                marginTop:"auto",
                borderRadius:"20px",
                opacity:"0.8"
              }}>
          <p  className="text-uppercase" style={{fontSize:"28px",fontWeight:"600",fontStyle:"italic"}}>{data.name}</p>
          <p style={{fontSize:"23px",fontWeight:"500"}}>Email : {data.email}</p>
          <p style={{fontSize:"23px",fontWeight:"500"}}>Gender : {data.gender}</p>
          <p style={{fontSize:"23px",fontWeight:"500"}}>Rating : {data.rating}</p>
        </Card>
        <Grid item lg={8} container className={classes.grid} style={{marginLeft:"auto",marginRight:"auto",alignItems:"center"}}>
                        <Row  className='mb-3 justify-content-center w-100'>
                        <p className="text-uppercase" style={{fontSize:"28px",fontWeight:"bolder",fontStyle:"italic",color:"black",background:"white",opacity:"0.7",borderRadius:"20px"}}>Hosted Events in Past</p>
                            {card1}
                        </Row>
                        <Row className='mb-3 justify-content-center w-100'>
                         
                        <p className="text-uppercase" style={{fontSize:"28px",fontWeight:"bolder",fontStyle:"italic",color:"black",background:"white",opacity:"0.7",borderRadius:"20px"}}>Upcoming Future Events</p>
                          {card2}
                         
                        </Row>
                        <Row className='mb-3 justify-content-center w-100'>
                        
                        <p className="text-uppercase" style={{fontSize:"28px",fontWeight:"bolder",fontStyle:"italic",color:"black",background:"white",opacity:"0.7",borderRadius:"20px"}}>RSVP'd Events from Past</p>
                        {card3}
                       
                        </Row>
                        <Row className='mb-3 justify-content-center w-100'>
                        <p className="text-uppercase" style={{fontSize:"28px",fontWeight:"bolder",fontStyle:"italic",color:"black",background:"white",opacity:"0.7",borderRadius:"20px"}}>RSVP'd Events in Future</p>
                        {card4}
                        </Row>
                    </Grid>
      </div>):("")}
      <div>
      <button  className='project-btn project-btn-secondary' onClick={onSubmit4}>Reveal</button>
      </div>
    </section>
  )

  
}