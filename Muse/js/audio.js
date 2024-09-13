const audio = document.getElementById('audio');
const progressBar = document.getElementById('progressBar');
const bufferBar = document.getElementById('bufferBar');
const seekBar = document.getElementById('seekBar');
const songCover = document.getElementById('songCover');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const playButton = document.getElementById('playButton');
let currentSongId = '';

async function musePlay(identifier){
    const songRef = db.collection('songs');
    try{
        for(const docId of identifier){
            const docRef = songRef.doc(docId);

            const docSnapshot = await docRef.get();
            if (docSnapshot.exists){
                const data = docSnapshot.data();
                console.log(data.title);
                await loadPlayerInfo(data.title, data.userId, data.coverUrl, docId )
                audio.src = data.songUrl;
                audio.play();
                playButton.className = "fa-solid fa-pause fa-2xl"
            }else{
                console.log('it doesnt exist')
            }
        }
    } catch (error){
        console.error(error)
    }
}
async function homePlay(identifier){
    const songRef = db.collection('songs');
    try{
            const docRef = songRef.doc(identifier);

            const docSnapshot = await docRef.get();
            if (docSnapshot.exists){
                const data = docSnapshot.data();
                console.log(data.title);
                await loadPlayerInfo(data.title, data.userId, data.coverUrl, identifier )
                audio.src = data.songUrl;
                audio.play();
                playButton.className = "fa-solid fa-pause fa-2xl"
            }else{
                console.log('it doesnt exist')
            }
        
    } catch (error){
        console.error(error)
    }
}


async function loadPlayerInfo(titleSong, artistName, coverSong, songId){
    let realName = await getCreatorName(artistName)
    songTitle.innerHTML = titleSong;
    songArtist.innerHTML = realName;
    currentSongId = songId
    songArtist.onclick = function(){
        displayArtistPage(artistName);
    };
    songCover.src = coverSong;
}
playButton.addEventListener('click', function(){
    if(audio.paused){
        audio.play();
        playButton.className = "fa-solid fa-pause fa-2xl"
    }else{
        audio.pause();
        playButton.className = "fa-solid fa-play fa-2xl"
    }
});
audio.addEventListener('timeupdate', function(){
    if (audio.buffered.length > 0){
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const bufferPercent = (bufferedEnd / audio.duration) * 100;
        bufferBar.style.width = bufferPercent + '%';
    }
})
seekBar.addEventListener('input', function(){
    const seekTo = (seekBar.value/100)*audio.duration;
    audio.currentTime = seekTo;
})
audio.addEventListener('timeupdate', function() {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progressPercent + '%';
    seekBar.value = progressPercent; 
  });

// Artist Pages  
const pageArtistName = document.getElementById('pageArtistName');
const pageArtistAbout = document.getElementById('pageArtistAbout');
const pageArtistPic = document.getElementById('pageArtistPic')
const artistPage = document.getElementById('artistPage');

async function displayArtistPage(userId){
    artistPage.style.display = 'block';
    showArtistLoading();
    const userRef = db.collection('users').doc(userId);
    return userRef.get()
            .then(doc=>{
                if (doc.exists){
                    const userData = doc.data();
                    pageArtistName.innerText = userData.creatorName;
                    pageArtistAbout.innerText = userData.About;
                    pageArtistPic.src = userData.profilePictureURL;
                    renderDocumentsByUserId(userId);
                    hideArtistLoading();
                }else{
                    return ('Unknown');
                }
            })
            .catch(error=>{
                window.alert(error)
            })
}

async function getSongsByUserId(userId) {
    const songRef = db.collection('songs');  // Reference to the 'songs' collection
    const documentIds = [];  // Array to store the document IDs

    try {
        // Query the collection for documents with the specified userId
        const querySnapshot = await songRef.where('userId', '==', userId).get();
        
        // Check if any documents were found
        if (!querySnapshot.empty) {
            // Loop through the documents in the snapshot
            querySnapshot.forEach(doc => {
                // Push the document ID to the array
                documentIds.push(doc.id);
            });
        } else {
            console.log('No documents found with userId:', userId);
        }
    } catch (error) {
        console.error('Error getting documents:', error);
    }

    // Return the array of document IDs
    console.log(documentIds)
    return documentIds;
    
}
// Function to get documents by userId and render their data

