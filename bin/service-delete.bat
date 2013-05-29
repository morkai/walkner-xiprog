@ECHO OFF
net stop walkner-xiprog
%~dp0nssm remove walkner-xiprog confirm
