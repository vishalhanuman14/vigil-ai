const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  startMonitoring: (goal) => ipcRenderer.invoke('start-monitoring', goal),
  sendVideoChunk: (chunk) => ipcRenderer.send('video-chunk', chunk),
  onUpdateActivity: (callback) => {
    const listener = (event, ...args) => callback(...args);
    ipcRenderer.on('update-activity', listener);
    return () => ipcRenderer.removeListener('update-activity', listener);
  },
  onUpdateAlert: (callback) => {
    const listener = (event, ...args) => callback(...args);
    ipcRenderer.on('update-alert', listener);
    return () => ipcRenderer.removeListener('update-alert', listener);
  },
});