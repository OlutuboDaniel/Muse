auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, retrieve username
        const userId = user.uid;
        // Fetch username from Firestore
        db.collection("users").doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    console.log("Username:", doc.data().username);
                    // You can display the username on the page if needed
                    document.getElementById("usernameDisplay").innerText = `Welcome, ${doc.data().username}!`;
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } 
});
