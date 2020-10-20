import React from "react";
import Tweet from "./Tweet";
import headshot from "../../assets/headshot.png"
const Feed = () => {
	return (
		<div>
			<Tweet
				image={headshot}
				name="Conor"
				at={"@ideopunk"}
				time="March 4"
				text="This is a tweet! Woo!"
				retweets={4}
				likes={4}
			/>
		</div>
	);
};

export default Feed;

// used in Home, Explore, Profile, and modified in Notifications.
