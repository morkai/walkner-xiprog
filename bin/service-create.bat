@ECHO OFF
CALL %~dp0service-delete.bat
%~dp0nssm install walkner-xiprog "%~dp0node.exe" "%~dp0..\backend\server.js"
sc config walkner-xiprog DisplayName= "Walkner Xiprog"
sc description walkner-xiprog "Xitanium Outdoor Driver Programmer Overlay (port 1337)."
net start walkner-xiprog
