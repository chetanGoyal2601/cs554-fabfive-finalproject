import React from 'react'
import bgImg from '../assets/img1.png';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <section>
            <div className="register">
                <div className="col-1">
                    <h1>SIGN IN</h1>
                    <span>Log In and Enjoy the Services</span>
                    <form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                        <label for="email">Email</label>
                        <input id="email" type="email" {...register("email")} placeholder='username@stevens.edu' />
                        <label for="password">Password</label>
                        <input id="password" type="password" {...register("password")} placeholder='password' />
                        {/* <input type="text" {...register("mobile")}  placeholder='' /> */}
                        <button className='btn'>Sign In</button>
                    </form>
                    {error ? (<span id="exists">Invalid Credentials Entered</span>) : (validate ? (<span id="exists">Email hasn't been verified yet. Check your inbox </span>) : (response ? (<span id="valid">Verification mail resent ! </span>) : ("")))}
                    <br></br>
                    <br></br>
                    {mail ? (
                        <button onClick={handleSubmit(onSubmit4)}>Resend Verification Mail</button>) : ("")}
                    <br>
                    </br>
                    <br></br>
                    <Link to="/forgot_password">Forgot Password</Link>
                    <br></br>
                    <br></br>
                    <Link to="/signup">Not a Member, Sign Up</Link>
                </div>
                <div className="col-2">
                    <img src={bgImg} alt="" />
                </div>
            </div>
        </section>
    )
}


