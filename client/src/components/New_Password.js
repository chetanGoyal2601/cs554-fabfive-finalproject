import React from 'react'
import bgImg from '../img/img1.png';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from "react";
// import '../css/User.css';
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Container } from "@mui/system";

export default function Form() {
    const [error, setError] = useState(false);
    const [found, setFound] = useState(false);
    const [validate, setValidate] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = async data => {
        const data1 = window.location.pathname
        const data2 = data1.split('/')
        data.userId = data2[2]
        data.resetString = data2[3]
        const res = await axios.post('http://localhost:8000/forgot_password/reset', data)
        if (res.data.status === "SUCCESS" && res.data.message === "Password has been reset successfully.") {
            setValidate(true);
            setError(false);
            setFound(false);
        }
        if (res.data.status === "FAILED" && res.data.message === "Invalid password reset details passed.") {
            setValidate(false);
            setError(true);
            setFound(false);
        }
        if (res.data.status === "FAILED" && res.data.message === "Password reset request not found.") {
            setFound(true);
            setValidate(false);
            setError(false);
        }

        //console.log(res);
    }

    return (
        <section>
          <div className="Stevens-Background">
            <Container>
                <div className="register2">
                    <Row className="row">
                        <Col className="col">
                            <div className='d-grid'>
                            <img alt="MakeEventHappen" src={require('../img/logo_transparent.png')} style={{height:"10rem",width:"10rem",marginLeft:"auto",marginRight:"auto"}}/>
                    <h1>New Password</h1>
                    <span className='mb-3'>Enter your New Password</span>
                    <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                        <label className="text-decor" for="password">Password</label>
                        <input className="text-decor mb-3" id="password" type="password" {...register("newPassword")} placeholder='new password' required />

                        <button className='project-btn project-btn-primary'>SIGN IN</button>

                    </form>
                    {error ? (<span className="mb-3" id="exists">Invalid password reset details passed</span>) : (validate ? (<span className="mb-3" id="valid">Password has been reset successfully </span>) : (found ? (<span id="exists">Password reset link is invalid!! </span>) : ("")))}
                    <br></br>
                    <br></br>
                    <div className='d-grid'>
                          <Button as={Link} to="/signin" className="mb-3" variant="dark" size="md">
                           Procced to Login!
                        </Button>
                      </div>
                           
                </div>
               </Col>
               </Row>
               </div>
               </Container>
            </div>
        </section>
    )
}

