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
const storage = firebase.storage();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
    })
    .catch((error) => {
        console.error("Error setting persistence:", error);
    });

//Send away forceful loggers
document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            // If no user is signed in, redirect to the home page
            window.location.href = "../home.html";
        } else {
            console.log("User is signed in:", user.uid);
            // Proceed with loading the special page content
        }
    });
});


function backClick(){
    const firstPage = document.getElementById('firstPage');
    const secondPage = document.getElementById('secondPage');
    const thirdPage = document.getElementById('thirdPage');
    const firstPageDisplay = window.getComputedStyle(firstPage).display;
    const secondPageDisplay = window.getComputedStyle(secondPage).display;
    const thirdPageDisplay = window.getComputedStyle(thirdPage).display;

    if  (firstPageDisplay==='flex'){
        window.location.href = '../home.html'
    }else if(secondPageDisplay==='flex'){
        secondPage.style.display ='none'
        firstPage.style.display = 'flex'
    }else if(thirdPageDisplay==='flex'){
        thirdPage.style.display ='none'
        secondPage.style.display = 'flex'
    }
}
function nextPage(){
     const firstPage = document.getElementById('firstPage');
     const secondPage = document.getElementById('secondPage');
     const thirdPage = document.getElementById('thirdPage');
     const lastPage = document.getElementById('lastPage');
     const firstPageDisplay = window.getComputedStyle(firstPage).display;
     const secondPageDisplay = window.getComputedStyle(secondPage).display;
     const thirdPageDisplay = window.getComputedStyle(thirdPage).display;
     const lastPageDisplay = window.getComputedStyle(lastPage).display;
     const creatorName = document.getElementById('creatorName').value
     const nameError = document.getElementById('name-error')
     
     if  (firstPageDisplay==='flex'){
         firstPage.style.display = 'none'
         secondPage.style.display= 'flex'
     }else if(secondPageDisplay==='flex'){
         if(creatorName.trim()===""){
            nameError.style.display = 'block'
         }else{
            secondPage.style.display ='none'
            thirdPage.style.display = 'flex'
            nameError.style.display = 'none'
         }
     }else if(thirdPageDisplay==='flex'){
         thirdPage.style.display ='none'
        lastPage.style.display = 'flex'
     }else{

     }
}

//Storing the Image Provided 
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const uploadStatus = document.getElementById('uploadStatus');



fileInput.addEventListener('change', (event) => {
    const creatorName = document.getElementById('creatorName').value //Get the creator name
    const file = event.target.files[0]; // Get the selected file

    if (file) {
        // Create a storage reference
        const storageRef = storage.ref('creatorProfiles/' + "Mix"); // Uploading to 'uploads/' folder in Firebase Storage

        // Start file upload
        const uploadTask = storageRef.put(file);

        // Show the progress bar
        uploadProgress.style.display = 'block';

        // Monitor the upload progress
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Get the progress of the upload (as a percentage)
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploadProgress.value = progress; // Update the progress bar value
                uploadStatus.innerText = `Upload is ${progress.toFixed(2)}% done`;
            },
            (error) => {
                // Handle upload errors
                console.error('Upload failed:', error);
                uploadStatus.innerText = 'Upload failed: ' + error.message;
            },
            () => {
                // Handle successful uploads
                uploadStatus.innerText = 'Upload complete!';
                uploadProgress.style.display = 'none'; // Hide the progress bar after completion
            }
        );
    }
});