let playlist = [];
let currentSongIndex = 0;
async function renderDocumentsByUserId(userId) {
    // Get document IDs by userId
    const documentIds = await getSongsByUserId(userId);

    // Parent div where all results will be appended
    const parentDiv = document.getElementById('pageArtistList');
    parentDiv.innerHTML = ''; // Clear previous results
    playlist= [];

    // Iterate through each document ID
    for (const docId of documentIds) {
        // Fetch the document data
        const docRef = db.collection('songs').doc(docId);
        try {
            const docSnapshot = await docRef.get();
            if (docSnapshot.exists) {
                const data = docSnapshot.data();
                const title = data.title;
                const userId = data.userId;
                playlist.push({title: data.title, songUrl:data.songUrl, userId: data.userId, coverUrl: data.coverUrl, docId: docId})

                // Create div for each document
                const docDiv = document.createElement('div');
                docDiv.classList.add('artist-list-songs'); // Add a class for styling

                // Create and style title element
                const titleElem = document.createElement('h2');
                titleElem.classList.add('documentTitle');
                titleElem.textContent = title;

                // Create and style userId element
                const userIdElem = document.createElement('h4');
                userIdElem.classList.add('documentUserId');
                realUserName = await getCreatorName(userId);
                userIdElem.textContent =  realUserName;
                

                // Append elements to the document div
                docDiv.appendChild(titleElem);
                docDiv.appendChild(userIdElem);

                // Append the document div to the parent div
                parentDiv.appendChild(docDiv);
                docDiv.addEventListener('click', () => {
                    currentSongIndex = playlist.length - 1; // Set the current song index
                    playSong(currentSongIndex);
                    loadPlayerInfo(title, data.userId, data.coverUrl, docId);
                });
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }
}

function showArtistLoading(){
    const artistSkeleton = document.getElementById('artistSkeleton');
    const artistLoaded = document.getElementById('artistLoaded');
    artistLoaded.style.display = 'none';
    artistSkeleton.style.display = 'flex';
};
function hideArtistLoading(){
    const artistSkeleton = document.getElementById('artistSkeleton');
    const artistLoaded = document.getElementById('artistLoaded');
    artistLoaded.style.display = 'flex';
    artistSkeleton.style.display = 'none';
};
function hideArtistPage(){
    artistPage.style.display= 'none';
}
function playSong(index) {
    if (index >= 0 && index < playlist.length) {
        const song = playlist[index];
        audio.src = song.songUrl;
        audio.play();
        loadPlayerInfo(song.title, song.userId, song.coverUrl, song.docId);
        // Automatically move to the next song when this one ends
        audio.onended = () => {
            nextSong();
        };
    }
}
function nextSong() {
    if (currentSongIndex < playlist.length - 1) {
        currentSongIndex++;
        playSong(currentSongIndex);
        playButton.className = "fa-solid fa-pause fa-2xl"
    } else {
        console.log("You've reached the end of the playlist.");
    }
}

function previousSong() {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        playSong(currentSongIndex);
        playButton.className = "fa-solid fa-pause fa-2xl"
    } else {
        console.log("You're at the start of the playlist.");
    }
}

const newPlaylistSubmit = document.getElementById('newPlaylistSubmit');
const newPlaylist = document.getElementById('newPlaylist');
// Add Songs to Playlist
function showPlaylistInputBar(){
    newPlaylist.style.visibility='visible'
    newPlaylistSubmit.style.visibility = 'visible'
}

function hidePlaylistInputBar(){
    newPlaylist.style.visibility='hidden'
    newPlaylistSubmit.style.visibility = 'hidden'
}
async function showPlaylistAdd(){
    addPlaylistBg = document.getElementById('addPlaylistBg');
    await displayPlaylists();
    addPlaylistBg.style.display = 'flex';
}
async function hidePlaylistAdd(){
    addPlaylistBg = document.getElementById('addPlaylistBg');
    addPlaylistBg.style.display = 'none';
    await displayPlaylists();  
}
async function saveNewPlaylist() {
    const inputValue = newPlaylist.value.trim();
    if (inputValue === '') {
        newPlaylist.value = '';
        return;
    }

    const user = firebase.auth().currentUser;
    const userId = user.uid;
    const docRef = db.collection('playlists').doc(inputValue);

    try {
        showLoadScreen();  // Show the loading screen before starting async work

        // Check if the document already exists
        const docSnapshot = await docRef.get();
        
        if (docSnapshot.exists) {
            window.alert('A playlist with that name already exists');
        } else {
            // Create a new playlist document
            await docRef.set({
                userId: userId,
                songs: []
            });
            console.log('Created successfully');
            
            await displayPlaylists();  
            hidePlaylistInputBar();  
        }
        
    } catch (error) {
        console.error('Error saving playlist:', error);
        displayError('Error saving playlist. Please try again.');
    } finally {
        hideLoadScreen();  
    }
}
const playlistPage = document.getElementById('playlistPage');
async function displayPlaylists() {
    const docRef = db.collection('playlists');
    const user = firebase.auth().currentUser;
    const userId = user.uid;
    

    try {
        const querySnapshot = await docRef.where('userId', '==', userId).get();
        if (querySnapshot.empty) {
            return;
        }

        const playlistList = document.getElementById('playlistList');
        const playlistDisplay = document.getElementById('playlistDisplay');
        playlistList.innerHTML = '';
        playlistDisplay.innerHTML='';

        // Use for...of instead of forEach to handle async/await properly
        for (const doc of querySnapshot.docs) {
            const docData = doc.data();
            const docId = doc.id;

            const docDiv = document.createElement('div');
            docDiv.onclick = function(){addSongToPlaylist(docId)};
            docDiv.classList.add('playlist-divs-home'); 
            docDiv.innerHTML = `<h3>${docId}</h3>`;
            const docDiv2 = document.createElement('div');
            docDiv2.classList.add('playlist-sidebar');
            docDiv2.onclick = function(){playlistPageDisplay(); displayPlaylistSongs(docId)}
            docDiv2.innerHTML = `<h4>${docId}</h4>`;
            playlistDisplay.appendChild(docDiv2);
            playlistList.appendChild(docDiv);
            
        }
    } catch (error) {
        console.error(error);
    }
}
function playlistPageDisplay(){
    playlistPage.style.display = 'flex';
    document.getElementById('songDisplay').style.display='none';
}

function addSongToPlaylist(docName){
    if(currentSongId===''){
        return;
    }
    const currentSong =currentSongId;
    showLoadScreen();
    const playlistRef =db.collection('playlists').doc(docName);
    playlistRef.update({
        songs:firebase.firestore.FieldValue.arrayUnion(currentSong)
    })
    .then(() => {
        hideLoadScreen();
    })
    .catch((error) => {
        console.error('Error updating playlist:', error);
        displayError('Error adding song to playlist. Please try again.');
    });
};

async function displayPlaylistSongs(playlistDocId){
    try{
        
        const playlistRef = db.collection('playlists').doc(playlistDocId);
        const playlistDoc = await playlistRef.get();
        if (playlistDoc.exists){
            const playlistData = playlistDoc.data();
            const songsArray = playlistData.songs;
            const playlistName = document.getElementById('playlistName');
            playlistName.innerText = playlistDocId;
            const pagePlaylist = document.getElementById('pagePlaylist')
            pagePlaylist.innerHTML=''
            currentSongIndex = 0;
            
            for(let songId of songsArray){
                const songDoc = await db.collection('songs').doc(songId).get();
                if(songDoc.exists){
                    const songData = songDoc.data();
                    const songTitle = songData.title;
                    const songUserId = songData.userId;
                    playlist.push({title: songData.title, songUrl:songData.songUrl, userId: songData.userId, coverUrl: songData.coverUrl, docId: songDoc.id})
                    const creatorName = await getCreatorName(songUserId);
                    const resultDiv = document.createElement('div');
                    resultDiv.addEventListener('click', () => {
                        homePlay(songId);
                        loadPlayerInfo(songTitle, songData.userId, songData.coverUrl, songDoc.id);
                        showSideNav();
                    });
                    currentSongIndex++;
                    resultDiv.classList = 'playlistSongList'
                    resultDiv.innerHTML=`
                        <div class="playlistSongList">
                            <h2>${songTitle}</h2>
                            <h4>${creatorName}</h4>
                            <i class="fa-solid fa-play" style="color: #000000;"></i>
                        </div>`;
                    pagePlaylist.appendChild(resultDiv);
                } else {
                console.error(`Playlist document with ID ${playlistDocId} does not exist!`);
                }
            }
            console.log(playlist);
            
        }
    }catch (error) {
        console.error('Error fetching playlist or songs:', error)}
}
function hidePlaylistPage(){
    playlistPage.style.display = 'none';
    document.getElementById('songDisplay').style.display='flex';
}


// Home Page Song Arrangement

document.addEventListener('DOMContentLoaded', () => {
    // Fetch songs with "Classical" genre
    fetchSongsByGenre('Classical').then(songs => {
        const songContainer = document.getElementById('classicalMusic');
        songs.forEach(song => {
            const songElement = createSongElement(song.id, song.data);
            songContainer.appendChild(songElement);
        });
    }).catch(error => {
        console.error("Error fetching songs by genre: ", error);
    });
    // Fetch songs with "Electronic" genre
    fetchSongsByGenre('Electronic').then(songs => {
        const songContainer = document.getElementById('electronicMusic');
        songs.forEach(song => {
            const songElement = createSongElement(song.id, song.data);
            songContainer.appendChild(songElement);
        });
    }).catch(error => {
        console.error("Error fetching songs by genre: ", error);
    });
    // Fetch Recent Songs
    fetchRecentSongs().then(songs => {
        const songContainer = document.getElementById('recentMusic');
        songs.forEach(song => {
            const songElement = createSongElement(song.id, song.data);
            songContainer.appendChild(songElement);
        });
    }).catch(error => {
        console.error("Error fetching recent songs: ", error);
    });
    
});

async function fetchSongsByGenre(genre) {
    try {
        const snapshot = await db.collection('songs').where('genres', 'array-contains', genre).get();
        const songs = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
        return songs;
    } catch (error) {
        console.error("Error fetching songs: ", error);
        throw error;
    }
}

function createSongElement(songId, songData) {
    const songElement = document.createElement('div');
    songElement.classList.add('song');
    songElement.onclick = () => homePlay(songId);

    songElement.innerHTML = `
        <img src="${songData.coverUrl}" alt="${songData.title}" class="cover">
        <h5>${songData.title}</h5>
        <h6>${songData.genres.join(', ')}</h6>
       
    `;

    return songElement;
}
async function fetchSongsByMood(mood) {
    try {
        const snapshot = await db.collection('songs').where('moods', 'array-contains', mood).get();
        const songs = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
        return songs;
    } catch (error) {
        console.error("Error fetching songs: ", error);
        throw error;
    }
}
async function fetchRecentSongs() {
    try {
        // Order by timestamp in descending order to get the most recent songs first
        const snapshot = await db.collection('songs').orderBy('timestamp', 'desc').limit(7).get();
        const songs = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
        return songs;
    } catch (error) {
        console.error("Error fetching recent songs: ", error);
        throw error;
    }
}



