#AutoIt3Wrapper_Change2CUI=y

#include "./helpers.au3"

$directory = "C:/Program Files (x86)/Xitanium Outdoor Driver Programmer"
$file = "XitaniumOutdoorDriverProfileDefault.csv"
$delay = 0

If $CmdLine[0] > 0 Then $directory = $CmdLine[1]
If $CmdLine[0] > 1 Then $file = $CmdLine[2]
If $CmdLine[0] > 2 Then $delay = Number($CmdLine[3])

$path = $directory & "\\" & $file

ExitIf(FileExists($path) = 0, "INVALID_PROFILE_PATH")

$win = WinGetHandle($WIN_TITLE)

ExitIf(@error, "WIN_MISSING")

WinActivate($win)

ExitIf(@error, "WIN_NOT_ACTIVATED")

AutoItSetOption("MouseCoordMode", 0)

$loadWin = WinGetHandle($SELECT_PROFILE_WIN_TITLE, $SELECT_PROFILE_WIN_TEXT)

If @error Then
  WinMenuSelectItem($loadWin, "", "&File", "&Load")

  $loadWin = WinWait($SELECT_PROFILE_WIN_TITLE, $SELECT_PROFILE_WIN_TEXT, 5)

  ExitIf($loadWin = 0, "LOAD_PROFILE_WIN_MISSING")
EndIf

WinActivate($loadWin)

ExitIf(@error, "LOAD_PROFILE_WIN_NOT_ACTIVATED")

If $SELECT_PROFILE_DIRECTORY_ID <> "" Then
  ControlClick($loadWin, "", $SELECT_PROFILE_DIRECTORY_ID, "left", 1, 10, 10)
  Sleep(100 + $delay)
EndIf

ControlSetText($loadWin, "", $SELECT_PROFILE_DIRECTORY_EDIT_ID, $directory)
Sleep(100 + $delay)
ControlSend($loadWin, "", $SELECT_PROFILE_DIRECTORY_EDIT_ID, "{ENTER}")
Sleep(500 + $delay)
ControlSetText($loadWin, "", $SELECT_PROFILE_FILE_EDIT_ID, $file)
Sleep(100 + $delay)
ControlClick($loadWin, "", $SELECT_PROFILE_OPEN_BUTTON_ID)
Sleep(500 + $delay)

If WinExists($SELECT_FILE_STATUS_WIN_TITLE, $SELECT_FILE_STATUS_WIN_TEXT) Then
  Send("{ENTER}")

  $handle = FileOpen($path, 0)

  While 1
    $data = FileRead($handle, 256)

    If @error <> 0 Then ExitLoop

    ConsoleWrite($data)
  WEnd

  FileClose($handle)

  Exit
EndIf

Send("{ENTER}")
ExitIf(1, "LOADING_FAILED")
