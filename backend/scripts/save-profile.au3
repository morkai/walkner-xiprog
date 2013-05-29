#AutoIt3Wrapper_Change2CUI=y

#include "./helpers.au3"

$delay = 0

If $CmdLine[0] > 0 Then $delay = Number($CmdLine[1])

$tmpFile = "XitaniumProfile-" & Random(1000000, 9999999, 1) & ".csv"
$tmpPath = @TempDir & "/" & $tmpFile

$win = WinGetHandle($WIN_TITLE)

ExitIf(@error, "WIN_MISSING")

WinActivate($win)

ExitIf(@error, "WIN_NOT_ACTIVATED")

AutoItSetOption("MouseCoordMode", 0)

$saveWin = WinGetHandle($SAVE_PROFILE_WIN_TITLE, $SAVE_PROFILE_WIN_TEXT)

If @error Then
  WinMenuSelectItem($saveWin, "", "&File", "&Save")

  $saveWin = WinWait($SAVE_PROFILE_WIN_TITLE, $SAVE_PROFILE_WIN_TEXT, 5)

  ExitIf($saveWin = 0, "SAVE_PROFILE_WIN_MISSING")
EndIf

WinActivate($saveWin)

ExitIf(@error, "SAVE_PROFILE_WIN_NOT_ACTIVATED")

If $SAVE_PROFILE_DIRECTORY_ID <> "" Then
  ControlClick($saveWin, "", $SAVE_PROFILE_DIRECTORY_ID, "left", 1, 10, 10)
  Sleep(100)
EndIf

ControlSetText($saveWin, "", $SAVE_PROFILE_DIRECTORY_EDIT_ID, @TempDir)
Sleep(100 + $delay)
ControlSend($saveWin, "", $SAVE_PROFILE_DIRECTORY_EDIT_ID, "{ENTER}")
Sleep(500 + $delay)
ControlSetText($saveWin, "", $SAVE_PROFILE_FILE_EDIT_ID, $tmpFile)
Sleep(100 + $delay)
ControlClick($saveWin, "", $SAVE_PROFILE_OPEN_BUTTON_ID)
Sleep(500 + $delay)

If WinExists($SAVE_FILE_STATUS_WIN_TITLE, $SAVE_FILE_STATUS_WIN_TEXT) Then
  Send("{ENTER}")

  $handle = FileOpen($tmpPath, 0)

  While 1
    $data = FileRead($handle, 256)

    If @error <> 0 Then ExitLoop

    ConsoleWrite($data)
  WEnd

  FileClose($handle)
  FileDelete($tmpPath)

  Exit
EndIf

Send("{ENTER}")
ExitIf(1, "SAVING_FAILED")
