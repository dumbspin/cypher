import { analyzeUrl } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const currentUrlEl = document.getElementById('current-url');
  const loader = document.getElementById('loader');
  const resultContent = document.getElementById('result-content');
  
  const riskScoreEl = document.getElementById('risk-score');
  const riskDescEl = document.getElementById('risk-desc');
  const circleFill = document.getElementById('circle-fill');
  const badge = document.getElementById('classification-badge');
  
  const domainAge = document.getElementById('domain-age');
  const domainRegistrar = document.getElementById('domain-registrar');
  const isBlacklisted = document.getElementById('is-blacklisted');
  const scanId = document.getElementById('scan-id');
  
  const reasonsList = document.getElementById('reasons-list');
  
  const screenshotImg = document.getElementById('screenshot-img');
  const screenshotPlaceholder = document.getElementById('screenshot-placeholder');
  
  const manualInput = document.getElementById('manual-url');
  const scanBtn = document.getElementById('scan-btn');

  // Get current tab URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url) {
    currentUrlEl.textContent = tab.url;
    if (tab.url.startsWith('http')) {
      performScan(tab.url);
    } else {
      showError("Please scan a standard website.");
    }
  }

  scanBtn.addEventListener('click', () => {
    let url = manualInput.value.trim();
    if (url) {
      if (!url.startsWith('http')) url = 'https://' + url;
      currentUrlEl.textContent = url;
      performScan(url);
    }
  });

  async function performScan(url) {
    loader.classList.remove('hidden');
    resultContent.classList.add('hidden');
    badge.textContent = "Scanning...";
    badge.className = "badge";

    try {
      const data = await analyzeUrl(url);
      displayResult(data);
    } catch (error) {
      console.error(error);
      showError("Backend Error. Is it running?");
    }
  }

  function showError(msg) {
    loader.classList.add('hidden');
    resultContent.classList.add('hidden');
    badge.textContent = "Offline";
    badge.className = "badge badge-phishing";
    currentUrlEl.textContent = msg;
  }

  function displayResult(data) {
    loader.classList.add('hidden');
    resultContent.classList.remove('hidden');

    const score = Math.min(100, Math.max(0, data.risk_score || 0));
    riskScoreEl.textContent = score;
    
    // Animate circle
    circleFill.setAttribute('stroke-dasharray', `${score}, 100`);
    
    // Classifications
    badge.className = "badge";
    circleFill.className.baseVal = "circle";
    
    if (score < 30) {
      badge.textContent = "Verified Safe";
      badge.classList.add('badge-safe');
      riskDescEl.textContent = "Safe Content";
      riskDescEl.style.color = 'var(--color-success)';
      circleFill.classList.add('safe');
    } else if (score < 60) {
      badge.textContent = "Suspicious";
      badge.classList.add('badge-suspicious');
      riskDescEl.textContent = "Warning Needed";
      riskDescEl.style.color = 'var(--color-warning)';
      circleFill.classList.add('suspicious');
    } else {
      badge.textContent = "Phishing";
      badge.classList.add('badge-phishing');
      riskDescEl.textContent = "Malicious Site";
      riskDescEl.style.color = 'var(--color-danger)';
      circleFill.classList.add('danger');
    }

    // Technical Details
    domainAge.textContent = (data.domain_info && data.domain_info.age_days) ? `${data.domain_info.age_days} days` : 'N/A';
    domainRegistrar.textContent = (data.domain_info && data.domain_info.registrar) ? data.domain_info.registrar : 'N/A';
    isBlacklisted.textContent = data.blacklisted ? 'YES' : 'NO';
    scanId.textContent = data.scan_id ? data.scan_id.substring(0, 8) : '-';

    // Reasons
    reasonsList.innerHTML = '';
    if (data.reasons && data.reasons.length > 0) {
      data.reasons.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r.reason;
        reasonsList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.className = "empty-state";
      li.textContent = "No suspicious signals detected.";
      reasonsList.appendChild(li);
    }

    // Screenshot
    if (data.screenshot_url) {
      screenshotImg.classList.add('hidden');
      screenshotPlaceholder.classList.remove('hidden');
      screenshotPlaceholder.innerHTML = '<span class="pulse"></span><p>Drawing preview...</p>';
      
      screenshotImg.src = data.screenshot_url;
      screenshotImg.onload = () => {
        screenshotImg.classList.remove('hidden');
        screenshotPlaceholder.classList.add('hidden');
      };
      screenshotImg.onerror = () => {
        screenshotPlaceholder.classList.remove('hidden');
        screenshotPlaceholder.innerHTML = '<p>Preview unavailable</p>';
      };
    } else {
      screenshotPlaceholder.classList.remove('hidden');
      screenshotPlaceholder.innerHTML = '<p>Screenshot service disabled</p>';
    }
  }
});
