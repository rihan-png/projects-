Option Explicit

Dim fso, shell, projectRoot, sorterPath, command
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

projectRoot = fso.GetParentFolderName(WScript.ScriptFullName)
sorterPath = fso.BuildPath(projectRoot, "src\DownloadsAutoSorter.ps1")
command = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & sorterPath & """"

shell.Run command, 0, False
