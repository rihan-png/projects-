param(
    [switch]$RunOnce,
    [string]$ConfigPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-ScriptRoot {
    if ($PSScriptRoot) {
        return $PSScriptRoot
    }

    return Split-Path -Parent $MyInvocation.MyCommand.Path
}

function Get-DefaultDownloadsPath {
    $userProfile = [Environment]::GetFolderPath("UserProfile")
    return Join-Path $userProfile "Downloads"
}

function Read-Config {
    param([string]$Path)

    if ([string]::IsNullOrWhiteSpace($Path)) {
        $root = Split-Path -Parent (Get-ScriptRoot)
        $Path = Join-Path $root "config.json"
    }

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Config file not found: $Path"
    }

    $raw = Get-Content -LiteralPath $Path -Raw
    $config = $raw | ConvertFrom-Json

    if ([string]::IsNullOrWhiteSpace($config.downloadsPath)) {
        $config.downloadsPath = Get-DefaultDownloadsPath
    }

    if (-not (Test-Path -LiteralPath $config.downloadsPath)) {
        throw "Downloads path not found: $($config.downloadsPath)"
    }

    return $config
}

function Get-CategoryForExtension {
    param(
        [string]$Extension,
        [object]$Categories
    )

    $normalizedExtension = $Extension.ToLowerInvariant()

    foreach ($property in $Categories.PSObject.Properties) {
        $extensions = @($property.Value) | ForEach-Object { $_.ToLowerInvariant() }
        if ($extensions -contains $normalizedExtension) {
            return $property.Name
        }
    }

    return "Other"
}

function Get-UniqueDestinationPath {
    param(
        [string]$Directory,
        [string]$FileName
    )

    $destination = Join-Path $Directory $FileName
    if (-not (Test-Path -LiteralPath $destination)) {
        return $destination
    }

    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
    $extension = [System.IO.Path]::GetExtension($FileName)
    $counter = 1

    do {
        $candidateName = "{0} - duplicate {1}{2}" -f $baseName, $counter, $extension
        $destination = Join-Path $Directory $candidateName
        $counter++
    } while (Test-Path -LiteralPath $destination)

    return $destination
}

function Test-FileReady {
    param(
        [System.IO.FileInfo]$File,
        [int]$SettleSeconds
    )

    if ((Get-Date) - $File.LastWriteTime -lt [TimeSpan]::FromSeconds($SettleSeconds)) {
        return $false
    }

    try {
        $stream = [System.IO.File]::Open($File.FullName, "Open", "ReadWrite", "None")
        $stream.Close()
        return $true
    }
    catch {
        return $false
    }
}

function Move-DownloadFile {
    param(
        [System.IO.FileInfo]$File,
        [object]$Config
    )

    $extension = $File.Extension.ToLowerInvariant()
    $skipExtensions = @($Config.skipExtensions) | ForEach-Object { $_.ToLowerInvariant() }

    if ($skipExtensions -contains $extension) {
        return "Skipped partial file: $($File.Name)"
    }

    if (-not (Test-FileReady -File $File -SettleSeconds ([int]$Config.settleSeconds))) {
        return "Skipped file still changing: $($File.Name)"
    }

    $category = Get-CategoryForExtension -Extension $extension -Categories $Config.categories
    $destinationDirectory = Join-Path $Config.downloadsPath $category

    if (-not (Test-Path -LiteralPath $destinationDirectory)) {
        New-Item -ItemType Directory -Path $destinationDirectory | Out-Null
    }

    if ($File.DirectoryName -eq $destinationDirectory) {
        return "Already sorted: $($File.Name)"
    }

    $destination = Get-UniqueDestinationPath -Directory $destinationDirectory -FileName $File.Name
    Move-Item -LiteralPath $File.FullName -Destination $destination

    return "Moved: $($File.Name) -> $category"
}

function Invoke-SortDownloads {
    param([object]$Config)

    $categoryNames = @($Config.categories.PSObject.Properties.Name) + "Other"
    $files = Get-ChildItem -LiteralPath $Config.downloadsPath -File

    foreach ($file in $files) {
        if ($categoryNames -contains $file.Directory.Name) {
            continue
        }

        try {
            Move-DownloadFile -File $file -Config $Config | Write-Host
        }
        catch {
            Write-Warning "Could not sort '$($file.Name)': $($_.Exception.Message)"
        }
    }
}

function Start-DownloadWatcher {
    param([object]$Config)

    Invoke-SortDownloads -Config $Config

    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $Config.downloadsPath
    $watcher.Filter = "*.*"
    $watcher.IncludeSubdirectories = $false
    $watcher.EnableRaisingEvents = $true

    $action = {
        Start-Sleep -Seconds 2
        try {
            $eventConfig = $Event.MessageData
            $path = $Event.SourceEventArgs.FullPath
            if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
                return
            }

            $file = Get-Item -LiteralPath $path
            Move-DownloadFile -File $file -Config $eventConfig | Write-Host
        }
        catch {
            Write-Warning "Could not sort changed file: $($_.Exception.Message)"
        }
    }

    $created = Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action -MessageData $Config
    $changed = Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action -MessageData $Config
    $renamed = Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $action -MessageData $Config

    Write-Host "Watching $($Config.downloadsPath). Press Ctrl+C to stop."

    try {
        while ($true) {
            Start-Sleep -Seconds 5
        }
    }
    finally {
        Unregister-Event -SubscriptionId $created.Id -ErrorAction SilentlyContinue
        Unregister-Event -SubscriptionId $changed.Id -ErrorAction SilentlyContinue
        Unregister-Event -SubscriptionId $renamed.Id -ErrorAction SilentlyContinue
        $watcher.Dispose()
    }
}

$config = Read-Config -Path $ConfigPath

if ($RunOnce) {
    Invoke-SortDownloads -Config $config
}
else {
    Start-DownloadWatcher -Config $config
}
