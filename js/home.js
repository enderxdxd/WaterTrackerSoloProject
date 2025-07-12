const HomeController = {
    init() {
      this.setupEventListeners();
    },
  
    setupEventListeners() {
      const addBtn = document.getElementById('add-btn');
      const quickBtns = document.querySelectorAll('.quick-btn');
  
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          this.addWater(250);
        });
      }
  
      quickBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const amount = parseInt(e.target.getAttribute('data-amount'));
          this.addWater(amount);
        });
      });
    },
  
    addWater(amount) {
      WaterTracker.addWater(amount);
      this.animateWaterAdd();
    },
  
    animateWaterAdd() {
      const addBtn = document.getElementById('add-btn');
      if (addBtn) {
        addBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          addBtn.style.transform = 'scale(1)';
        }, 150);
      }
  
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        progressBar.style.animation = 'none';
        setTimeout(() => {
          progressBar.style.animation = 'pulse 0.5s ease-in-out';
        }, 10);
      }
    },
  
    updateDisplay() {
      const stats = WaterTracker.getWeekStats();
      WaterTracker.updateUI();
    },
  
    onShow() {
      this.updateDisplay();
    }
  };
  
  const pulseKeyframes = `
    @keyframes pulse {
      0% { transform: scaleY(1); }
      50% { transform: scaleY(1.1); }
      100% { transform: scaleY(1); }
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);

// Initialize the HomeController once the page is fully loaded to ensure
// that all DOM elements are available and event listeners are attached.
window.addEventListener('load', () => {
  if (typeof HomeController !== 'undefined' && typeof HomeController.init === 'function') {
    HomeController.init();
  }
});