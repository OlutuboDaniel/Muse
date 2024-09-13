const firebaseConfig = {
    apiKey: "AIzaSyBKjKypHC_QIk9_huVgrc00JhE44sjHw38",
    authDomain: "muse-fa247.firebaseapp.com",
    projectId: "muse-fa247",
    storageBucket: "muse-fa247.appspot.com",
    messagingSenderId: "77094058300",
    appId: "1:77094058300:web:c59cec4fbe15cc8036c639",
    measurementId: "G-KQZ3M70LGY"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(error => console.error("Error setting persistence:", error));

document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = "../home.html";
        } else {
            const userID = user.uid;
            setupProfilePictureUpload(userID);
        }
    });
});

function setupProfilePictureUpload(userID) {
    const MAX_FILE_SIZE_MB = 5; // Maximum file size in megabytes
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

    document.getElementById('fileInput').addEventListener('change', event => {
        const file = event.target.files[0];
        const creatorName = document.getElementById('creatorName').value.trim();

        if (file) {
            if (file.size > MAX_FILE_SIZE_BYTES) {
                alert(`File size exceeds ${MAX_FILE_SIZE_MB} MB. Please choose a smaller file.`);
                return; // Stop further processing
            }

            if (creatorName) {
                showLoadScreen();
                const profilePicRef = storage.ref(`profilePictures/${userID}.jpg`);
                
                profilePicRef.put(file).then(snapshot => snapshot.ref.getDownloadURL())
                .then(downloadURL => {
                    return db.collection('users').doc(userID).update({
                        profilePictureURL: downloadURL,
                        creatorStatus: true,
                        creatorName: creatorName
                    });
                })
                .then(() => {
                    console.log('Profile updated successfully!');
                    hideLoadScreen();
                    nextPage();
                })
                .catch(error => {
                    console.error('Error uploading profile picture:', error);
                    hideLoadScreen();
                });
            } else {
                alert('Please enter your creator name.');
            }
        }
    });
}


function showLoadScreen() {
    document.getElementById('loading-bg').style.visibility = 'visible';
}

function hideLoadScreen() {
    document.getElementById('loading-bg').style.visibility = 'hidden';
}

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
     const pageLinks = document.getElementById('pageLinks')
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
        pageLinks.style.display = 'none'
     }else{
        window.location.href=('../home.html')
     }
}
