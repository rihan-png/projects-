$ErrorActionPreference = "Stop"

$projectRoot = $PSScriptRoot
$scriptPath = Join-Path $projectRoot "src\DownloadsAutoSorter.ps1"
$taskName = "DownloadsAutoSorter"
$shortcutName = "Downloads Auto Sorter.lnk"

if (-not (Test-Path -LiteralPath $scriptPath)) {
    throw "Sorter script not found: $scriptPath"
}

function Install-StartupShortcut {
    param([string]$SorterScriptPath)

    $startupFolder = [Environment]::GetFolderPath("Startup")
    $shortcutPath = Join-Path $startupFolder $shortcutName
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = "powershell.exe"
    $shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$SorterScriptPath`""
    $shortcut.WorkingDirectory = Split-Path -Parent $SorterScriptPath
    $shortcut.Description = "Automatically organizes new files in the Downloads folder."
    $shortcut.Save()

    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$SorterScriptPath`"" -WindowStyle Hidden

    Write-Host "Installed and started Startup shortcut: $shortcutPath"
}

try {
    $action = New-ScheduledTaskAction `
        -Execute "powershell.exe" `
        -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`""

    $trigger = New-ScheduledTaskTrigger -AtLogOn
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -MultipleInstances IgnoreNew `
        -RestartCount 3 `
        -RestartInterval (New-TimeSpan -Minutes 1)

    Register-ScheduledTask `
        -TaskName $taskName `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Description "Automatically organizes new files in the Downloads folder." `
        -Force | Out-Null

    Start-ScheduledTask -TaskName $taskName

    Write-Host "Installed and started scheduled task: $taskName"
}
catch {
    Write-Warning "Scheduled task install failed: $($_.Exception.Message)"
    Write-Host "Falling back to the current user's Startup folder."
    Install-StartupShortcut -SorterScriptPath $scriptPath
}
