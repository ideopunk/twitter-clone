import { db } from "../../config/fbConfig";

const deleteTweet = (e, userTweets, userID) => {
    const doomedTweet = e.target.getAttribute("value");
    const newList = userTweets.filter((tweet) => tweet !== doomedTweet);
    db.collection("users")
        .doc(userID)
        .update({ tweets: newList })
        .then(() => db.collection("tweets").doc(doomedTweet).delete())
        .then(() => console.log("deleted"));
};

export default deleteTweet;