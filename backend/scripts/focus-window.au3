#AutoIt3Wrapper_Change2CUI=y

#include "./helpers.au3"

$title = $DEFAULT_FOCUS_WIN_TITLE

If $CmdLine[0] > 0 Then $title = $CmdLine[1]

$win = WinActivate($title)

If $win = 0 Then Exit 1

Exit 0