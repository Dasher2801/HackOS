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

// ===== TASCHENRECHNER FUNKTIONEN =====
let calculatorDisplay = '0';

function updateCalculatorDisplay() {
  const display = document.getElementById('calculator-display');
  if (display) {
    display.textContent = calculatorDisplay || '0';
  }
}

function calculatorAppend(value) {
  if (calculatorDisplay === '0' && value !== '.') {
    calculatorDisplay = value;
  } else if (value === '.' && calculatorDisplay.includes('.')) {
    return;
  } else {
    calculatorDisplay += value;
  }
  updateCalculatorDisplay();
}

function calculatorClear() {
  calculatorDisplay = '0';
  updateCalculatorDisplay();
}

function calculatorBackspace() {
  if (calculatorDisplay.length > 1) {
    calculatorDisplay = calculatorDisplay.slice(0, -1);
  } else {
    calculatorDisplay = '0';
  }
  updateCalculatorDisplay();
}

function calculatorEquals() {
  try {
    const result = eval(calculatorDisplay.replace('÷', '/').replace('×', '*').replace('−', '-'));
    calculatorDisplay = String(result);
    updateCalculatorDisplay();
  } catch (error) {
    calculatorDisplay = 'Fehler';
    updateCalculatorDisplay();
    setTimeout(() => {
      calculatorDisplay = '0';
      updateCalculatorDisplay();
    }, 1500);
  }
}
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

// ===== TERMINAL SIMULATOR LOGIK MIT MATRIX-REGEN =====
document.addEventListener('DOMContentLoaded', function() {
  const termInput = document.getElementById('terminal-input');
  const termHistory = document.getElementById('terminal-history');
  const cliWrapper = document.getElementById('terminal-cli-wrapper');
  const canvas = document.getElementById('matrix-canvas');
  const termContent = document.getElementById('terminal-content');

  if (!termInput || !termHistory || !canvas) return;

  let matrixInterval = null;

  // Reagiert auf Enter im Input-Feld
  termInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const commandLine = termInput.value.trim();
      if (commandLine === '') return;

      termHistory.innerHTML += `\n<span style="color: #88ff88;">hackos@user:~$</span> ${commandLine}`;
      processCommand(commandLine.toLowerCase());

      termInput.value = '';
      termHistory.scrollTop = termHistory.scrollHeight;
    }
  });

  // Klick auf das Canvas beendet die Matrix wieder
  canvas.addEventListener('click', stopMatrix);

  function processCommand(cmd) {
    const args = cmd.split(' ');
    const primaryCmd = args[0];

    switch(primaryCmd) {
      case 'help':
        termHistory.innerHTML += `\n\nVerfügbare Befehle:\n  help      - Zeigt diese Übersicht an\n  matrix    - Startet den digitalen Code-Regen\n  clear     - Leert den Terminal-Bildschirm\n  neofetch  - Zeigt System-Informationen\n  whoami    - Verrät dir, wer du bist`;
        break;
        
      case 'clear':
        termHistory.innerHTML = 'Bildschirm geleert. Tippe \'help\' für Befehle.';
        break;

      case 'matrix':
        startMatrix();
        break;
        
      case 'whoami':
        termHistory.innerHTML += `\nroot@hackos - Mastermind & System-Architekt.`;
        break;
        
      case 'neofetch':
        termHistory.innerHTML += `\n\n   /\\_/\\      root@hackos\n  ( o.o )     -----------\n   > ^ <      OS: HackOS v1.0\n              Shell: hack.term`;
        break;
        
      default:
        termHistory.innerHTML += `\n<span style="color: #ff3333;">Befehl nicht gefunden: '${primaryCmd}'.</span>`;
    }
  }

  // --- MATRIX ANIMATIONS LOGIK ---
  function startMatrix() {
    // 1. CLI Text ausblenden, Canvas einblenden
    cliWrapper.style.display = 'none';
    canvas.style.display = 'block';

    const ctx = canvas.getContext('2d');
    
    // Canvas-Größe exakt an das Terminal-Fenster anpassen
    canvas.width = termContent.clientWidth;
    canvas.height = termContent.clientHeight;

    // Zeichen-Set (Katakana + Zahlen + Lettern)
    const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Y-Koordinate für jeden Tropfen/Spalte initialisieren
    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.random() * -20; // Leicht versetzter Start oben
    }

    function draw() {
      // Leicht transparenter schwarzer Hintergrund sorgt für den coolen Schweif-Effekt
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff00'; // Matrix-Grün
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < rainDrops.length; i++) {
        // Zufälliges Zeichen auswählen
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Erstes Zeichen einer Spalte weiß leuchten lassen (wie im Film!)
        if (Math.random() > 0.98) {
          ctx.fillStyle = '#fff';
        } else {
          ctx.fillStyle = '#00ff00';
        }

        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
        
        // Wenn der Tropfen unten ankommt, mit einer Zufallschance zurück nach oben setzen
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        
        rainDrops[i]++;
      }
    }

    // Animation mit ca. 30 FPS starten
    matrixInterval = setInterval(draw, 33);
  }

  function stopMatrix() {
    if (matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
      
      // Canvas wieder verstecken, CLI einblenden
      canvas.style.display = 'none';
      cliWrapper.style.display = 'flex';
      
      // Kurze Info ausgeben und Input wieder fokussieren
      termHistory.innerHTML += `\nMatrix-Simulation beendet.`;
      termInput.focus();
      termHistory.scrollTop = termHistory.scrollHeight;
    }
  }
});
iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii