// Initialize Firebase services
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

// Function to check user authentication and creator status
function checkCreatorStatus() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            const userId = user.uid;
            db.collection('users').doc(userId).get().then((doc) => {
                if (doc.exists && doc.data().creatorStatus) {
                    loadCreatorProfile();
                } else {
                    window.location.href = '../home.html';
                }
            }).catch((error) => {
                console.error("Error getting document:", error);
                window.location.href = '../home.html';
            });
        } else {
            window.location.href = '../home.html';
        }
    });
}

// Function to load creator profile picture, name, and about
function loadCreatorProfile() {
    const largeProfileDiv = document.getElementById('largeProfile');
    const smallProfileDiv = document.getElementById('smallProfile');
    const creatorNameElement = document.getElementById('creatorNameH1');
    const creatorAboutElement = document.getElementById('creatorAboutH5');
    const skeleton = document.getElementById('skeletons');
    const userInfoDiv = document.getElementById('userInfoDiv');

    auth.onAuthStateChanged((user) => {
        if (user) {
            const userId = user.uid;
            db.collection('users').doc(userId).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const profilePictureURL = userData.profilePictureURL;
                    const creatorName = userData.creatorName;
                    const creatorAbout = userData.About;

                    if (profilePictureURL) {
                        largeProfileDiv.innerHTML = `<img src="${profilePictureURL}" alt="Profile Picture" class="profile-img">`;
                        smallProfileDiv.innerHTML = `<img src="${profilePictureURL}" alt="Profile Picture" class="profile-img">`;
                        largeProfileDiv.classList.remove('loading-skeleton');
                        smallProfileDiv.classList.remove('loading-skeleton');
                    }

                    creatorNameElement.textContent = creatorName;
                    creatorAboutElement.textContent = creatorAbout;
                    userInfoDiv.style.display = 'flex';
                    skeleton.style.display = 'none';
                }
            }).catch((error) => {
                console.error("Error loading profile:", error);
            });
        }
    });
}

// Display edit name section
function showEditName() {
    document.getElementById('edit-bg').style.display = 'flex';
    document.getElementById('editName').style.display = 'flex';
}

// Display edit about section
function showEditAbout() {
    document.getElementById('edit-bg').style.display = 'flex';
    document.getElementById('editAbout').style.display = 'flex';
}

// Display edit picture section
function showEditPicture() {
    document.getElementById('edit-bg').style.display = 'flex';
    document.getElementById('editPicture').style.display = 'flex';
}

// Close edit section
function closeEdit() {
    document.getElementById('edit-bg').style.display = 'none';
    document.getElementById('editName').style.display = 'none';
    document.getElementById('editAbout').style.display = 'none';
    document.getElementById('editPicture').style.display = 'none';
}

// Update creator name
function updateCreatorName() {
    const newName = document.getElementById('newName').value.trim();
    const nameWarning = document.getElementById('name-warning');
    
    if (newName === "") {
        nameWarning.style.display = 'block';
        return;
    }
    
    nameWarning.style.display = 'none';
    const userId = auth.currentUser.uid;
    
    db.collection('users').doc(userId).update({
        creatorName: newName
    }).then(() => {
        closeEdit();
        loadCreatorProfile();
    }).catch((error) => {
        console.error("Error updating name:", error);
    });
}

// Update creator about section
function updateCreatorAbout() {
    showLoadScreen();
    const newAbout = document.getElementById('newAbout').value.trim();
    const aboutWarning = document.getElementById('about-warning');

    if (newAbout === "") {
        aboutWarning.style.display = 'block';
        return;
    }

    aboutWarning.style.display = 'none';
    const userId = auth.currentUser.uid;

    db.collection('users').doc(userId).update({
        About: newAbout
    }).then(() => {
        closeEdit();
        hideLoadScreen();
        loadCreatorProfile();
    }).catch((error) => {
        console.error("Error updating about:", error);
        hideLoadScreen();
    });
}

// Handle profile picture upload
document.getElementById('profilePictureInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const pictureWarning = document.getElementById('picture-warning');

    if (file && file.size > 2 * 1024 * 1024) { // Check if file size exceeds 2MB
        pictureWarning.style.display = 'block';
        return;
    } else {
        pictureWarning.style.display = 'none';
    }
});

