import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaSpinner } from "react-icons/fa";
import { useZone } from '../context/ZoneContext';

const RECORDING_INTERVAL_MS = 5000;
const CLIP_DURATION_MS = 4000;

function Home() {
  const [goal, setGoal] = useState('Monitor my sleeping baby for any signs of distress, like crying or unusual movement.');
  const [appState, setAppState] = useState('onboarding');
  const [currentActivity, setCurrentActivity] = useState('Initializing...');
  const [alerts, setAlerts] = useState([]);
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  const { points } = useZone();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const monitoringIntervalRef = useRef(null);

  useEffect(() => {
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setCurrentActivity("Webcam Error. Check permissions.");
      }
    }
    setupWebcam();
  }, []);

  useEffect(() => {
    const cleanupActivity = window.api.onUpdateActivity((activity) => {
      setCurrentActivity(activity);
    });
    const cleanupAlert = window.api.onUpdateAlert((alertData) => {
      const newAlert = {
        message: alertData.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
    });
    return () => {
      cleanupActivity();
      cleanupAlert();
    };
  }, []);

  const startRecordingAndSend = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const recordedChunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoArrayBuffer = await videoBlob.arrayBuffer();
        window.api.sendVideoChunk(videoArrayBuffer);
      };
      mediaRecorderRef.current.start();
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, CLIP_DURATION_MS);
    }
  }, []);

  const handleStartMonitoring = async () => {
    setIsLoadingContext(true);
    setCurrentActivity('Generating security context...');
    try {
      const response = await window.api.startMonitoring(goal);
      if (response.success) {
        setAppState('monitoring');
        setCurrentActivity('Waiting for first clip...');
        startRecordingAndSend();
        monitoringIntervalRef.current = setInterval(startRecordingAndSend, RECORDING_INTERVAL_MS);
      } else {
        setCurrentActivity(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Failed to generate monitoring context:", error);
      setCurrentActivity(`Error: ${error.message}`);
    } finally {
      setIsLoadingContext(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8 relative">
      {/* Fullscreen black loading overlay */}
      {isLoadingContext && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin text-black text-6xl" />
        </div>
      )}

      <div className="w-full max-w-7xl h-full flex gap-8">
        {/* Left Column: Video Feed */}
        <div className="w-3/5 my-auto">
          <div className="w-full aspect-[4/3] rounded-2xl shadow-2xl bg-black overflow-hidden relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {points.length === 4 && (
              <svg width="100%" height="100%" className="absolute top-0 left-0 pointer-events-none">
                <polygon
                  points={points.map(p => `${p.x},${p.y}`).join(" ")}
                  fill="rgba(0, 255, 128, 0.3)"
                  stroke="lime"
                  strokeWidth="2"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Right Column: Controls & Status */}
        <div className="w-2/5 h-full flex flex-col gap-6 py-8">
          {appState === 'onboarding' ? (
            <div className="bg-white p-6 rounded-2xl shadow-xl flex-grow flex flex-col">
              <h2 className="text-3xl font-bold text-qualcomm-dark mb-4">New Monitoring Task</h2>
              <p className="text-gray-600 mb-6">Describe your monitoring goal. The AI will analyze the scene for relevant events.</p>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows="5"
                className="w-full p-3 border-2 border-gray-200 rounded-lg mb-auto focus:ring-2 focus:ring-qualcomm-blue-light focus:border-transparent outline-none transition"
                placeholder="e.g., Monitor my baby and alert me to danger"
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={handleStartMonitoring}
                  disabled={isLoadingContext}
                  className="flex-grow font-bold py-3 px-6 rounded-lg border-2 border-qualcomm-blue bg-white text-qualcomm-bluetransition-colors disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoadingContext ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    "Continue"
                  )}
                </button>
                <Link
                  to="/configure"
                  className="p-3 bg-gray-200 text-qualcomm-dark rounded-lg hover:bg-gray-300 transition-colors"
                  title="Define Safe Zone"
                >
                  <FaPencilAlt size={24} />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-xl">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Live Status</h3>
                <p className="text-3xl font-bold text-qualcomm-blue-light capitalize">{currentActivity}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-xl flex-grow flex flex-col min-h-0">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">Event Log</h3>
                <div className="overflow-y-auto flex-grow pr-2">
                  {alerts.length === 0 ? (
                    <p className="text-gray-400 text-center mt-8">No alerts yet.</p>
                  ) : (
                    alerts.map((alert, index) => (
                      <div key={index} className="bg-qualcomm-red/10 border-l-4 border-qualcomm-red text-qualcomm-dark p-3 rounded-r-lg mb-3">
                        <strong className="text-qualcomm-red">{alert.timestamp}</strong>
                        <p>{alert.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
