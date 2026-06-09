// Feedback Modal System
// Shows feedback prompt after 30 minutes of gameplay

class FeedbackModal {
  constructor(delayMinutes = 30) {
    this.delayMinutes = delayMinutes;
    this.delayMs = delayMinutes * 60 * 1000; // Convert to milliseconds
    this.feedbackShown = false;
    this.init();
  }

  init() {
    // Create modal HTML
    this.createModal();
    
    // Set timeout to show feedback
    setTimeout(() => {
      this.showFeedback();
    }, this.delayMs);
  }

  createModal() {
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'feedback-modal';
    modal.className = 'feedback-modal hidden';
    modal.innerHTML = `
      <div class="feedback-container">
        <div class="feedback-header">
          <h2>How's Your Experience?</h2>
          <button class="close-feedback" aria-label="Close">&times;</button>
        </div>
        
        <div class="feedback-content">
          <p class="feedback-subtext">We'd love to hear your feedback after your gaming session!</p>
          
          <div class="feedback-group">
            <label>Game Experience Rating:</label>
            <div class="rating-stars">
              <button class="star" data-rating="1" title="Poor">⭐</button>
              <button class="star" data-rating="2" title="Fair">⭐</button>
              <button class="star" data-rating="3" title="Good">⭐</button>
              <button class="star" data-rating="4" title="Very Good">⭐</button>
              <button class="star" data-rating="5" title="Excellent">⭐</button>
            </div>
            <input type="hidden" id="rating-value" value="0">
          </div>

          <div class="feedback-group">
            <label for="feedback-text">Your Feedback (optional):</label>
            <textarea id="feedback-text" placeholder="Tell us what you liked, disliked, or any bugs you found..."></textarea>
          </div>

          <div class="feedback-group">
            <label for="feedback-email">Email (to follow up, optional):</label>
            <input type="email" id="feedback-email" placeholder="your@email.com">
          </div>

          <div class="feedback-actions">
            <button class="btn-submit">Submit Feedback</button>
            <button class="btn-skip">Skip</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listeners
    this.attachEventListeners();
  }

  attachEventListeners() {
    const modal = document.getElementById('feedback-modal');
    const closeBtn = modal.querySelector('.close-feedback');
    const skipBtn = modal.querySelector('.btn-skip');
    const submitBtn = modal.querySelector('.btn-submit');
    const stars = modal.querySelectorAll('.star');
    const ratingValue = document.getElementById('rating-value');

    // Close button
    closeBtn.addEventListener('click', () => this.closeFeedback());

    // Skip button
    skipBtn.addEventListener('click', () => this.closeFeedback());

    // Star rating
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = star.dataset.rating;
        ratingValue.value = rating;
        
        // Update star display
        stars.forEach((s, index) => {
          if (index < rating) {
            s.classList.add('selected');
          } else {
            s.classList.remove('selected');
          }
        });
      });
    });

    // Submit button
    submitBtn.addEventListener('click', () => this.submitFeedback());

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeFeedback();
      }
    });
  }

  showFeedback() {
    if (this.feedbackShown) return;
    
    const modal = document.getElementById('feedback-modal');
    modal.classList.remove('hidden');
    this.feedbackShown = true;
    
    // Add body overflow hidden to prevent scrolling
    document.body.style.overflow = 'hidden';
  }

  closeFeedback() {
    const modal = document.getElementById('feedback-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  submitFeedback() {
    const rating = document.getElementById('rating-value').value;
    const feedback = document.getElementById('feedback-text').value;
    const email = document.getElementById('feedback-email').value;

    // Create feedback object
    const feedbackData = {
      timestamp: new Date().toISOString(),
      rating: rating || 'Not rated',
      feedback: feedback || 'No comment',
      email: email || 'Anonymous'
    };

    // Log to console (for development)
    console.log('Feedback Submitted:', feedbackData);

    // Send to server (if you have a backend)
    this.sendFeedbackToServer(feedbackData);

    // Show success message
    this.showSuccessMessage();

    // Close modal after delay
    setTimeout(() => {
      this.closeFeedback();
    }, 2000);
  }

  sendFeedbackToServer(data) {
    // Uncomment and modify if you have a backend endpoint
    /*
    fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log('Feedback sent successfully:', data))
    .catch(error => console.error('Error sending feedback:', error));
    */

    // For now, just store in localStorage
    const allFeedback = JSON.parse(localStorage.getItem('gameFeedback') || '[]');
    allFeedback.push(data);
    localStorage.setItem('gameFeedback', JSON.stringify(allFeedback));
  }

  showSuccessMessage() {
    const modal = document.getElementById('feedback-modal');
    const content = modal.querySelector('.feedback-content');
    
    content.innerHTML = `
      <div class="success-message">
        <div class="success-icon">✓</div>
        <h3>Thank You!</h3>
        <p>Your feedback helps us improve!</p>
      </div>
    `;
  }
}

// Initialize feedback modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FeedbackModal(30); // 30 minutes delay
});