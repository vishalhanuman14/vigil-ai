electron-packager . onnx-electron-app --platform=win32 --arch=x64
Copy-Item ..\shared\model.onnx .\onnx-electron-app-win32-x64\
Copy-Item ..\shared\logo.png .\onnx-electron-app-win32-x64\
Copy-Item .\AppxManifest.xml .\onnx-electron-app-win32-x64\
MakeAppx.exe pack /d .\onnx-electron-app-win32-x64 /p ONNXElectronApp.msix