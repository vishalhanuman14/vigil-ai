import React, { useState, useRef } from 'react';
import Webcam from "react-webcam";
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaVectorSquare, FaSave, FaTrash } from "react-icons/fa";
import { useZone } from '../context/ZoneContext';

function Configure() {
  const { points, setPoints } = useZone();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
    setPoints([]);
  };

  const handleCanvasClick = (e) => {
    if (points.length >= 4 || !image) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints((prev) => [...prev, { x, y }]);
  };

  const handleSave = () => {
    navigate('/home');
  };

  const handleClear = () => {
    setPoints([]);
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-qualcomm-gray">
      <div className="w-full max-w-7xl h-full flex gap-8">
        {/* Left Panel: Camera */}
        <div className="w-3/5 flex flex-col justify-center">
          <div className='w-full aspect-[4/3] rounded-2xl shadow-2xl bg-qualcomm-dark overflow-hidden'>
            {!image ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative cursor-crosshair w-full h-full" onClick={handleCanvasClick}>
                <img src={image} alt="Captured" className="w-full h-full object-cover" />
                <svg width="100%" height="100%" className="absolute top-0 left-0 pointer-events-none">
                  {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={5} fill={points.length === 4 ? 'lime' : 'red'} stroke="white" strokeWidth="1" />
                  ))}
                  {points.length > 1 && (
                    <polyline
                      points={points.map(p => `${p.x},${p.y}`).join(" ")}
                      fill="none"
                      stroke="rgba(255, 0, 0, 0.7)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  )}
                  {points.length === 4 && (
                    <polygon
                      points={points.map(p => `${p.x},${p.y}`).join(" ")}
                      fill="rgba(0, 255, 128, 0.4)"
                      stroke="lime"
                      strokeWidth="2"
                    />
                  )}
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Controls */}
        <div className="w-2/5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex-grow flex flex-col">
            <h2 className="text-3xl font-bold text-qualcomm-dark mb-4">Define Safe Zone</h2>
            <p className="text-gray-600 mb-6">Create a perimeter by clicking on four points on the captured image. Entry into this zone can trigger an alert.</p>

            <button
              onClick={capture}
              disabled={!!image}
              className="w-full flex items-center justify-center gap-3 text-lg font-semibold py-3 px-6 rounded-lg border-2 border-qualcomm-blue bg-white text-qualcomm-blue transition-colors disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed mb-4"
            >
              <FaCamera /> Capture Scene
            </button>

            <div className="text-center p-4 bg-gray-100 rounded-lg mb-6">
              <div className="flex items-center justify-center text-qualcomm-dark">
                <FaVectorSquare className="mr-3 text-2xl" />
                <span className="text-xl font-medium">Points Selected: {points.length} / 4</span>
              </div>
            </div>

            <button
              onClick={handleClear}
              disabled={points.length === 0}
              // FIX: Changed hover style
              className="w-full flex items-center justify-center gap-3 text-lg font-semibold py-3 px-6 rounded-lg border-2 border-qualcomm-red bg-white text-qualcomm-redtransition-colors disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed mb-auto"
            >
              <FaTrash /> Clear Points
            </button>

            <button
              onClick={handleSave}
              disabled={points.length !== 4}
              className="w-full flex items-center justify-center gap-3 text-lg font-semibold py-3 px-6 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FaSave /> Save Zone & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configure;