async function showSideNav(){
    const sideNav = document.getElementById('sideNav');
    const mainPage = document.getElementById('mainPage')
    sideNav.classList.toggle('active');
    mainPage.classList.toggle('side');
    await displayPlaylists();
}
document.addEventListener('click', function(event) {
    const sideNav = document.getElementById('sideNav');
    const menuBtn = document.getElementById('menuBtn');

    if (!sideNav.contains(event.target) && !menuBtn.contains(event.target)) {
        sideNav.classList.remove('active');
        mainPage.classList.remove('side');
    }
});
function showSearchScreen(){
    const searchBg = document.getElementById('searchBg');
    searchBg.classList.toggle('active');
    document.getElementById('searchInput').value ='';
    document.getElementById('results').innerHTML = '';
}


document.getElementById('searchInput').addEventListener('input', function(){
    let query = this.value.trim().toLowerCase();
    if(query===''){
        document.getElementById('results').innerHTML = '';
        return
    }
    searchMuse(query);
});
async function searchMuse(query) {
    const songRef = db.collection('songs');
    searchSkeleton();
    if (query === '') {
        document.getElementById('results').innerHTML = '';
        return;
    }

    try {
        const snapshot = await songRef
            .where('lowerCaseTitle', '>=', query)
            .where('lowerCaseTitle', '<=', query + '\uf8ff')
            .get();
        
        let result = '';

        if (snapshot.empty) {
            searchSkeleton();
            result += `<div><h2 class='resultTitle'>No results Found</h2></div>`;
        } else {
            const userPromises = snapshot.docs.map(async doc => {
                const song = doc.data();
                const songid = song.userId;
                const username = await getCreatorName(songid); 
                searchSkeleton();
                return `<div class='result-div' onclick='showSearchScreen(); musePlay(["${doc.id}"])'><h2 class='resultTitle'>${song.title}</h2><h4 class='resultCreator'>${username}</h4></div>`;
                
            });

            result = (await Promise.all(userPromises)).join('');
        }

        document.getElementById('results').innerHTML = result;
    } catch (error) {
        searchSkeleton();
        console.error('Error in searchMuse:', error);
    }
}


async function getCreatorName(userId){
    const userRef = db.collection('users').doc(userId);
    return userRef.get()
            .then(doc=>{
                if (doc.exists){
                    const userData = doc.data();
                    userName = userData.creatorName;
                    return userName;
                }else{
                    return ('Unknown');
                }
            })
            .catch(error=>{
                window.alert(error)
            })
}
function searchSkeleton(){
    const searchSkeleton = document.getElementById('search-skeleton');
    searchSkeleton.classList.toggle('active');
}

