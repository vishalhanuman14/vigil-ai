// electron/main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = !app.isPackaged;
const { generateMonitoringContext, decideOnAlert } = require('./backend/ai_handler');

// --- CHANGE 1: Import the new python_service and remove the old video_processor ---
const { startPythonService, analyzeVideo } = require('./backend/python_service');
// const { analyzeVideo } = require('./backend/video_processor'); // <-- removed

const userDataPath = app.getPath('userData');
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath);
}
const contextFilePath = path.join(userDataPath, 'monitoring_context.txt');
const tempVideoPath = path.join(userDataPath, 'temp_clip.mp4');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.maximize();
  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

// --- CHANGE 2: Start the Python service when the Electron app is ready ---
app.whenReady().then(() => {
  startPythonService();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('start-monitoring', async (event, userGoal) => {
  try {
    console.log('Received user goal:', userGoal);
    const contextList = await generateMonitoringContext(userGoal);
    fs.writeFileSync(contextFilePath, contextList);
    console.log('Monitoring context saved.');
    return { success: true, message: 'Context generated successfully.' };
  } catch (error) {
    console.error('Failed to start monitoring:', error);
    return { success: false, message: error.message };
  }
});

ipcMain.on('video-chunk', async (event, videoArrayBuffer) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  try {
    console.log('\n--- [Monitoring Cycle Start] ---');

    const videoBuffer = Buffer.from(videoArrayBuffer);
    fs.writeFileSync(tempVideoPath, videoBuffer);
    console.log(`[INFO] Video chunk saved to ${tempVideoPath}`);

    console.log('[INFO] Sending path to Python service for analysis...');
    const rawPythonOutput = await analyzeVideo(tempVideoPath);
    console.log(`[INFO] Activities received from Python service: "${rawPythonOutput}"`);

    // --- LOGIC FOR IMMEDIATE ACTIVITY UPDATE ---
    let topActivity = null;
    if (rawPythonOutput && rawPythonOutput.startsWith('[') && rawPythonOutput.endsWith(']')) {
      try {
        const activitiesString = rawPythonOutput.slice(1, -1);
        const allActivities = activitiesString.split(',');
        if (allActivities.length > 0 && allActivities[0].trim()) {
          topActivity = allActivities[0].trim().slice(1, -1);
        }
      } catch (e) {
        console.error('[ERROR] Failed to parse python output.', e);
      }
    }

    // >> STEP 1: IMMEDIATELY send the activity update to the frontend.
    if (topActivity) {
      console.log(`[INFO] Sending immediate activity update: "${topActivity}"`);
      window.webContents.send('update-activity', topActivity);
    }

    // >> STEP 2: NOW, perform the slower Gemini call for the alert decision.
    const context = fs.readFileSync(contextFilePath, 'utf-8');
    const decision = await decideOnAlert(context, rawPythonOutput);
    console.log(`[INFO] Gemini decision:`, decision);

    // >> STEP 3: Send the alert update ONLY IF an alert is needed.
    if (decision && decision.alert) {
      console.log('[INFO] Sending alert update to frontend:', decision);
      window.webContents.send('update-alert', decision);
    }

  } catch (error) {
    console.error('[FATAL] Error in monitoring loop:', error.message);
    window.webContents.send('update-alert', {
      alert: true,
      message: 'A fatal error occurred in the backend. Check terminal logs.'
    });
  }
});