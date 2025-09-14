# QVigil - AI Monitoring Application

QVigil is a privacy-first monitoring application that uses on-device AI models for video analysis and intelligent alert generation. The application combines Qualcomm's VideoMAE model for activity recognition with Large Language Models for context-aware decision making.

## 🚀 Features

- **Privacy-First**: All video processing happens locally on your device
- **Real-time Monitoring**: Live webcam feed with continuous analysis
- **AI-Powered Alerts**: Context-aware notifications based on user-defined goals
- **Activity Recognition**: Uses Qualcomm's VideoMAE model for understanding activities
- **Customizable Zones**: Define specific areas for monitoring
- **Cross-Platform**: Built with Electron for Windows, macOS, and Linux support

## 🏗️ Architecture

```
├── Frontend (React + Electron)
│   ├── Landing page with onboarding
│   ├── Real-time video display
│   ├── Alert dashboard
│   └── Configuration interface
│
├── Backend (Node.js + Python)
│   ├── Video capture and processing
│   ├── Python service for VideoMAE inference
│   ├── LLM integration for alert decisions
│   └── Inter-process communication
│
└── AI Models
    ├── Qualcomm VideoMAE (video-mae)
    └── Llama 3.2 3B Instruct
```

## 📋 Prerequisites

- **Python 3.11**
- **Node.js 18+**
- **npm** or **yarn**
- **Git**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vigil-llm
```

### 2. Set up Python Environment

```bash
# Create and activate virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
pip install "qai-hub-models[video-mae]"
```

### 3. Install Llama 3.2 Model

Follow the instructions at: https://huggingface.co/qualcomm/Llama-v3.2-3B-Instruct

**Note**: Model assets require proper licensing and may not be readily available for download due to licensing restrictions.

### 4. Install Node.js Dependencies

```bash
npm install
```

## 🚀 Development

### Start Development Server

```bash
# Ensure Python virtual environment is activated
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start the application in development mode
npm run dev
```

This will:
- Start the Vite development server for the React frontend
- Launch the Electron application
- Initialize the Python VideoMAE service

## 🏃‍♂️ Usage

1. **Launch the Application**: Run `npm run dev` to start the development environment

2. **Setup Monitoring Goal**: 
   - Describe what you want to monitor (e.g., "Monitor my sleeping baby for signs of distress")
   - The AI will generate a context for relevant events to watch

3. **Configure Safe Zones** (Optional):
   - Click the pencil icon to define specific areas for monitoring
   - Draw a polygon over areas of interest

4. **Start Monitoring**:
   - Click "Continue" to begin real-time analysis
   - The system will capture video clips every 5 seconds
   - Activities are analyzed using VideoMAE
   - LLM determines if alerts should be triggered

5. **Monitor Events**:
   - Live status shows current detected activities
   - Event log displays timestamped alerts
   - All processing happens locally for privacy

## 📁 Project Structure

```
vigil-llm/
├── assets/                 # Static assets and images
├── electron/              # Electron main process
│   ├── backend/           # Node.js backend logic
│   │   ├── ai_handler.js  # LLM integration
│   │   └── python_service.js # Python model interface
│   ├── main.js           # Electron main process
│   └── preload.js        # Electron preload script
├── scripts/              # Python scripts
│   ├── video_model_service.py # VideoMAE service
│   └── run_video_model.py     # VideoMAE CLI runner
├── src/                  # React frontend
│   ├── Context/          # React contexts
│   ├── Home/            # Main monitoring interface
│   ├── Landing/         # Landing page
│   ├── Configure/       # Zone configuration
│   └── App.jsx         # Main React component
├── requirements.txt     # Python dependencies
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## 🔧 Configuration

### Video Settings
- **Recording Interval**: 5 seconds (configurable in `src/Home/index.jsx`)
- **Clip Duration**: 4 seconds (configurable in `src/Home/index.jsx`)
- **Video Format**: WebM (browser capture)

### AI Models
- **VideoMAE**: Qualcomm's optimized model for activity recognition
- **LLM**: Llama 3.2 3B Instruct for decision making
- **Fallback**: Gemini API for cloud-based processing

## 🔒 Privacy & Security

- **Local Processing**: All video analysis happens on-device
- **No Cloud Storage**: Video clips are processed locally and discarded
- **Minimal Network**: Only LLM API calls for alert decisions (optional)
- **User Control**: Full control over monitoring goals and zones

## 🐛 Troubleshooting

### Common Issues

1. **Python Service Not Starting**:
   ```bash
   # Check if Python virtual environment is activated
   which python
   # Should point to your venv/bin/python
   ```

2. **VideoMAE Model Loading Issues**:
   ```bash
   # Test the model separately
   python scripts/run_video_model.py --video path/to/test/video.mp4
   ```

3. **Webcam Permission Issues**:
   - Ensure browser/Electron has camera permissions
   - Check system privacy settings

4. **Missing Dependencies**:
   ```bash
   # Reinstall Python dependencies
   pip install -r requirements.txt --force-reinstall
   
   # Reinstall Node dependencies
   npm install
   ```

### Debug Modes

- **Development**: `npm run dev` includes Chrome DevTools
- **Python Logs**: Check terminal output for VideoMAE service logs
- **Electron Logs**: Available in DevTools console

## 📦 Building for Production

```bash
# Build the React frontend
npm run build

# Package the Electron application (requires additional electron-builder setup)
# npm run electron:pack
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIR License

## 🔗 References

- [Qualcomm AI Hub Models](https://github.com/quic/ai-hub-models)
- [VideoMAE Model](https://huggingface.co/qualcomm/Llama-v3.2-3B-Instruct)
- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://reactjs.org/docs)

## ⚠️ Important Notes

- The Llama 3.2 model requires proper licensing and may not be readily available
- Some features require API keys for cloud-based LLM services
- This is a development/demo application - production deployment requires additional security considerations
