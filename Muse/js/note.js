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

//Register

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


document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            // If no user is signed in, redirect to the home page
            window.location.href = "../home.html";
        } else {
            console.log("User is signed in:", user.uid);
            // Proceed with loading the special page content
            const userID = user.uid;
        }
    });
});
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
    })
    .catch((error) => {
        console.error("Error setting persistence:", error);
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
const user = firebase.auth().currentUser;


fileInput.addEventListener('change', (event) => {
    const creatorName = document.getElementById('creatorName').value //Get the creator name
    const file = event.target.files[0]; // Get the selected file
    const storageRef = firebase.storage().ref();
    const profilePicRef = storageRef.child(`profilePictures/${userID}.jpg`);

    if (file) {
        
        showLoadScreen();
        profilePicRef.put(file).then((snapshot) => {
            // Get the download URL after the upload completes
            return snapshot.ref.getDownloadURL();
        }).then((downloadURL) => {
            console.log('Profile picture uploaded. File available at:', downloadURL);
        
            // Now add this URL to the user's document in Firestore
            return db.collection('users').doc(userID).update({
                profilePictureURL: downloadURL
            });
        }).then(() => {
            console.log('Profile picture URL added to Firestore!');
            hideLoadScreen();
        }).catch((error) => {
            console.error('Error uploading profile picture:', error);
            hideLoadScreen();
        });
    }
});

<div class="upload-bg" style="display:none;" id="upload-bg">
        <div class="upload-box">
            <div class="cancel-div">
                <i onclick="closeUpload()" class="fa-solid fa-xmark" style="color: #e587dc;"></i>
            </div>
            <div class="upload-song-div">
                <label class="song-cover-label" for="song-cover">+ <br>Add Song Cover</label>
                <input id="song-cover" type="file" accept=".jpg, .png">
                <label class="upload-label" for="songTitle">Song Name</label>
                <input type="text" id="songTitle">
                <label class="upload-label" for="songYear">Release Year</label>
                <input type="number" id="songYear">
                <label class="upload-label">Genre</label>
                <div class="genre-selection">
                    <div class="genre" data-value="Rock">Rock</div>
                    <div class="genre" data-value="Jazz">Jazz</div>
                    <div class="genre" data-value="Blues">Blues</div>
                    <div class="genre" data-value="Pop">Pop</div>
                    <div class="genre" data-value="Rap">Rap</div>
                    <div class="genre" data-value="Country">Country</div>
                    <div class="genre" data-value="Artcore">Artcore</div>
                    <div class="genre" data-value="Classical">Classical</div>
                </div>
                <label class="upload-label">Mood</label>
                <div class="genre-selection">
                    <div class="mood" data-value="Relaxed">Relaxed</div>
                    <div class="mood" data-value="Energetic">Energetic</div>
                    <div class="mood" data-value="Happy">Happy</div>
                    <div class="mood" data-value="Melancholy">Melancholy</div>
                    <div class="mood" data-value="Calm">Calm</div>
                    <div class="mood" data-value="Party">Party</div>
                </div>
                <label class="upload-label" for="songFile">Upload Song</label>
                <input type="file" id="songFile" accept=".mp3, .wav, .flac">

                <div class="progress-container">
                    <div class="progress-bar" id="progress-bar"></div>
                </div>
                <button class="upload-btn" onclick="uploadSong()">Submit</button>
            </div>
        </div>
    </div>


    // Function to display search results with creator names
async function displayResults(results) {
    resultsContainer.innerHTML = ''; // Clear previous results
    
    for (const result of results) {
        // Fetch creator name for each result
        const creatorName = await getCreatorName(result.userId);
        
        // Create and style result elements
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        resultElement.innerHTML = `
            <div class="result-title">${result.title}</div>
            <div class="result-creator">${creatorName}</div>
        `;
        
        // Append result element to the container
        resultsContainer.appendChild(resultElement);
    }
}

async function saveNewPlaylist(){
    const inputValue = newPlaylist.value.trim();
    if (inputValue ===''){
        newPlaylist.value = '';
        return;
    }
    const user = firebase.auth().currentUser;
    
    const userId = user.uid
    const docRef = db.collection('playlists').doc(inputValue);
    docRef.get().then((docSnaphsot)=>{
        showLoadScreen();
        if (docSnaphsot.exists){
            window.alert('A playlist with that name already exists')
        }else{
            docRef.set({
                userId: userId,
                songs: []
            })
            .then(()=>{
                console.log('created successfully')
                hideLoadScreen();
                hidePlaylistInputBar();
            })
            .catch((error) => {
                hideLoadScreen()
                window.alert('Error creating document:', error);
                displayError('Error creating document. Please try again.');
            });
            
        }
        
    })
    .catch((error) => {
        console.error('Error checking document:', error);
        displayError('Error checking document. Please try again.');
    });await displayPlaylists();
}

fetchSongsByMood('Happy').then(songs => {
        songs.forEach(song => {
            const songElement = createSongElement(song.id, song.data);
            songContainer.appendChild(songElement);
        });
    }).catch(error => {
        console.error("Error fetching songs by mood: ", error);
    });