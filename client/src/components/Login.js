import React from 'react'
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


export default function Form() {
    const [response, setResponse] = useState(false);
    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [mail, setMail] = useState(false);
    const [error, setError] = useState(false);
    const [validate, setValidate] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = async data => {
        const res = await axios.post('http://localhost:8000/user/signin', data)
        if (res.data.status === "SUCCESS") {
            setError(false);
            setValidate(false);
            setMail(false);
            navigate('/profile');


        }
        if (res.data.status === "FAILED" && res.data.message === "Email hasn't been verified yet. Check your inbox.") {
            setValidate(true);
            setError(false);
            setMail(true);
            setResponse(false);
            let dataa = {}
            dataa.email = data.email;
            const rem1 = await axios.post('http://localhost:8000/user/userbyemail', dataa)
            setId(rem1.data[0]._id)
            setEmail(rem1.data[0].email)
        }
        if (res.data.status === "FAILED" && res.data.message === "Invalid credentials entered!") {
            setError(true);
            setValidate(false);
            setMail(false);
            setResponse(false);
        }
    }

    const onSubmit4 = async data1 => {
        data1.userId = id;
        data1.email = email;
        const res = await axios.post('http://localhost:8000/email_verification/resend', data1)
        if (res.data.status === "PENDING") {
            setError(false);
            setValidate(false);
            setMail(false);
            setResponse(true);
        }
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
                                        <input id="email" className='mb-3' type="email" {...register("email")} placeholder='username@stevens.edu' />
                                        <label className='mb-3 text-decor' for="password">Password:</label>
                                        <input className='mb-3' id="password" type="password" {...register("password")} placeholder='password' />
                                        {/* <input type="text" {...register("mobile")}  placeholder='' /> */}
                                        <button className='project-btn project-btn-primary'>SIGN IN</button>
                                    </form>
                                    {error ? (<span className="mb-3" id="exists">Invalid Credentials Entered</span>) : (validate ? (<span className="mb-3" id="exists">Email hasn't been verified yet. Check your inbox </span>) : (response ? (<span className="mb-3" id="valid">Verification mail resent ! </span>) : ("")))}
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