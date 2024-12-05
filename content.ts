import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const defaultConfig = {
  invert: "100%",
  hueRotate: "180deg",
  brightness: "100%",
  contrast: "100%",
  saturate: "100%"
};

const addDarkMode = (config: typeof defaultConfig) => {
  const styleId = 'dark-mode'
  let styleElement = document.getElementById(styleId) as HTMLElement

  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = styleId
    document.head.appendChild(styleElement)
  }

  styleElement.textContent = `
    :root {
      --invert: ${config.invert};
      --hue-rotate: ${config.hueRotate};
      --brightness: ${config.brightness};
      --contrast: ${config.contrast};
      --saturate: ${config.saturate};
    }
    html.dark-mode {
      -webkit-filter: invert(var(--invert)) hue-rotate(var(--hue-rotate)) brightness(var(--brightness)) contrast(var(--contrast)) saturate(var(--saturate));
      -webkit-transition: -webkit-filter 0.5s ease;
      filter: invert(var(--invert)) hue-rotate(var(--hue-rotate)) brightness(var(--brightness)) contrast(var(--contrast)) saturate(var(--saturate)) !important;
      transition: -webkit-filter 0.5s ease;
    }
    html.dark-mode img, video, embed, [style*='background'] {
      -webkit-filter: invert(var(--invert)) hue-rotate(var(--hue-rotate));
      filter: invert(var(--invert)) hue-rotate(var(--hue-rotate)) !important;
    }
  `
}

const resetMode = () => {
  const htmlElement = document.documentElement;

  if (htmlElement.classList.contains("dark-mode")) {
    htmlElement.classList.remove("dark-mode");
    chrome.runtime.sendMessage({ action: 'changeDarkMode', message: "disabled" });
  } else {
    chrome.runtime.sendMessage({ action: 'getSyncConfig' }, (response) => {
      const config = response.darkModeConfig || defaultConfig
      addDarkMode(config); // 应用样式
      htmlElement.classList.add("dark-mode");
    })
    chrome.runtime.sendMessage({ action: 'changeDarkMode', message: "enabled" });
    // chrome.storage.sync.get("darkModeConfig", (result) => {
    //   const config = result.darkModeConfig || defaultConfig;
    //   addDarkMode(config); // 应用样式
    //   htmlElement.classList.add("dark-mode");
    //   chrome.storage.sync.set({ darkMode: "enabled" });
    // });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'change') {
    const newConfig = message.config || defaultConfig;
    chrome.runtime.sendMessage({ action: 'darkModeConfig', config: newConfig }, response => {
      resetMode();
      sendResponse({ status: "Background color changed" });
    })
  }
})

document.addEventListener("DOMContentLoaded", () => {

});