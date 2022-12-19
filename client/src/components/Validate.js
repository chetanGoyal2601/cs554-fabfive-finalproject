import React from 'react'
import bgImg from '../img/img1.png';
import { useForm } from 'react-hook-form';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// import '../css/User.css';

export default function Form() {
    const [started, setStarted] = useState(true);
    const [validate, setValidate] = useState(false);
    const [validate1, setValidate1] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = async data => {
        try{
         setStarted(true);
        const res = await axios.post('https://python-selenium-validate.herokuapp.com/', data)
        setStarted(false);
        let stringArray = res.data.split(/(\s+)/);
        if (stringArray[0] === "Welcome") {
            setValidate(true);
            setMessage(res.data);
            setValidate1(false)
            //setTimeout(6000);
            //navigate('/signup');
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


    return (
        <section>
            <div className="register">
                <div className="col-1">
                    <h1>Please Validate Your Relationship with Steven's Institute Of Technology</h1>
                    <br></br>
                    <br></br>
                    <span>Note: If your email is apala1@stevens.edu, please enter only apala1</span>

                    <form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                        <label for="fullname">Enter your Steven's Username</label>
                        <input id="fullname" type="text" {...register("username")} placeholder='username' required />
                        {/* <input type="text" {...register("mobile")}  placeholder='' /> */}
                        <button className='btn'>Validate</button>
                    </form>
                    {validate ? (<span id="valid">{message}</span>) : (validate1 ? (<span id="exists">{message}</span>): (""))}
                    <br></br>
                    <br></br>
                </div>
                
                <div className="col-2">
                    <img src={bgImg} alt="" />
                </div>
            </div>
        </section>
    )
}