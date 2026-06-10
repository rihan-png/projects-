# Downloads Auto Sorter

A small Windows PowerShell project that automatically organizes your Downloads folder into file-type folders.

It watches the Downloads folder and moves completed files into folders like `Documents`, `Images`, `Videos`, `Audio`, `Installers`, `Archives`, `Code and Projects`, `Shortcuts`, and `Other`.

## Features

- Automatically sorts new downloads
- Skips incomplete downloads such as `.crdownload`, `.download`, `.part`, and `.tmp`
- Avoids overwriting files by adding duplicate numbers
- Runs at Windows login using Task Scheduler
- Easy install and uninstall scripts
- Configurable folder rules in `config.json`

## Folder Rules

Default categories:

| Folder | Extensions |
| --- | --- |
| Documents | `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, `.xls`, `.xlsx`, `.txt`, `.md` |
| Images | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`, `.svg` |
| Videos | `.mp4`, `.mov`, `.mkv`, `.avi`, `.wmv`, `.webm` |
| Audio | `.mp3`, `.wav`, `.m4a`, `.aac`, `.flac`, `.ogg` |
| Installers | `.exe`, `.msi`, `.appinstaller`, `.rpm` |
| Archives | `.zip`, `.rar`, `.7z`, `.tar`, `.gz` |
| Code and Projects | `.cpp`, `.c`, `.h`, `.py`, `.js`, `.ts`, `.html`, `.htm`, `.css`, `.json`, `.ipynb`, `.pdsprj`, `.pbix`, `.drp`, `.ics`, `.conf`, `.lock` |
| Shortcuts | `.lnk` |
| Other | Everything else |

## Install

Open PowerShell in this project folder and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

This creates a scheduled task named `DownloadsAutoSorter` that starts when you log in.

If Windows denies scheduled task creation, the installer automatically falls back to a shortcut in your user Startup folder.

## Run Once Manually

```powershell
powershell -ExecutionPolicy Bypass -File .\src\DownloadsAutoSorter.ps1 -RunOnce
```

## Start Watching Manually

```powershell
powershell -ExecutionPolicy Bypass -File .\src\DownloadsAutoSorter.ps1
```

Press `Ctrl+C` to stop.

## Uninstall

```powershell
powershell -ExecutionPolicy Bypass -File .\uninstall.ps1
```

This removes the scheduled task. It does not delete your organized files.

If the installer used the Startup folder fallback, this removes that shortcut too.

## Customize

Edit `config.json` to change categories, extensions, skipped extensions, or the Downloads path.

Set `"downloadsPath": ""` to use the current user's default Downloads folder.

## Safety

This script only moves files inside your Downloads folder into category folders. It does not delete files.
