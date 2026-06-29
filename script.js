let maxZIndex = 1000;

function getNextZIndex() {
  return ++maxZIndex;
}


function makeWindowDraggable(element) {
  let initialX = 0;
  let initialY = 0;
  let currentX = 0;
  let currentY = 0;
  let isDragging = false;
  
  const header = element.querySelector('.windowheader');
  
  if (header) {
    header.addEventListener('mousedown', function(e) {

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


function updateTime() {
  const now = new Date();
  const options = { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  const formattedTime = now.toLocaleString('en-US', options).replace(',', '');
  document.querySelector('.top-right').textContent = formattedTime;
}

document.addEventListener('DOMContentLoaded', function() {
  // Make all windows draggable
  const windows = document.querySelectorAll('.window');
  windows.forEach(win => {
    makeWindowDraggable(win);
  });

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
  
 
  setInterval(updateTime, 1000);
  updateTime();
});
async function fetchGitHubStats() {
    const repoUrl = 'https://api.github.com/repos/Dasher2801/HackOS';
    const commitsUrl = 'https://api.github.com/repos/Dasher2801/HackOS/commits';
    const statsContainer = document.getElementById('repo-stats');

    try {
    
        const repoResponse = await fetch(repoUrl);
        if (!repoResponse.ok) throw new Error('Repo nicht gefunden');
        const repoData = await repoResponse.json();

        
        const commitsResponse = await fetch(commitsUrl);
        const commitsData = await commitsResponse.json();
        
       
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
    
        statsContainer.innerHTML = `
            <div style="color: #ff3333;">❌ Fehler beim Laden der Live-Daten.</div>
            <div style="color: #aaaaaa; font-size: 0.85em;">Offline-Modus aktiv.</div>
        `;
    }
}


window.addEventListener('DOMContentLoaded', fetchGitHubStats);

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
  biggestIndex++;  
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
}

function handleWindowTap(element) {
  biggestIndex++;  
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
  deselectIcon(selectedIcon)
}

document.addEventListener('DOMContentLoaded', function() {
  const termInput = document.getElementById('terminal-input');
  const termHistory = document.getElementById('terminal-history');
  const cliWrapper = document.getElementById('terminal-cli-wrapper');
  const canvas = document.getElementById('matrix-canvas');
  const termContent = document.getElementById('terminal-content');

  if (!termInput || !termHistory || !canvas) return;

  let matrixInterval = null;

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

 function startMatrix() {
    cliWrapper.style.display = 'none';
    canvas.style.display = 'block';

    const ctx = canvas.getContext('2d');
  
    canvas.width = termContent.clientWidth;
    canvas.height = termContent.clientHeight;

    const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.random() * -20;
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff00'; 
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < rainDrops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];

        if (Math.random() > 0.98) {
          ctx.fillStyle = '#fff';
        } else {
          ctx.fillStyle = '#00ff00';
        }

        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        
        rainDrops[i]++;
      }
    } // HIER: Schließt die draw-Funktion sauber ab!

    // Startet das Intervall einmalig außerhalb der draw-Funktion
    matrixInterval = setInterval(draw, 33);
  } // HIER: Schließt die startMatrix-Funktion sauber ab!

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

function updateHackclockDisplay() {
  const clockDisplay = document.getElementById('clock-display');
  if (clockDisplay) {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockDisplay.textContent = `${hrs}:${mins}:${secs}`;
  }
}

setInterval(updateHackclockDisplay, 1000);
updateHackclockDisplay(); // Direkt einmal beim Start laden



let timerInterval = null;
let timerTimeLeft = 0;

function toggleTimer() {
  const startBtn = document.getElementById('timer-start-btn');
  const minInput = document.getElementById('timer-min');
  const secInput = document.getElementById('timer-sec');

  if (timerInterval) {

    clearInterval(timerInterval);
    timerInterval = null;
    if (startBtn) {
      startBtn.textContent = 'Start';
      startBtn.style.background = '#4CAF50';
    }
  } else {

    if (timerTimeLeft <= 0 && minInput && secInput) {
      const minutes = parseInt(minInput.value) || 0;
      const seconds = parseInt(secInput.value) || 0;
      timerTimeLeft = (minutes * 60) + seconds;
    }

    if (timerTimeLeft <= 0) return;

    if (minInput && secInput) {
      minInput.disabled = true;
      secInput.disabled = true;
    }

    if (startBtn) {
      startBtn.textContent = 'Pause';
      startBtn.style.background = '#ff9800';
    }

    updateTimerDisplay();

    timerInterval = setInterval(() => {
      timerTimeLeft--;
      updateTimerDisplay();

      if (timerTimeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        
        if (startBtn) {
          startBtn.textContent = 'Start';
          startBtn.style.background = '#4CAF50';
        }

        if (minInput && secInput) {
          minInput.disabled = false;
          minInput.disabled = false;
          minInput.value = '';
          secInput.value = '';
        }

        alert('⏰ Hackclock: Der Timer ist abgelaufen!');
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerTimeLeft = 0;

  const startBtn = document.getElementById('timer-start-btn');
  if (startBtn) {
    startBtn.textContent = 'Start';
    startBtn.style.background = '#4CAF50';
  }

  const minInput = document.getElementById('timer-min');
  const secInput = document.getElementById('timer-sec');
  if (minInput && secInput) {
    minInput.disabled = false;
    secInput.disabled = false;
    minInput.value = '';
    secInput.value = '';
  }

  const display = document.getElementById('timer-display');
  if (display) display.textContent = '00:00';
}

function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  if (display) {
    const m = String(Math.floor(timerTimeLeft / 60)).padStart(2, '0');
    const s = String(timerTimeLeft % 60).padStart(2, '0');
    display.textContent = `${m}:${s}`;
  }
}