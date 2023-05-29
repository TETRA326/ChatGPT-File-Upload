// Listen to the onInstalled event
browser.runtime.onInstalled.addListener(function(details) {
  // Inject the content script on installation or update
  if (details.reason === 'install' || details.reason === 'update') {
    browser.tabs.query({ url: 'https://chat.openai.com/*' }, function(tabs) {
      tabs.forEach(function(tab) {
        browser.tabs.executeScript(tab.id, { file: 'content.js', runAt: 'document_idle' });
      });
    });
  }
});

// Listen for messages from the popup
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'insertButton') {
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      browser.tabs.sendMessage(tabs[0].id, { action: 'insertButton' });
    });
  }
});
