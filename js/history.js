const HistoryController = {
    chart: null,
  
    init() {
      this.setupChart();
    },
  
    setupChart() {
      const chartCtx = document.getElementById('history-chart');
      if (!chartCtx) return;
  
      const ctx = chartCtx.getContext('2d');
      const labels = this.getLast7DaysLabels();
  
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Consumption (mL)',
            data: WaterTracker.historyData,
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { 
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                callback: function(value) {
                  return value + 'mL';
                }
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.parsed.y + ' mL';
                }
              }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          }
        }
      });
  
      WaterTracker.historyChart = this.chart;
    },
  
    updateChart() {
      if (this.chart) {
        this.chart.data.datasets[0].data = WaterTracker.historyData;
        this.chart.update('active');
      }
    },
  
    updateSummaryStats() {
      const stats = WaterTracker.getWeekStats();
      
      const weekTotal = document.getElementById('week-total');
      const weekAverage = document.getElementById('week-average');
      const weekBest = document.getElementById('week-best');
  
      if (weekTotal) weekTotal.textContent = stats.total + 'L';
      if (weekAverage) weekAverage.textContent = stats.average + 'mL';
      if (weekBest) weekBest.textContent = stats.best + 'mL';
    },
  
    getLast7DaysLabels() {
      const labels = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        if (i === 0) {
          labels.push('Today');
        } else if (i === 1) {
          labels.push('Yesterday');
        } else {
          labels.push(date.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit' 
          }));
        }
      }
      
      return labels;
    },
  
    onShow() {
      this.updateChart();
      this.updateSummaryStats();
    }
  };
  
  window.updateChart = function() {
    if (HistoryController.chart) {
      HistoryController.updateChart();
    }
  };
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      HistoryController.init();
    }, 100);
  });
  
  window.HistoryController = HistoryController;