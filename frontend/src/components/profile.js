import React from 'react'
import bgImg from '../assets/img1.png';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function Form() {

  const { register, handleSubmit, formState: { errors } } = useForm()
  const onSubmit = data => console.log(data);

  return (
    <section>
      <div className="register">
        <h1>user profile</h1>
      </div>
    </section>
  )
}