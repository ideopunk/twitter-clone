import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from ".././context/userContext.js";

const MobileProfileLink = () => {
	const { userAt, userImage } = useContext(UserContext);

	return (
		<Link to={`/${userAt}`}>
			{userImage && (
				<img src={userImage} alt="user-profile" className="mobile-profile-image" />
			)}
		</Link>
	);
};

export default MobileProfileLink;
