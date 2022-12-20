import React from 'react'
import bgImg from '../img/img1.png';
import { useForm } from 'react-hook-form';
import { Link,useOutletContext } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// import '../css/User.css';
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Container } from "@mui/system";
import  {  useEffect } from 'react';


export default function Form() {
    const auth = useOutletContext();
    const [resend, setResend] = useState(false);
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [validate, setValidate] = useState(false);
    const [alreadyExist, setExist] = useState(false);
    const [mail, setMail] = useState(false);
    const [failed, setFailed] = useState(false);
    const [failed_resend, setFailedResend] = useState(false);
    const navigate = useNavigate();
    const { register,setValue, handleSubmit, formState: { errors } } = useForm()

    useEffect(() => {
        setValue("name", auth.name)
        setValue("email", auth.email)
      });
    const onSubmit = async data => {
        const res = await axios.post('http://localhost:8000/user/signup', data)
        if (res.data.status === "PENDING") {
            setValidate(true);
            setFailed(false);
            setExist(false);
            setMail(true);
            setResend(false);
            setFailedResend(false);
            setId(res.data.data.userId);
            setEmail(res.data.data.email);
        }
        if (res.data.status === "FAILED" && res.data.message === "User with the provided email already exists") {
            setExist(true);
            setValidate(false);
            setResend(false);
            setMail(false)
            setFailed(false);
            setFailedResend(false);
        }
        if (res.data.status === "FAILED" && res.data.message !== "User with the provided email already exists") {
            setExist(false);
            setValidate(false);
            setResend(false);
            setMail(false)
            setFailed(true);
            setFailedResend(false);
        }
    }

    const onSubmit4 = async data1 => {
        data1.userId = id;
        data1.email = email;
        const res = await axios.post('http://localhost:8000/email_verification/resend', data1)
        if (res.data.status === "PENDING") {
            setResend(true);
            setValidate(false);
            setExist(false);
            setMail(false);
            setFailed(false);
            setFailedResend(false);
        }
        if (res.data.status === "FAILED") {
            setResend(false);
            setValidate(false);
            setExist(false);
            setMail(false);
            setFailed(false);
            setFailedResend(true);
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
                            <h1>SIGN UP</h1>
                            <span className='mb-3'>Register and Enjoy the Services</span>

                    <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                        <label className="text-decor" for="fullname">Full Name</label>
                        <input className="mb-3" id="fullname" type="text" {...register("name",{ required: true,minLength: 4, maxLength: 50 })} placeholder='Your Name' disabled />
                        {errors.name && <p className="exists">Name should be min 4 characters and max 50 characters</p>}
                        <label className="text-decor" for="email">Email</label>
                        <input className="mb-3" id="email" type="email" {...register("email",{ required: true, pattern: /[a-zA-Z0-9]+@stevens\.edu/i})} placeholder='username@stevens.edu' disabled />
                        {errors.email && <p className='exists'>Please enter Stevens mail id</p>}
                        <label className="text-decor" for="password">Password</label>
                        <input className="mb-3" id="password" type="password" {...register("password",{ required: true, minLength: 8,maxLength:16,pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/})} placeholder='password' required />
                        {errors.password && <p className='exists'>Password should contain one Capital Letter, one Small Letter, and the number of characters should be between 8 to 15</p>}
                        <label className="text-decor" for="dob">Date Of Birth</label>
                        <input className="mb-3" id="dob" type="date" {...register("dateOfBirth")} required/>
                        {/* {errors.date && <p id='exists'>Please enter Date from the past</p>} */}
                        <label className="text-decor" for="gender">Gender</label>
                        <select className="mb-3" id="gender"{...register("gender")} required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                            <option value="Pefer not to say">Prefer not to say</option>
                        </select>
                        {/* <input type="text" {...register("mobile")}  placeholder='' /> */}
                        <br></br>
                   
                 <button className='project-btn project-btn-primary'>SIGN UP</button>
                    </form>
                    <div className='d-grid'>
                                <Button as={Link} to="/signin" className="mb-3" variant="dark" size="md">
                                Already a Member, Sign In!
                                </Button>
                            </div>
                   
                    {validate && !alreadyExist ? (<span  className="valid">Verification email sent.</span>) : (resend ? (<span  className="valid">Verification email sent again.</span>) : (alreadyExist && !validate ? (<span  className="exists">User already exists. Please Log In</span>) : (failed?(<span  className="exists">User Sign Up Failed</span>):(failed_resend?(<span  className="exists">Failed to resend Verification mail</span>):("")))))}
                    <br></br>
                    {mail ? (
                        <button className='project-btn project-btn-secondary' onClick={handleSubmit(onSubmit4)}>Resend Verification Mail</button>) : ("")}

                </div>
              </Col>
              </Row>
              </div>
              </Container>
            </div>
        
    )
}