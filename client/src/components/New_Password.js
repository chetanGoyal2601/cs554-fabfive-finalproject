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
    const [failed, setFailed] = useState(false);
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
            setFailed(false);
        }
        if (res.data.status === "FAILED" && res.data.message === "Invalid password reset details passed.") {
            setValidate(false);
            setError(true);
            setFound(false);
            setFailed(false);
        }
        if (res.data.status === "FAILED" && res.data.message === "Password reset request not found.") {
            setFound(true);
            setValidate(false);
            setError(false);
            setFailed(false);
        }

        if (res.data.status === "FAILED" && res.data.message !== "Invalid password reset details passed." && res.data.message !== "Password reset request not found.") {
            setFound(false);
            setValidate(false);
            setError(false);
            setFailed(true);
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
                        <input className="text-decor mb-3" id="password" type="password" {...register("newPassword",{ required: true, minLength: 8,maxLength:16,pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/})} placeholder='new password' required />
                        {errors.password && <p className='exists'>Password should contain one Capital Letter, one Small Letter, and the number of characters should be between 8 to 15</p>}

                        <button className='project-btn project-btn-primary'>RESET</button>

                    </form>
                    {error ? (<span className="exists">Invalid password reset details passed</span>) : (validate ? (<span className="valid">Password has been reset successfully </span>) : (found ? (<span className="exists">Password reset link is invalid!! </span>) : (failed?(<span className="exists">Password reset Failed!! </span>):(""))))}
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