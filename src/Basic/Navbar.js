import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../image/navbaricon1.png";
import { AuthContext } from "../Auth/AuthContext";
import axios from "axios";
// import GoogleLogin from "react-google-login";
// import axios from "axios";

const Navbar = () => {
  const { token, setToken, setGoogleId, client, googleInstance } = useContext(AuthContext);
  const history = useHistory();

  async function loginWithGoogle(e) {
    

    try {

      googleInstance.accounts.id.prompt();

      client.callback = async (tokenResponse) =>{
        console.log(tokenResponse, "callback");
        
      
      console.log("[Google] Signed in successfully!");
      window.localStorage.setItem("token", tokenResponse.credential);
      window.localStorage.setItem("googleId", tokenResponse.credential);

      const serverRes = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/patients/google-login/`,
        {
          tokenId: tokenResponse.credential,
        }
      );

      if (serverRes) {
        console.log(serverRes.data.phoneNumberExists);

        setToken(tokenResponse.credential);
        setGoogleId(tokenResponse.credential);

        if (serverRes.data.phoneNumberExists === true) {
          history.push("/patient");
        } else {
          history.push("/patient/update-phone");
        }
    }
      }

    } catch (err) {
      console.log(`[Google] Some error occurred while signing in! ${JSON.stringify(err)}`);
    }
  }

  function signOutGoogle() {
    // Different logic for doctor and patient
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("googleId");
        setToken(null);
        setGoogleId(null);
        history.push("/");
  }

  return (
    <nav
      className="navbar navbar-dark bg-dark navbar-expand-lg pl-4 pr-4 w-100 "
      style={{ backgroundColor: " #1a1a1a" }}
    >
      <Link to="/" className="navbar-brand">
        <img
          src={logo}
          alt=""
          width="30"
          height="24"
          className="d-inline-block align-top mr-2 mt-1"
        ></img>
        Hospital Management System
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#collapsibleNavbar"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse " id="collapsibleNavbar">
        <ul className="navbar-nav ml-auto text-light bg-dark">
          <li className="navbar-item" style={{ textAlign: "right" }}>
            <link to="/" className="nav-link " style={{ padding: 0 }} />
            {!token && (
              <button
                onClick={loginWithGoogle}
                className="btn btn-outline-primary"
              >
                Login As A Patient
              </button>
            )}
            {token && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={signOutGoogle}
              >
                Logout
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
