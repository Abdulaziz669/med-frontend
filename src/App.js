/* global gapi */
import React, { useEffect, useState } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import DoctorLogin from "./Pages/DoctorLogin";
import DoctorDashboard from "./Pages/DoctorDashboard";
import PaitentDashboard from "./Pages/PaitentDashboard";
import Error from "./Pages/Error";
import { AuthContext } from "./Auth/AuthContext";
import PhoneNumber from "./components/PhoneNumber";
import PersonalDetails from "./Doctor/PersonalDetails";
import SearchDoctor from "./Patient/SearchDoctor";
import PerviousAppointments from "./Patient/PerviousAppointments";
import Spinner from "react-bootstrap/Spinner";
import Selectdate from "./Patient/Selectdate";
import BookingSlots from "./Doctor/BookingSlots";
import Payment from "./Patient/Payment";
import DocAppointments from "./Doctor/PaymentHistory";
import AppointmentStatus from "./Patient/AppointmentStatus";
import Pfeedback from './Patient/Feedback';
import FeedbackDetails from './Doctor/FeedbackDetails';

function App() {
	const [token, setToken] = useState(window.localStorage.getItem("token"));
	const [googleId, setGoogleId] = useState(
		window.localStorage.getItem("googleId")
	);

	const [client, setClient] = useState(null)
	const [accessToken, setAccessToken] = useState("");

	const [apiLoaded, setApiLoaded] = useState(false);

	// To load only when gapi is loaded
	useEffect(() => {

		console.log(window.google, "google me");

			function initClient() {

				if (!window.google || apiLoaded){
					return
				}
				 
				setApiLoaded(true);
			const result = window.google.accounts.id.initialize({
						//apiKey: process.env.REACT_APP_API_KEY,
						client_id: process.env.REACT_APP_CLIENT_ID,
						discovery_docs: [process.env.REACT_APP_DISCOVERY_DOCS],
						ux_mode: 'popup',
						scope: process.env.REACT_APP_SCOPE,
						callback:(response) => {
							
							setToken(response.code)
						  setAccessToken(response);
						},
						
					})
					window.google.accounts.id.prompt();
					
					console.log(result, "result");
				setClient(result);
		} 

		const script = document.createElement("script")
		script.src = "https://accounts.google.com/gsi/client"
		script.onload = initClient
		script.async = true
		script.id = "google-client-script"
		document.querySelector("body")?.appendChild(script)

		return () => {
      // Cleanup function that runs when component unmounts
      window.google?.accounts.id.cancel()
      document.getElementById("google-client-script")?.remove()
    }
	
	}, []);

	return apiLoaded ? (
		<Router>
			<AuthContext.Provider value={{ token, setToken, googleId, setGoogleId, client, setClient, accessToken, setAccessToken}}>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/doctorlogin" component={DoctorLogin} />
					<Route exact path="/doctor" component={DoctorDashboard} />
					<Route exact path="/patient/searchdoctor" component={SearchDoctor} />
					<Route exact path="/patient" component={PaitentDashboard} />
					<Route exact path="/patient/update-phone" component={PhoneNumber} />
					<Route
						exact
						path="/patient/previousappointments"
						component={PerviousAppointments}
					/>
					<Route
						exact
						path="/doctor/perosnaldetails"
						component={PersonalDetails}
					/>
					<Route
						exact
						path="/doctor/payment-history"
						component={DocAppointments}
					/>
					<Route exact path="/doctor/feedback/:id" component={FeedbackDetails} />

					<Route exact path="/patient/selectdate" component={Selectdate} />
					<Route exact path="/patient/book-slot" component={BookingSlots} />
					<Route exact path="/patient/payment" component={Payment} />
					<Route exact path="/patient/appointment-status" component={AppointmentStatus} />
					<Route exact path="/patient/feedback/:id" component={Pfeedback} />

					<Route path="*">
						<Error />
					</Route>
				</Switch>
			</AuthContext.Provider>
		</Router>
	) : (
		<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
			<Spinner animation="border" variant="danger" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
		</div>
	);
}

export default App;
