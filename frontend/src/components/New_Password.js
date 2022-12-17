import React from 'react'
import bgImg from '../assets/img1.png';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from "react";
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
            <div className="register">
                <div className="col-1">
                    <h1>New Password</h1>
                    <span>Enter your New Password</span>
                    <form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                        <label for="password">Password</label>
                        <input id="password" type="password" {...register("newPassword")} placeholder='new password' required />

                        <button className='btn'>Sumbit</button>
                    </form>
                    {error ? (<span id="exists">Invalid password reset details passed</span>) : (validate ? (<span id="valid">Password has been reset successfully </span>) : (found ? (<span id="exists">Password reset link is invalid!! </span>) : ("")))}
                    <br></br>
                    <br></br>
                    <Link to="/signin">Proceed to Log In</Link>
                </div>
                <div className="col-2">
                    <img src={bgImg} alt="" />
                </div>
            </div>
        </section>
    )
}

