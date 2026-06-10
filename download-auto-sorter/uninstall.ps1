$ErrorActionPreference = "Stop"

$taskName = "DownloadsAutoSorter"
$shortcutPath = Join-Path ([Environment]::GetFolderPath("Startup")) "Downloads Auto Sorter.lnk"
$task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($null -ne $task) {
    Stop-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Removed scheduled task: $taskName"
}

if (Test-Path -LiteralPath $shortcutPath) {
    Remove-Item -LiteralPath $shortcutPath
    Write-Host "Removed Startup shortcut: $shortcutPath"
}

if (($null -eq $task) -and (-not (Test-Path -LiteralPath $shortcutPath))) {
    Write-Host "No install entry found."
}
