# RateTracker.in - Instant Local Server Runner
# Serves static assets & API health endpoints on http://localhost:3000

param(
    [int]$Port = 3000
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Port $Port is already in use or requires elevation. Trying port 8080..." -ForegroundColor Yellow
    $Port = 8080
    $prefix = "http://localhost:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

$root = $PSScriptRoot

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " RateTracker.in (ratetracker.in) Local Server Running" -ForegroundColor Green
Write-Host " URL: $prefix" -ForegroundColor White
Write-Host " Press Ctrl+C in PowerShell to stop." -ForegroundColor DarkGray
Write-Host "============================================================" -ForegroundColor Cyan

Start-Process $prefix

$mimeMap = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".webp" = "image/webp"
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response

    $localPath = $req.Url.LocalPath
    if ($localPath -eq "/" -or $localPath -eq "") {
        $localPath = "/index.html"
    }

    # Handle health and cuelinks API routes
    if ($localPath -eq "/api/health") {
        $json = '{"platform":"RateTracker.in","status":"healthy","runtime":"PowerShell/.NET","components":{"frontend":{"technology":"HTML, CSS, JavaScript","status":"active"},"backend":{"technology":"Node.js / Local Server","status":"active"},"database":{"technology":"Supabase / PostgreSQL","status":"ready"},"affiliate_integration":{"technology":"Cuelinks API","publisherCid":"82192","status":"active"},"hosting":{"technology":"Vercel / Local","status":"active"}}}'
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
        $res.ContentType = "application/json; charset=utf-8"
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.Close()
        continue
    }

    $filePath = Join-Path $root ($localPath.TrimStart('/'))
    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = $mimeMap[$ext]
        if (-not $contentType) { $contentType = "application/octet-stream" }
        
        $res.ContentType = $contentType
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
        $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $res.Close()
}

