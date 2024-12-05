import { config } from './content';
const defaultConfig = {
  invert: "100%",
  hueRotate: "180deg",
  brightness: "100%",
  contrast: "100%",
  saturate: "100%"
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSyncConfig') {
    chrome.storage.sync.get(["darkMode", "darkModeConfig"], (result) => {
      if (result.darkMode === 'enabled') {
        const config = result.darkModeConfig || defaultConfig;
        sendResponse(config);
      }
    });
    return true
  } else if (message.action === 'setSyncConfig') {
    chrome.storage.sync.set({ 'darkModeConfig': message.config });
  } else if (message.action === 'changeDarkMode') {
    chrome.storage.sync.set({ darkMode: message.message })
  }
})