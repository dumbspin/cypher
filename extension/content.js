// Content Script for Cypher Phishing Detection

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SHOW_HARD_WARNING') {
    showPhishingWarning(request.data, 'hard');
  } else if (request.action === 'SHOW_SOFT_WARNING') {
    showPhishingWarning(request.data, 'soft');
  }
});

function showPhishingWarning(data, type) {
  // Check if warning already exists
  if (document.getElementById('cypher-warning-banner')) return;

  const isHard = type === 'hard';
  const banner = document.createElement('div');
  banner.id = 'cypher-warning-banner';
  banner.className = isHard ? 'cypher-hard' : 'cypher-soft';
  
  banner.innerHTML = `
    <div class="cypher-content">
      <div class="cypher-icon">${isHard ? '🚨' : '⚠️'}</div>
      <div class="cypher-text">
        <strong>${isHard ? 'DANGER: Phishing Detected' : 'CAUTION: Suspicious Content'}</strong>
        <p>Cypher risk score: ${data.risk_score}. Proceed with extreme caution.</p>
      </div>
      <button id="cypher-close-btn">Dismiss</button>
    </div>
  `;
  document.body.prepend(banner);

  document.getElementById('cypher-close-btn').onclick = () => {
    banner.remove();
  };
}
