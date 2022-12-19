
const { createNewUser, authenticateUser } = require("./controller");
const {
  sendVerificationEmail,
} = require("./../email_verification/controller");
const user = require("./controller");

const express = require("express");
const router = express.Router();


router.post("/signup", async (req, res) => {
  try {
    let { name, email, password, dateOfBirth, gender } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();
    gender = gender.trim();
    console.log(name, email);
    const singupVlidation = (email)=>{
      // Define list of valid domains as an array
      let domain_list = ['stevens.edu'];
      let domain = email.substring(email.lastIndexOf("@") +1);
      // Check if the domain is present in the array of valid domains
      if (domain_list.includes(domain)) {
          return true;
      } else {
          return false;
      }
  }
  if(singupVlidation(email)===false){
    throw Error('Email should contain @stevens.edu');
  }
  let today = new Date();
    if (name == "" || email == "" || password == "" || dateOfBirth == "") {
      throw Error("Empty input fields!");
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
      throw Error("Invalid name entered");
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw Error("Invalid email entered");
    } 
    else if(new Date(dateOfBirth)>=today){
      throw Error("Date of Birth should be in the past");
    }
    else if (!new Date(dateOfBirth).getTime()) {
      throw Error("Invalid date of birth entered");
    } else if (password.length < 8) {
      throw Error("Password should be atleast 8 characters!");
    } else {
      console.log('before create');
      const newUser = await createNewUser({
        name,
        email,
        password,
        dateOfBirth,
        gender,
      });
      const emailData = await sendVerificationEmail(newUser);

      res.json({
        status: "PENDING",
        message: "Verification email sent",
        data: emailData,
      });
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});


router.post("/signin", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "")
      throw Error("Empty credentials supplied");

    const authUser = await authenticateUser(email, password);
    res.json({
      status: "SUCCESS",
      message: "Signin successful",
      user: authUser,
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});


router.get("/all", async (req, res) => {
  let userById = null;
  try {
    userById = await user.getAllUsers();
    res.json(userById);
  } catch (e) {
    res.json(e);
    return;
  }
});

router.post("/userbyemail", async (req, res) => {

  let userById = null;
  try {
    let { email } = req.body;
    userByEmail = await user.getUserByEmail(email);
    res.json(userByEmail);
  } catch (e) {
    res.json(e);
    return;
  }
});

module.exports = router;
