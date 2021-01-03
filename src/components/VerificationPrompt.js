import React from "react";
import { auth } from "../config/fbConfig";
import { useHistory } from "react-router-dom";

const VerificationPrompt = ({ at }) => {
	let history = useHistory();

	const signOut = () => {
		auth.signOut().then(() => {
			console.log("user signed out");
		});
		history.push("/explore");
	};

	return (
		<div className="center">
			<div className="modal border pad" style={{ fontSize: "20px" }}>
				<p className="pad">
					Hi @{at}! You're almost there. We sent you a verification email when you signed
					up. After verifying, refresh the page.
				</p>
				<div className="flex">
					<button
						className="btn mrg"
						onClick={() => auth.currentUser.sendEmailVerification()}
					>
						Resend
					</button>
					<button className="btn mrg" onClick={signOut}>
						Sign out
					</button>
				</div>
			</div>
		</div>
	);
};

export default VerificationPrompt;
