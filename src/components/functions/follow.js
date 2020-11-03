import { db } from "../../config/fbConfig";

const follow = (followID, userID, userFollows) => {
    // const account = e.target.getAttribute("value");

    db.collection("users")
        .doc(followID)
        .get()
        .then((snapshot) => {
            return snapshot.data().followers;
        })
        .then((followers) => {
            return [...(followers || []), userID];
        })
        .then((newFollowers) => {
            console.log(newFollowers);
            db.collection("users").doc(followID).update({ followers: newFollowers });
        })
        .then(() => console.log("added to followers list"));

    const newList = [...userFollows, followID];

    db.collection("users")
        .doc(userID)
        .update({ follows: newList })
        .then(() => console.log("added to follows list"));
};

export default follow;