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
    const [success, setSuccess] = useState(false);
    const [r_n_f, setNf] = useState(false);
    const [in_valid, setIn_Valid] = useState(false);
    const [c_n_v, setCode] = useState(false);
    const [display, setDisplay] = useState(false);
    const [email, setEmail] = useState(false);
    const [error, setError] = useState(false);
    const [validate, setValidate] = useState(false);
    const [resend, setResend] = useState(false);
    const [data2, setData2] = useState("");
    const [id, setId] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { register: register1, handleSubmit: handleSubmit1, formState: { errors1 } } = useForm()
    const onSubmit = async data => {
        data.redirectUrl = 'http://localhost:3000/new_password';
        const res = await axios.post('http://localhost:8000/forgot_password/request', data)
        setData2(data.email);
        if (res.data.status === "PENDING" && res.data.message === "Password reset email sent") {
            setValidate(true);
            setError(false);
            setEmail(false);
            setResend(true);
        }
        if (res.data.status === "FAILED" && res.data.message === "No account with the supplied email exists!") {
            setValidate(false);
            setError(true);
            setEmail(false);
        }
        if (res.data.status === "FAILED" && res.data.message === "Email hasn't been verified yet. Check your inbox.") {
            setEmail(true);
            setValidate(false);
            setError(false);
        }
    }
    const onSubmit1 = async data1 => {
        data1 = {};
        data1.email = data2;
        const rem = await axios.post('http://localhost:8000/forgot_password_otp/request', data1)
        setDisplay(true);
        let dataa = {}
        dataa.email = data2
        const rem1 = await axios.post('http://localhost:8000/user/userbyemail', dataa)
        setId(rem1.data[0]._id)
        document.getElementById("form").reset();
    }



    const onSubmit2 = async data3 => {
        //delete data3.email;
        data3.userId = id;
        const rem = await axios.post('http://localhost:8000/forgot_password_otp/reset', data3)
        console.log(rem);
        if (rem.data.status === "FAILED" && rem.data.message === "Password reset request not found.") {
            setNf(true);
            setIn_Valid(false);
            setCode(false);
            setSuccess(false);
        }
        if (rem.data.status === "FAILED" && rem.data.message === "Code has expired. Please request again.") {
            setNf(false);
            setIn_Valid(false);
            setCode(true);
            setSuccess(false);
        }
        if (rem.data.status === "FAILED" && rem.data.message === "Invalid code passed. Check your inbox.") {
            setNf(false);
            setCode(false);
            setIn_Valid(true);
            setSuccess(false);

        }
        if (rem.data.status === "SUCCESS" && rem.data.message === "Password has been reset successfully.") {
            setNf(false);
            setCode(false);
            setIn_Valid(false);
            setSuccess(true);

        }
    }

    return (
        <section>
            {!display ? (
                 <div className="Stevens-Background">
                    <Container fluid>
                    <div className="register2">
                    <Row className="row">
                        <Col className="col">
                            <div className='d-grid'>
                            <img alt="MakeEventHappen" src={require('../img/logo_transparent.png')} style={{height:"10rem",width:"10rem",marginLeft:"auto",marginRight:"auto"}}/>
                            <h1>Forgot Password</h1>
                            <span className='mb-3'>Don't worry, We are Here..!!</span>
                            <form  className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                                <label className="mb-3 text-decor" for="email">Email:</label>
                                <input  className="mb-3" id="email" type="email" {...register("email")} placeholder='username@stevens.edu' required />    
                                <div className='d-grid'>
                                    <Button  className="mb-3" variant="primary" size="md">
                                    SUBMIT
                                    </Button>
                                </div>
                            </form>
                            {error ? (<span id="exists">Invalid Credentials Entered</span>) : (validate ? (<span id="valid">Password reset email sent. Please check your inbox/spam/junk folder </span>) : (email ? (<span id="exists">Account hasn't been verified yet. Please check your inbox/spam/junk folder</span>) : ("")))}
                            <div className='d-grid'>
                                <Button as={Link} to="/signin" className="mb-3" variant="dark" size="md">
                                Back to Login!
                                </Button>
                            </div>
                           
                            {resend ? (
                                <button onClick={handleSubmit(onSubmit1)}>Request OTP Instead</button>) : ("")}

                            </div>
                            </Col>
                            </Row>
                    </div>
                    </Container>
                </div>) : (
                 <div className="Stevens-Background">
                 <Container fluid>
                 <div className="register2">
                 <Row className="row">
                     <Col className="col">
                         <div className='d-grid'>
                         <img alt="MakeEventHappen" src={require('../img/logo_transparent.png')} style={{height:"10rem",width:"10rem",marginLeft:"auto",marginRight:"auto"}}/>
                        
                        <h1>Enter OTP</h1>
                        <span>Please Enter the OTP received via email</span>
                        <form className='flex flex-col' onSubmit={handleSubmit1(onSubmit2)}>
                            <label className="mb-2" for="number">OTP</label>
                            <input className="mb-2" id="number" type="number"  {...register1("otp")} placeholder='Enter OTP' required />
                            <label className="mb-2" for="password">Password</label>
                            <input className="mb-2" id="password" type="password" {...register1("newPassword")} placeholder='new password' required />
                            <div className='d-grid'>
                                    <Button  className="mb-3" variant="primary" size="md">
                                    SUBMIT
                                    </Button>
                            </div>
                        </form>
                        {success ? (<span id="valid">Password has been reset successfully</span>) : (c_n_v ? (<span id="exists">OTP Expired Please Request Again</span>) : (in_valid ? (<span id="exists">Code Not Valid. Please Check </span>) : (r_n_f ? (<span id="exists">Password Reset Request Not Found</span>) : (""))))}
                        {success ? (
                             <div className='d-grid'>
                             <Button as={Link} to="/signin" className="mb-3" variant="dark" size="md">
                             Procced To Log In!
                             </Button>
                            </div>)
                            : ("")}
                    </div>
                   </Col>
                   </Row>
                </div>
                </Container>
                </div>

            )
            }
        </section>
    )
}




