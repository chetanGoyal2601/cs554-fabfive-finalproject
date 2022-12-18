import React from 'react'
import axios from 'axios';
// import '../css/User.css';

export default function Form() {
  async function blah(email){
    let data={}
    data.email=email
    const res = await axios.post('http://localhost:8000/user/userbyemail', data)
    console.log(res.data);
  }
blah('pgundam@stevens.edu')
  return (
    <section>
      <div className="register">
        <h1>blah</h1>
      </div>
    </section>
  )
}