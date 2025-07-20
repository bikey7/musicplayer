const songs = [
  {
    id: 'dusman',
    title: 'Dusman',
    artist: 'Durgesh Thapa',
    image: 'image/Dusman.jpg'
  },
  {
    id: 'sunday',
    title: 'Sunday',
    artist: 'Sudeep Magar',
    image: 'image/Sunday.jpg' 
  },
  {
    id: 'kamariya',
    title: 'Kamariya',
    artist: 'Kesari Lal Yadhav',
    image: 'image/kamariya.jpg' 
  }
];

// DOM Elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const albumArt = document.getElementById('album-art');
const playlistSongs = document.getElementById('playlist-songs');

// Player state
let currentSongIndex = 0;
let isPlaying = false;

// Initialize player
function init() {
    loadSong(currentSongIndex);
    createPlaylist();
}

// Load song
function loadSong(index) {
    const song = songs[index];
    
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumArt.src = song.image;
    audio.src = `music/${song.id}.mp3`;
    
    updateActivePlaylistItem();
}

// Create playlist
function createPlaylist() {
    playlistSongs.innerHTML = '';
    
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
            <div class="song-item-content">
                <div class="song-details">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <div class="playing-indicator" style="display: none;">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
            </div>
        `;
        
        songItem.addEventListener('click', () => {
            playSong(index);
        });
        
        playlistSongs.appendChild(songItem);
    });
}

// Update active playlist item
function updateActivePlaylistItem() {
    const songItems = document.querySelectorAll('.song-item');
    
    songItems.forEach((item, index) => {
        const indicator = item.querySelector('.playing-indicator');
        
        if (index === currentSongIndex) {
            item.classList.add('active');
            if (isPlaying) {
                indicator.style.display = 'flex';
            } else {
                indicator.style.display = 'none';
            }
        } else {
            item.classList.remove('active');
            indicator.style.display = 'none';
        }
    });
}

// Play song
function playSong(index = null) {
    if (index !== null) {
        currentSongIndex = index;
        loadSong(currentSongIndex);
    }
    
    audio.play();
    isPlaying = true;
    
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    albumArt.classList.add('playing');
    albumArt.classList.remove('paused');
    
    updateActivePlaylistItem();
}

// Pause song
function pauseSong() {
    audio.pause();
    isPlaying = false;
    
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    albumArt.classList.add('paused');
    albumArt.classList.remove('playing');
    
    updateActivePlaylistItem();
}

// Toggle play/pause
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Previous song
function prevSong() {
    currentSongIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    loadSong(currentSongIndex);
    if (isPlaying) {
        playSong();
    }
}

// Next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        playSong();
    }
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Update progress
function updateProgress() {
    const { duration, currentTime } = audio;
    
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        currentTimeEl.textContent = formatTime(currentTime);
        durationEl.textContent = formatTime(duration);
    }
}

// Set progress
function setProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
progressContainer.addEventListener('click', setProgress);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('play', () => {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    albumArt.classList.add('playing');
    albumArt.classList.remove('paused');
    updateActivePlaylistItem();
});

audio.addEventListener('pause', () => {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    albumArt.classList.add('paused');
    albumArt.classList.remove('playing');
    updateActivePlaylistItem();
});

// Initialize the player
init();