function updateCreatorPicture() {
    showLoadScreen();
    const file = document.getElementById('profilePictureInput').files[0];
    if (!file) return;

    const userId = auth.currentUser.uid;
    const storageRef = storage.ref().child(`profilePictures/${userId}`);
    
    storageRef.put(file).then(() => {
        return storageRef.getDownloadURL();
    }).then((url) => {
        return db.collection('users').doc(userId).update({
            profilePictureURL: url
        });
    }).then(() => {
        closeEdit();
        loadCreatorProfile();
        hideLoadScreen();
    }).catch((error) => {
        console.error("Error updating profile picture:", error);
    });
}

// Display song upload section
function showUploadSong() {
    document.getElementById('upload-bg').style.display = 'flex';
}

// Close song upload section
function closeUpload() {
    document.getElementById('upload-bg').style.display = 'none';
}
// Show Load Screen and Hide
function showLoadScreen(){
    const loadBg = document.getElementById('loading-bg');
    loadBg.style.visibility= 'visible';
}
function hideLoadScreen(){
    const loadBg = document.getElementById('loading-bg');
    loadBg.style.visibility= 'hidden';
}
// Variables to store selected genres and moods
let selectedGenre = [];
let selectedMood = [];

// Function to preview the selected song cover image
function previewImage(event) {
  const coverPreview = document.getElementById('cover-preview');
  coverPreview.src = URL.createObjectURL(event.target.files[0]);
  coverPreview.style.display = 'block';
}

// Function to handle song upload with progress and user ID tracking
function uploadSong() {
  showLoadScreen();
  const songTitle = document.getElementById('songTitle').value;
  const songYear = document.getElementById('songYear').value;
  const songCover = document.getElementById('song-cover').files[0];
  const songFile = document.getElementById('song-file').files[0];
  const userId = firebase.auth().currentUser.uid; // Get the current user ID
  
  // Validate the required fields
  if (!songTitle || !songYear || !songCover || !songFile) {
    hideLoadScreen();
    alert('Please fill in all required fields and upload both cover and song files.');
    return;
  }

  // Upload the song cover
  const storageRef = firebase.storage().ref();
  const coverRef = storageRef.child('covers/' + songCover.name);
  const uploadTask = coverRef.put(songCover);

  // Track the progress of the song cover upload
  uploadTask.on('state_changed', (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    document.getElementById('upload-progress').style.width = progress + '%';
  }, (error) => {
    console.error('Upload failed:', error);
    hideLoadScreen();
  }, () => {
    // Upload the song file once the cover upload is complete
    uploadTask.snapshot.ref.getDownloadURL().then((coverUrl) => {
      const songRef = storageRef.child('songs/' + songFile.name);
      const songUploadTask = songRef.put(songFile);

      // Track the progress of the song file upload
      songUploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById('upload-progress').style.width = progress + '%';
      }, (error) => {
        console.error('Song upload failed:', error);
      }, () => {
        songUploadTask.snapshot.ref.getDownloadURL().then((songUrl) => {
          // Save the song data to Firestore, including genres, moods, and user ID
          firebase.firestore().collection('songs').add({
            title: songTitle,
            lowerCaseTitle: songTitle.toLowerCase(),
            year: songYear,
            coverUrl: coverUrl,
            songUrl: songUrl,
            genres: selectedGenre,
            moods: selectedMood,
            userId: userId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            hideLoadScreen(); 
            alert('Song uploaded successfully!');
            location.reload();
            document.getElementById('upload-bg').style.display = 'none';
          }).catch((error) => {
            console.error('Error saving song data:', error);
            hideLoadScreen();
          });
        });
      });
    });
  });
}

// Event listeners for selecting genres and moods
document.querySelectorAll('.genre').forEach(option => {
  option.addEventListener('click', function() {
    let value = this.getAttribute('data-value');
    this.classList.toggle('selected');
    if (this.classList.contains('selected')) {
      if (!selectedGenre.includes(value)) {
        selectedGenre.push(value);
      }
    } else {
      selectedGenre = selectedGenre.filter(item => item !== value);
    }
    console.log('Selected Genre:', selectedGenre);
  });
});

document.querySelectorAll('.mood').forEach(option => {
  option.addEventListener('click', function() {
    let value = this.getAttribute('data-value');
    this.classList.toggle('selected');
    if (this.classList.contains('selected')) {
      if (!selectedMood.includes(value)) {
        selectedMood.push(value);
      }
    } else {
      selectedMood = selectedMood.filter(item => item !== value);
    }
    console.log('Selected Moods:', selectedMood);
  });
});




// Function to close the upload modal
function closeUpload() {
  document.getElementById('upload-bg').style.display = 'none';
}



// Call checkCreatorStatus to start the process when the page loads
checkCreatorStatus();
