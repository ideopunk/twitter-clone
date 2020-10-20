import React from "react";

const Tweet = () => {
	return (
		<div className="tweet">
			<img className="img-left" alt="user-profile" />
			<div>
				<p>
					<span className="tweeter-name"></span>
					<span className="tweeter-at"></span>
					<span className="tweet-time"></span>
                    <span className="tweet-options"></span>
				</p>
                <p className="tweet-reply">Replying to</p>
                <p className="tweet-text"></p>
                <div className="tweet-responses"></div>
			</div>
		</div>
	);
};

export default Tweet;
