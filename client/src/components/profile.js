import React from 'react'
import  {useEffect,useState } from "react";
import axios from 'axios';
// import '../css/User.css';
import { useOutletContext } from 'react-router-dom';
import { Routes,Route, Link, useParams,useNavigate } from 'react-router-dom';
import 
{ Card,
 CardActionArea, 
 CardContent, 
 CardMedia, 
 Grid, 
 Typography, 
 makeStyles} from '@material-ui/core';
import '../App.css';

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
  async function onSubmit4 () {
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
    const buildCard = (show) => {
      return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}  >
          <Card onClick={() => navigate(`/event/${show._id}`)} className={classes.card} variant='outlined' component='div' >
            <CardActionArea component='div'>
              {/* <Link to={`/comics/${show.id}`}> */}
               
  
                              <CardContent>
                                  <Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
                                      {show.title}
                                  </Typography>
                                  <Typography variant='body2' color='black' component='p' className='map'>
                                      {show.description ? show.description.replace(regex, '').substring(0, 139) + '...' : 'No Description'}
                    <br></br>
                    <span className='map'><u>More Info</u></span>
                                  </Typography>
                              </CardContent>
                          {/* </Link> */}
                      </CardActionArea>
          </Card>
        </Grid>
      );
    };

    card1 =
    host_past &&
    host_past.map((show) => {
        return buildCard(show);
    });
    card2 =
    host_future &&
    host_future.map((show) => {
        return buildCard(show);
    });
    card3 =
    rsvp_past &&
    rsvp_past.map((show) => {
        return buildCard(show);
    });
    card4 =
    rsvp_future &&
    rsvp_future.map((show) => {
        return buildCard(show);
    });

  return (
    <section>
      {data !==null ?
      (<div>
        <h1>Name : {data.name}</h1>
        <h1>Email : {data.email}</h1>
        <h1>Gender : {data.gender}</h1>
        <h1>Rating : {data.rating}</h1>

        <Grid container className={classes.grid} spacing={5}>
          <div>
          <h1>Hosted events - past</h1>
                        {card1}
                        <br></br>
                        <br></br>
                        </div>
                        <div>
                        <h1>Hosted events - future</h1>
                        {card2}
                        <br></br>
                        <br></br>
                        </div>
                        <div>
                        <h1>RSVP'd events - past</h1>
                        {card3}
                        <br></br>
                        <br></br>
                        </div>
                        <div>
                        <h1>RSVP'd events - future</h1>
                        {card4}
                        <br></br>
                        <br></br>
                        </div>
                    </Grid>
      </div>):("")}
      <div>
      <button  className='project-btn project-btn-secondary' onClick={onSubmit4}>Reveal</button>
      </div>
    </section>
  )

  
}



