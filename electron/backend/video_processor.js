// electron/backend/video_processor.js

const { execFile } = require('child_process');
const path = require('path');

const scriptPath = path.resolve(__dirname, '..', '..', 'scripts', 'run_video_model.py');

function analyzeVideo(videoFilePath) {
    return new Promise((resolve, reject) => {
        const command = 'python'; // Or 'python' if that's your command
        const args = [scriptPath, "--video", videoFilePath];

        // --- LOGGING POINT 1: Log the command being executed ---
        console.log(`[INFO] Executing command: ${command} ${args.join(' ')}`);

        execFile(command, args, (error, stdout, stderr) => {
            // --- LOGGING POINT 2: Log any errors from the script execution itself ---
            if (error) {
                console.error(`[ERROR] execFile error: ${error.message}`);
                console.error(`[ERROR] Python stderr: ${stderr}`); // Log stderr content
                return reject(error);
            }

            // --- LOGGING POINT 3: Log stderr even on success, as it can contain warnings ---
            if (stderr) {
                console.warn(`[WARN] Python script produced stderr warnings: ${stderr}`);
            }

            // --- LOGGING POINT 4: Log the successful output from the script ---
            const output = stdout.trim();
            console.log(`[SUCCESS] Raw stdout from Python: "${output}"`);

            if (!output) {
                // Handle cases where the script runs but produces no output
                return reject(new Error("Python script executed successfully but produced no output."));
            }

            resolve(output);
        });
    });
}

module.exports = { analyzeVideo };