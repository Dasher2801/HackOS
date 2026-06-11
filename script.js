let maxZIndex = 1000;

function getNextZIndex() {
  return ++maxZIndex;
}

// Make a window draggable
function makeWindowDraggable(element) {
  let initialX = 0;
  let initialY = 0;
  let currentX = 0;
  let currentY = 0;
  let isDragging = false;
  
  const header = element.querySelector('.windowheader');
  
  if (header) {
    header.addEventListener('mousedown', function(e) {
      // Don't drag if clicking on the close button
      if (e.target.classList.contains('closebutton') || e.target.closest('.closebutton')) {
        return;
      }
      
      isDragging = true;
      e.preventDefault();
      
      initialX = e.clientX;
      initialY = e.clientY;
      
      element.style.zIndex = getNextZIndex();
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }
  
  const onMouseMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    
    element.style.top = (element.offsetTop - currentY) + 'px';
    element.style.left = (element.offsetLeft - currentX) + 'px';
  };
  
  const onMouseUp = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
}

// Update time continuously
function updateTime() {
  const now = new Date();
  const options = { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  const formattedTime = now.toLocaleString('en-US', options).replace(',', '');
  document.querySelector('.top-right').textContent = formattedTime;
}

// Initialize all windows as draggable
document.addEventListener('DOMContentLoaded', function() {
  // Make all windows draggable
  const windows = document.querySelectorAll('.window');
  windows.forEach(win => {
    makeWindowDraggable(win);
  });
  
  // Setup close buttons
  const closeButtons = document.querySelectorAll('.closebutton');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const windowId = this.dataset.windowid;
      if (windowId) {
        const window = document.getElementById(windowId);
        if (window) {
          window.style.display = 'none';
        }
      }
    });
  });
  
  // Setup taskbar buttons
  const taskbarApps = document.querySelectorAll('.taskbar-app');
  taskbarApps.forEach(btn => {
    btn.addEventListener('click', function() {
      const appId = this.dataset.app;
      if (appId) {
        const window = document.getElementById(appId);
        if (window) {
          if (window.style.display === 'none' || !window.style.display) {
            window.style.display = 'flex';
            window.style.zIndex = getNextZIndex();
          } else {
            window.style.display = 'none';
          }
        }
      }
    });
  });
  
  // Setup HackOS button
  const hackosBut = document.getElementById('welcomeopen');
  if (hackosBut) {
    hackosBut.addEventListener('click', function() {
      const window = document.getElementById('welcome');
      if (window) {
        if (window.style.display === 'none' || !window.style.display) {
          window.style.display = 'flex';
          window.style.zIndex = getNextZIndex();
        } else {
          window.style.display = 'none';
        }
      }
    });
  }
  
  // Start time updates
  setInterval(updateTime, 1000);
  updateTime();
});
async function fetchGitHubStats() {
    const repoUrl = 'https://api.github.com/repos/Dasher2801/HackOS';
    const commitsUrl = 'https://api.github.com/repos/Dasher2801/HackOS/commits';
    const statsContainer = document.getElementById('repo-stats');

    try {
        // 1. Allgemeine Infos zum Repository abrufen
        const repoResponse = await fetch(repoUrl);
        if (!repoResponse.ok) throw new Error('Repo nicht gefunden');
        const repoData = await repoResponse.json();

        // 2. Den neuesten Commit abrufen
        const commitsResponse = await fetch(commitsUrl);
        const commitsData = await commitsResponse.json();
        
        // Daten extrahieren
        const repoName = repoData.name;
        const language = repoData.language || 'JavaScript';
        const stars = repoData.stargazers_count;
        
        const latestCommitMessage = commitsData[0]?.commit?.message || 'Kein Commit gefunden';
        const commitDate = new Date(commitsData[0]?.commit?.committer?.date).toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // 3. HTML mit den echten Daten füllen
        statsContainer.innerHTML = `
            <div style="color: #00ff00; margin-bottom: 6px;"><strong>📁 Workspace:</strong> ~/${repoName}</div>
            <div style="color: #00ff00; margin-bottom: 6px;"><strong>🟢 Status:</strong> Active (GitHub Sync OK)</div>
            <div style="color: #00ff00; margin-bottom: 6px;"><strong>🔧 Sprache:</strong> ${language}</div>
            <div style="color: #00ff00; margin-bottom: 6px;"><strong>⭐ Stars:</strong> ${stars}</div>
            <div style="color: #88ff88; margin-top: 10px; border-top: 1px dashed rgba(0,255,0,0.2); padding-top: 8px;">
                <strong>💻 Letzter Commit:</strong> "${latestCommitMessage}"
                <br><span style="font-size: 0.85em; color: #66cc66;">Am: ${commitDate}</span>
            </div>
        `;

    } catch (error) {
        // Fehleranzeige, falls das Internet weg ist oder die API blockiert
        statsContainer.innerHTML = `
            <div style="color: #ff3333;">❌ Fehler beim Laden der Live-Daten.</div>
            <div style="color: #aaaaaa; font-size: 0.85em;">Offline-Modus aktiv.</div>
        `;
    }
}

// Führt die Funktion automatisch aus, sobald die Webseite geladen ist
window.addEventListener('DOMContentLoaded', fetchGitHubStats);
function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () =>
    handleWindowTap(element)
  )
}
var topBar = document.querySelector("#top")

function openWindow(element) {
  element.style.display = "flex";
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
}

function handleWindowTap(element) {
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
  deselectIcon(selectedIcon)
}