
const errorTag = document.getElementById('signup-error')
const email = document.getElementById('email').value;
function signup() {
    showLoadScreen();
    // Get the input values from your HTML form
    const email = document.getElementById('emailtext').value;
    const password = document.getElementById('pw-1').value;
    const username = document.getElementById('username').value;
    

    // Create a new user with Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            
            // Signed up successfully
            const user = userCredential.user;
            console.log(email)
            // Store additional user info in Firestore
            return db.collection('users').doc(user.uid).set({
                username: username,
                email: email,
                creatorStatus: false
            });
        })
        .then(() => {
            // Redirect or show a success message
            console.log('User signed up and data saved!');
            window.location.href = "../home.html";
        })
        .catch((error) => {
            // Handle errors here
            console.error('Error signing up:', error.message);
            errorTag.textContent = error.message;
            errorTag.style.display='block'
            // Show an error message in the UI
            hideLoadScreen();
        });
}

