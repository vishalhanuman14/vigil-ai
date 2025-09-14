const { spawn } = require('child_process');
const path = require('path');

let pythonProcess = null;
let requestQueue = [];

// Path to the new Python service script
const scriptPath = path.resolve(__dirname, '..', '..', 'scripts', 'video_model_service.py');

/**
 * Starts the long-running Python model service.
 */
function startPythonService() {
  console.log('[PythonService] Starting...');
  pythonProcess = spawn('python', [scriptPath]);

  // Listener for prediction results from Python's stdout
  pythonProcess.stdout.on('data', (data) => {
    const result = data.toString().trim();
    console.log(`[PythonService] Received stdout: "${result}"`);

    // Find the corresponding request in the queue and resolve its promise
    const request = requestQueue.shift();
    if (request) {
      request.resolve(result);
    }
  });

  // Listener for logs/errors from Python's stderr
  pythonProcess.stderr.on('data', (data) => {
    console.error(`[PythonService] stderr: ${data.toString().trim()}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`[PythonService] Child process exited with code ${code}`);
    pythonProcess = null;
    // Potentially add restart logic here if needed
  });
}

/**
 * Sends a video file path to the Python service for analysis.
 * @param {string} videoFilePath - The absolute path to the video file.
 * @returns {Promise<string>} A promise that resolves with the prediction string.
 */
function analyzeVideo(videoFilePath) {
  return new Promise((resolve, reject) => {
    if (!pythonProcess) {
      return reject(new Error("Python service is not running."));
    }

    // Add the promise's resolve/reject functions to the queue
    requestQueue.push({ resolve, reject });

    // Write the file path to the Python process's stdin, followed by a newline
    pythonProcess.stdin.write(`${videoFilePath}\n`, (err) => {
      if (err) {
        console.error('[PythonService] Error writing to stdin:', err);
        // If write fails, remove the request from the queue and reject it
        requestQueue.shift();
        reject(err);
      }
    });
  });
}

module.exports = { startPythonService, analyzeVideo };