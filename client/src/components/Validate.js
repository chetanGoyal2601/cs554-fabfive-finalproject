import React from 'react'
import bgImg from '../img/img1.png';
import { useForm } from 'react-hook-form';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// import '../css/User.css';
import { Container } from "@mui/system";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Circle } from "better-react-spinkit";


export default function Form({validateAuth}) {
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(true);
    const [validate, setValidate] = useState(false);
    const [validate1, setValidate1] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = async data => {
        setLoading(true);
        try{
        setStarted(true);
        const res = await axios.post('https://python-selenium-validate.herokuapp.com/', data)
        setLoading(false);
        setStarted(false);
        let stringArray = res.data.split(' ');
        if (stringArray[0].trim() === "Welcome") {
            setValidate(true);
            setMessage(res.data);
            setValidate1(false);
            console.log('name', stringArray.slice(1).join(' '));
            console.log('email', data.username);
            const nameArray = stringArray.slice(1).filter(str => str.trim().length!==0);
            const vAuth = {
                name: nameArray.join(' '),
                email: `${data.username.trim()}@stevens.edu`
            };
            validateAuth(vAuth);
            setTimeout(() => {
               navigate('/signup');
                }, 10000);
        }
        else {
             setValidate1(true)
            setValidate(false);
            setMessage("Validation Failed, Please Try Again")
        }
    }catch(e){
        setValidate1(true)
        setValidate(false);
        setMessage("Validation Failed, Please Try Again")
     }
    }

    if (loading) return (
        <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <div>
        <h1>Please wait while we validate your status</h1>
            <Circle color="black" size={60} />
        </div>
    </center>
    );

   


    return (
        <div className=" Stevens-Background">
        <Container>
            <div className="register2">
                <Row className="row">
                    <Col className="col">
                        <div className='d-grid'>
                            <img alt="MakeEventHappen" src={require('../img/logo_transparent.png')} style={{height:"10rem",width:"10rem",marginLeft:"auto",marginRight:"auto"}}/>
                    <h1>Please Validate Your Relationship with Steven's Institute Of Technology</h1>
                    <br></br>
                    <br></br>
                    <span>Note: If your email is apala1@stevens.edu, please enter only apala1</span>

                    <form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                        <label className='mb-3 text-decor'>Enter your Steven's Username</label>
                        <input className='mb-3' id="fullname" type="text" {...register("username")} placeholder='username' required />
                        <button className='project-btn project-btn-primary'>Validate</button>
                    </form>
                    {validate ? (<span className="valid">{message}</span>) : (validate1 ? (<span className="exists">{message}</span>): (""))}
                    <br></br>
                    <br></br>
                    <br></br>
                    {validate ? (<span >You'll be redirected to Sign Up Page shortly. Please dont close the window or click anything</span>):("")}
                </div>
                </Col>
                        </Row>
                    </div>
                </Container>
            </div>
    )
}