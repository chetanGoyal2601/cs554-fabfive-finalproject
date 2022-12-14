import React, { useEffect } from 'react'
import bgImg from '../img/img1.png';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import '../css/User.css';
import { Container } from "@mui/system";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Circle } from "better-react-spinkit";


export default function Form({login, removeAuth}) {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(false);
    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [mail, setMail] = useState(false);
    const [error, setError] = useState(false);
    const [validate, setValidate] = useState(false);
    const [failed_resend, setFailedResend] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm()

    useEffect(() => {
        // removes validation auth
        removeAuth();
    }, []);

    const onSubmit = async data => {
        setLoading(true)
        const res = await axios.post('/user/signin', data)
        setLoading(false)
        if (res.data.status === "SUCCESS") {
            setError(false);
            setValidate(false);
            setMail(false);
            login(res.data.user);
            navigate('/events/page/0');
        }
        if (res.data.status === "FAILED" && res.data.message === "Email hasn't been verified yet. Check your inbox.") {
            setValidate(true);
            setError(false);
            setMail(true);
            setResponse(false);
            let dataa = {}
            dataa.email = data.email;
            const rem1 = await axios.post('/user/userbyemail', dataa)
            console.log(rem1);
            setId(rem1.data[0]._id)
            setEmail(rem1.data[0].email)
        }
        if (res.data.status === "FAILED" && res.data.message === "Invalid credentials entered!") {
            setError(true);
            setValidate(false);
            setMail(false);
            setResponse(false);
        }
        if(res.data.status === "FAILED" && res.data.message !== "Invalid credentials entered!" && res.data.message !== "Email hasn't been verified yet. Check your inbox."){
            setError(true);
            setValidate(false);
            setMail(false);
            setResponse(false);
        }
    }
   

    const onSubmit4 = async data1 => {
        data1.userId = id;
        data1.email = email;
        setLoading(true)
        const res = await axios.post('/email_verification/resend', data1)
        setLoading(false)
        if (res.data.status === "PENDING") {
            setError(false);
            setValidate(false);
            setMail(false);
            setResponse(true);
            setFailedResend(false);
        }
        if (res.data.status === "FAILED") {
            setError(false);
            setValidate(false);
            setMail(false);
            setResponse(true);
            setFailedResend(true);
        }
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
        }

    return (
              <div className=" Stevens-Background">
                <Container>
                    <div className="register2">
                        <Row className="row">
                            <Col className="col">
                                <div className='d-grid'>
                                    <img alt="MakeEventHappen" src={require('../img/logo_transparent.png')} style={{height:"10rem",width:"10rem",marginLeft:"auto",marginRight:"auto"}}/>
                                    <h1>LOGIN</h1>
                                    </div>
                                    <form  className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                                        <label className='mb-3 text-decor' for="email">Email:</label>
                                        <input id="email" className='mb-3' type="email" {...register("email",{ required: true, pattern: /[a-zA-Z0-9]+@stevens\.edu/i})} placeholder='username@stevens.edu' required/>
                                        {errors.email && <p className='exists'>Please enter Stevens mail id</p>}
                                        <label className='mb-3 text-decor' for="password">Password:</label>
                                        <input className='mb-3' id="password" type="password" {...register("password")} placeholder='password' required/>
                                        {/* <input type="text" {...register("mobile")}  placeholder='' /> */}
                                        <button className='project-btn project-btn-primary'>SIGN IN</button>
                                    </form>
                                    {error ? (<span  className="exists">Invalid Credentials Entered</span>) : (validate ? (<span  className="exists">Email hasn't been verified yet. Check your inbox </span>) : (response ? (<span  className="valid">Verification mail resent ! </span>) : (failed_resend?(<span  className="exists">Failed to resend Verification mail</span>):(""))))}
                                    <br></br>
                                    
                                    {mail ? (
                                    <button  className='project-btn project-btn-secondary' onClick={handleSubmit(onSubmit4)}>Resend Verification Mail</button>) : ("")}
                                    <div className="d-grid gap-2">
                                        <Button variant="danger" to="/forgot_password" as={Link} size="md">
                                            Forgot Password
                                        </Button>
                                        <Button variant="dark" as={Link} to="/signup" size="md">
                                            Not a Member, Sign Up
                                        </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
    )
}