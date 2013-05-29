Global Const $DEFAULT_FOCUS_WIN_TITLE = "Programator Xitanium"
Global Const $DEFAULT_TIMEOUT = 45000
Global Const $WIN_TITLE = "Xitanium Outdoor Driver Programmer V1.7"
Global Const $SELECT_PROFILE_WIN_TITLE = "Select profile"
Global Const $SELECT_PROFILE_WIN_TEXT = ""
Global Const $SELECT_PROFILE_DIRECTORY_ID = "[ID:1001]"
Global Const $SELECT_PROFILE_DIRECTORY_EDIT_ID = "Edit2"
Global Const $SELECT_PROFILE_FILE_EDIT_ID = "Edit1"
Global Const $SELECT_PROFILE_OPEN_BUTTON_ID = "Button1"
Global Const $SELECT_FILE_STATUS_WIN_TITLE = "File status"
Global Const $SELECT_FILE_STATUS_WIN_TEXT = "Profile loaded successfully"
Global Const $SAVE_PROFILE_WIN_TITLE = "Enter file name"
Global Const $SAVE_PROFILE_WIN_TEXT = ""
Global Const $SAVE_PROFILE_DIRECTORY_ID = "ToolbarWindow323"
Global Const $SAVE_PROFILE_DIRECTORY_EDIT_ID = "Edit2"
Global Const $SAVE_PROFILE_FILE_EDIT_ID = "Edit1"
Global Const $SAVE_PROFILE_OPEN_BUTTON_ID = "Button1"
Global Const $SAVE_FILE_STATUS_WIN_TITLE = "File status"
Global Const $SAVE_FILE_STATUS_WIN_TEXT = "File saved successfully"
Global Const $PROGRAM_BUTTON_ID = "[ID:48]"
Global Const $READ_BUTTON_ID = "[ID:49]"
Global Const $PORT_NOT_AVAILABLE_WIN_TITLE = "Port not available"
Global Const $PORT_NOT_AVAILABLE_WIN_TEXT = "COM port"
Global Const $COMMUNICATION_ERROR_WIN_TITLE = "Communication error"
Global Const $COMMUNICATION_ERROR_WIN_TEXT = "Unable to communicate"
Global Const $INCOMPATIBLE_VERSION_WIN_TITLE = "Incompatible version"
Global Const $INCOMPATIBLE_VERSION_WIN_TEXT = "You are trying to"
Global Const $INVALID_INPUT_WIN_TITLE = "Invalid input"
Global Const $INVALID_INPUT_WIN_TEXT = "Invalid input"

Func ExitIf($condition, $error)
  If $condition Then
    ExitWithError($error)
  EndIf
EndFunc

Func ExitWithError($error)
  ConsoleWriteError("ERR_" & $error)
  Exit 1
EndFunc

Func DetermineResult($win, $x, $y)
  PixelSearch($x, $y, $x + 60, $y + 30, 0x00FF00, 0, 1, $win)

  If @error <> 1 Then Return 1

  PixelSearch($x, $y, $x + 60, $y + 30, 0xFF0000, 0, 1, $win)

  If @error <> 1 Then Return 0

  Return -1
EndFunc

Func CheckDialogs()
  If WinExists($PORT_NOT_AVAILABLE_WIN_TITLE, $PORT_NOT_AVAILABLE_WIN_TEXT) Then
    Send("{ENTER}")
    Sleep(250)
    If WinExists($PORT_NOT_AVAILABLE_WIN_TITLE, $PORT_NOT_AVAILABLE_WIN_TEXT) Then
      Send("{ENTER}")
    EndIf
    ExitWithError("PORT_NOT_AVAILABLE")
  EndIf

  If WinExists($COMMUNICATION_ERROR_WIN_TITLE, $COMMUNICATION_ERROR_WIN_TEXT) Then
    Send("{ENTER}")
    ExitWithError("COMMUNICATION_ERROR")
  EndIf

  If WinExists($INCOMPATIBLE_VERSION_WIN_TITLE, $INCOMPATIBLE_VERSION_WIN_TEXT) Then
    Send("{ENTER}")
    ExitWithError("INCOMPATIBLE_VERSION")
  EndIf
EndFunc

Func WriteResults($win)
  ConsoleWrite("AOC," & DetermineResult($win, 260, 70) & ",")
  ConsoleWrite("MTP," & DetermineResult($win, 260, 160) & ",")
  ConsoleWrite("AST," & DetermineResult($win, 260, 450) & ",")
  ConsoleWrite("OTL," & DetermineResult($win, 260, 525) & ",")
  ConsoleWrite("DIS," & DetermineResult($win, 540, 70) & ",")
  ConsoleWrite("CLO," & DetermineResult($win, 945, 525))
EndFunc
