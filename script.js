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