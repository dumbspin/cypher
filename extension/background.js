// Background Service Worker for Cypher

import { analyzeUrl } from './api.js';

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    try {
      const data = await analyzeUrl(tab.url);
      
      if (data.risk_score >= 30) {
        // Badge alerts
        const isPhishing = data.risk_score >= 60;
        chrome.action.setBadgeText({ text: isPhishing ? '!' : '?', tabId });
        chrome.action.setBadgeBackgroundColor({ color: isPhishing ? '#e53e3e' : '#dd6b20', tabId });
        
        // Show Browser Notification (Pop-up message)
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: isPhishing ? '🚨 Phishing Detected!' : '⚠️ Suspicious Site',
          message: `Cypher detected ${isPhishing ? 'malicious' : 'suspicious'} patterns at ${tab.url}. Proceed with caution.`,
          priority: 2
        });

        // Send message to content script for on-page UI
        chrome.tabs.sendMessage(tabId, {
          action: isPhishing ? 'SHOW_HARD_WARNING' : 'SHOW_SOFT_WARNING',
          data: data
        });
      } else {
        chrome.action.setBadgeText({ text: '', tabId });
      }
    } catch (error) {
      console.error("Background Scan Error:", error);
    }
  }
});
