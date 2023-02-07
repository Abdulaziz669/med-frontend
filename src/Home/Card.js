import { Button } from 'react-bootstrap';
import React, { useContext } from 'react';
// import GoogleLogin from 'react-google-login';
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from '../Auth/AuthContext';
import axios from 'axios';

const Card = ({ login = "Doctor", Image, link }) => {
  const { token, googleId, setToken, setGoogleId, client, accessToken } = useContext(AuthContext);
  const history = useHistory();

  async function loginWithGoogle(e) {
    

    console.log(client, "respost", );

    try {

      client.requestAccessToken()

      console.log(accessToken.code, client, "client-code");

      client.callback = async (tokenResponse) =>{
        console.log(tokenResponse, "callback");
        
        
      console.log("Waiting");
      
      console.log("[Google] Signed in successfully!");
      window.localStorage.setItem("token", tokenResponse.access_token);
      window.localStorage.setItem("googleId", tokenResponse.access_token);

      const serverRes = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/patients/google-login/`,
        {
          tokenId: tokenResponse.access_token,
        }
      );

      if (serverRes) {
        console.log(serverRes.data.phoneNumberExists);

        setToken(tokenResponse.access_token);
        setGoogleId(tokenResponse.access_token);

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

  return (
    <div className="card mb-3" style={{ width: "18rem" }}>
      <img src={Image} className="card-img-top" alt="..." height="240" />
      <div className="card-body">
        {((!token || googleId) && login === "Doctor") && <Link to={link} className="btn btn-primary justify-content-center w-100">Login As A Doctor</Link>}
        {((token && !googleId) && login === "Doctor") && <Link to={link} className="btn btn-primary justify-content-center w-100">My Dashboard</Link>}
        {((!googleId && login === "Patient") && <Button onClick={loginWithGoogle} disabled={false} className="btn btn-primary justify-content-center w-100">Login As A Patient</Button>)}
        {((token && googleId) && login === "Patient") && <Link to={link} className="btn btn-primary justify-content-center w-100">My Dashboard</Link>}
      </div>
    </div>
  )
}

export default Card;