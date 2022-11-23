import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import axios from "axios";

// import Jeff_Passport_Photo from ".../Backend/images";

function App() {
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", file);

    const result = await axios.post("http://localhost:3001/event", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // const hello = await axios.get("http://localhost:3001/event");

    // setImage(result.data.imagePath);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <form onSubmit={submit}>
          <input
            filename={file}
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            accept="image/*"
            alt="Jeff"
          ></input>
          <button type="submit">Submit</button>
        </form>
        <img
          alt="Jeff"
          src="http://localhost:3001/Jeff_Passport_Photo.jpg"
          // src={Jeff_Passport_Photo}
        />
      </header>
    </div>
  );
}

export default App;
