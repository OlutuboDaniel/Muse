// Load Nav-bar and Account Bar
fetch('../components/account-bar.html')
    .then(response => response.text())
    .then(data=>{
        document.body.insertAdjacentHTML('afterbegin', data)
        
    })
fetch('../components/navbar.html')
    .then(response => response.text())
    .then(data=>{
        document.body.insertAdjacentHTML("afterbegin", data);
        loadUserProfile();
    })








const firebaseConfig = {
    apiKey: "AIzaSyBKjKypHC_QIk9_huVgrc00JhE44sjHw38",
    authDomain: "muse-fa247.firebaseapp.com",
    projectId: "muse-fa247",
    storageBucket: "muse-fa247.appspot.com",
    messagingSenderId: "77094058300",
    appId: "1:77094058300:web:c59cec4fbe15cc8036c639",
    measurementId: "G-KQZ3M70LGY"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        // Persistence set to LOCAL (default)
        // This means the user will stay logged in across sessions
    })
    .catch((error) => {
        console.error("Error setting persistence:", error);
    });


// Show Load Screen and Hide
function showLoadScreen(){
    const loadBg = document.getElementById('loading-bg');
    loadBg.style.visibility= 'visible';
}
function hideLoadScreen(){
    const loadBg = document.getElementById('loading-bg');
    loadBg.style.visibility= 'hidden';
}





    // Call the account bar
    function revealLogin(){
        const accountWindow = document.getElementById('accountWindow')
        accountWindow.classList.toggle('active');
    }
    document.addEventListener('click', function(event) {
        const accountBox = document.getElementById('accountWindow');
        const accountBtn = document.querySelector('.account-btn');
    
        if (!accountWindow.contains(event.target) && !accountBtn.contains(event.target)) {
            accountBox.classList.remove('active');
        }
    });

// Login the User

function login() {
    // Get user input
    showLoadScreen();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('login-error')
    // Sign in with Firebase Authentication
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Successful login and Page Reload
            console.log('User signed in:', userCredential.user);
            window.location.href = '../home.html';
        })
        .catch((error) => {
            console.error('Error signing in:', error);
            if (error.code === 'auth/user-not-found') {
                errorMessage.textContent = 'No user found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage.textContent = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage.textContent = 'Invalid email format.';
            }else if(error.code ==='auth/invalid-login-credentials'){
                errorMessage.textContent = 'Incorrect password and/or email'
            } else {
                errorMessage.textContent = 'An error occurred: ' + error.message;
            }
            errorMessage.style.display = 'block'
            hideLoadScreen();
        });
}

// To Load User Profile Picture
function loadUserProfile() {
    auth.onAuthStateChanged((user) => {
        const placeholder = document.querySelector('account-placeholder')
        const accountBtn = document.getElementById('account-btn')


        if (user) {
            // User is signed in
            const AnonWindow = document.getElementById('anon-window')
            const UserWindow = document.getElementById('user-window')
            const displayUsername = document.getElementById('displayUsername')
            const displayEmail = document.getElementById('displayEmail')
            const userEmail = auth.currentUser.email;
            const userId = user.uid;

            // Fetch the user's data from Firestore
            db.collection('users').doc(userId).get().then((doc) => {
                if (doc.exists) {
                    const username = doc.data().username;
                    // Display the first letter of the username
                    const firstLetter = username.charAt(0).toUpperCase();
                    displayUsername.innerText = username
                    displayEmail.innerText = userEmail
                    accountBtn.innerText = firstLetter;
                    accountBtn.classList.remove('loading-skeleton')
                    accountBtn.classList.add('logged')
                    AnonWindow.style.display ='none'
                    UserWindow.style.display ='flex'
                } else {
                    console.log("No such document!");
                    accountBtn.textContent = '?';
                }
            }).catch((error) => {
                console.error("Error getting document:", error);
                accountBtn.innerText = '?'; // Fallback on error
            });
        } else {
            // No user is signed in, show placeholder image
            accountBtn.innerHTML = '<img class="account-placeholder" src="static/images/account-placeholder.png" alt="">';
            accountBtn.classList.remove('loading-skeleton');
        }
    });
}


//Reveal and Show Passwords
function revealPassword(icon, password){
    fIcon = document.getElementById(icon)
    fPassword = document.getElementById(password)
    if (fPassword.type === 'password') {
        fPassword.type = 'text';
        fIcon.src ='static/svg/eye-slash-solid.svg'
    } else {
        fPassword.type = 'password';
        fIcon.src ='static/svg/eye-solid.svg'
    }
};  

function logout() {
    auth.signOut().then(() => {
        // Sign-out successful.
        console.log('User signed out');
        window.location.href = '../home.html';
    }).catch((error) => {
        // Handle Errors
        console.error('Error signing out:', error);
    });
}

//Function for Become a Creator Button
function creatorRegister(){
    window.location.href = "../register-creator.html";
}