const Navigation = {
    currentPage: 'home',
    
    init() {
      this.setupNavigation();
      this.showPage('home');
    },
  
    setupNavigation() {
      const navBtns = document.querySelectorAll('.nav-btn');
      
      navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const page = e.target.getAttribute('data-page');
          this.showPage(page);
        });
      });
    },
  
    showPage(pageName) {
      const pages = document.querySelectorAll('.page');
      const navBtns = document.querySelectorAll('.nav-btn');
      
      pages.forEach(page => {
        page.classList.remove('active');
      });
      
      navBtns.forEach(btn => {
        btn.classList.remove('active');
      });
      
      const targetPage = document.getElementById(pageName);
      const targetBtn = document.querySelector(`[data-page="${pageName}"]`);
      
      if (targetPage) {
        targetPage.classList.add('active');
        this.currentPage = pageName;
      }
      
      if (targetBtn) {
        targetBtn.classList.add('active');
      }
      
      this.onPageChange(pageName);
    },
  
    onPageChange(pageName) {
      switch(pageName) {
        case 'home':
          if (typeof HomeController !== 'undefined') {
            HomeController.onShow();
          }
          break;
        case 'history':
          if (typeof HistoryController !== 'undefined') {
            HistoryController.onShow();
          }
          break;
        case 'settings':
          if (typeof SettingsController !== 'undefined') {
            SettingsController.onShow();
          }
          break;
      }
    }
  };
  
  window.addEventListener('load', () => {
    Navigation.init();
  });
  
  window.Navigation = Navigation;