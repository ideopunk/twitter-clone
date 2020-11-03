import { db } from "../../config/fbConfig";


const likeDB = (tweet, userID, userLikes) => {
    db.collection("tweets")
        .doc(tweet)
        .get()
        .then((snapshot) => {
            return snapshot.data().likes;
        })
        .then((likes) => {
            return [...likes || [], userID];
        })
        .then((newLikes) => db.collection("tweets").doc(tweet).update({ likes: newLikes }))
        .then(() => console.log(`added to tweet's likes`));

    const newList = [...userLikes, tweet];
    db.collection("users")
        .doc(userID)
        .update({ likes: newList })
        .then(() => console.log("added to user's likes"));
};

export default likeDB;