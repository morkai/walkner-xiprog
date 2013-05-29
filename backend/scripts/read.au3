#AutoIt3Wrapper_Change2CUI=y

#include "./helpers.au3"

$timeout = $DEFAULT_TIMEOUT

If $CmdLine[0] > 0 Then $timeout = Number($CmdLine[1])
If $timeout < 1000 Then $timeout = $DEFAULT_TIMEOUT

$win = WinGetHandle($WIN_TITLE)

ExitIf(@error, "WIN_MISSING")

WinActivate($win)

ExitIf(@error, "WIN_NOT_ACTIVATED")

AutoItSetOption("MouseCoordMode", 0)
AutoItSetOption("PixelCoordMode", 2)

ControlClick($win, "", $READ_BUTTON_ID)

$timer = TimerInit()

While 1
  If DetermineResult($win, 630, 630) <> -1 Then ExitLoop

  CheckDialogs()

  If WinExists($INVALID_INPUT_WIN_TITLE, $INVALID_INPUT_WIN_TEXT) Then
    Send("{ENTER}")
  EndIf

  If ControlCommand($win, "", $READ_BUTTON_ID, "IsEnabled", "") Then
    Sleep(500)
    If ControlCommand($win, "", $READ_BUTTON_ID, "IsEnabled", "") Then ExitLoop
  EndIf

  ExitIf(TimerDiff($timer) > $timeout, "READING_TIMEOUT")

  Sleep(100)
WEnd

CheckDialogs()
WriteResults($win)
