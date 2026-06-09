# =========================================================
# IndexNow Push — PPUQHM santripapua.com
# =========================================================
# Push URL ke Bing + Yandex biar di-recrawl dalam HITUNGAN MENIT
# (bukan nunggu berhari-hari kayak biasanya).
#
# CARA PAKAI:
# -----------
# Push 1 URL:
#   .\indexnow-push.ps1 https://santripapua.com/berita-7
#
# Push beberapa URL sekaligus (max 10.000):
#   .\indexnow-push.ps1 https://santripapua.com/ https://santripapua.com/berita-7
#
# Push semua berita (shortcut):
#   .\indexnow-push.ps1 -All
#
# KAPAN PERLU JALANIN INI:
# ------------------------
# - Habis publish berita baru
# - Habis update konten besar (form, persyaratan, dll)
# - Habis fix SEO issue
#
# Note: Cukup jalanin SEKALI per URL. Bing & Yandex auto re-crawl.
# Untuk Google, masih perlu pakai Search Console manual (Google
# belum support IndexNow per 2026).
# =========================================================

param(
  [Parameter(ValueFromRemainingArguments=$true)]
  [string[]]$Urls,
  [switch]$All
)

$key = "456e6f331ff24d7d81cd161acc22c84f89536257"
$siteHost = "santripapua.com"
$keyLocation = "https://santripapua.com/$key.txt"

# Mode -All: push semua URL utama
if ($All) {
  $Urls = @(
    "https://santripapua.com/",
    "https://santripapua.com/pendaftaran",
    "https://santripapua.com/berita",
    "https://santripapua.com/berita-1",
    "https://santripapua.com/berita-2",
    "https://santripapua.com/berita-3",
    "https://santripapua.com/berita-4",
    "https://santripapua.com/berita-5",
    "https://santripapua.com/berita-6",
    "https://santripapua.com/profil",
    "https://santripapua.com/visi-misi",
    "https://santripapua.com/pengasuh",
    "https://santripapua.com/gus-mursyid",
    "https://santripapua.com/ning-siti",
    "https://santripapua.com/masyayikh",
    "https://santripapua.com/cikal-bakal",
    "https://santripapua.com/sejarah-berdirinya",
    "https://santripapua.com/peresmian"
  )
}

if (-not $Urls -or $Urls.Count -eq 0) {
  Write-Host "ERROR: Tidak ada URL." -ForegroundColor Red
  Write-Host "Pakai: .\indexnow-push.ps1 <url1> <url2> ..." -ForegroundColor Yellow
  Write-Host "Atau:  .\indexnow-push.ps1 -All" -ForegroundColor Yellow
  exit 1
}

$body = @{
  host = $siteHost
  key = $key
  keyLocation = $keyLocation
  urlList = $Urls
} | ConvertTo-Json -Depth 3

Write-Host ""
Write-Host "==> Pushing $($Urls.Count) URL ke IndexNow (Bing + Yandex)..." -ForegroundColor Cyan
foreach ($u in $Urls) { Write-Host "    - $u" }
Write-Host ""

try {
  $resp = Invoke-WebRequest -Uri "https://api.indexnow.org/IndexNow" `
    -Method Post `
    -Body $body `
    -ContentType "application/json; charset=utf-8" `
    -UseBasicParsing `
    -TimeoutSec 15

  switch ($resp.StatusCode) {
    200 { Write-Host "OK - $($Urls.Count) URL berhasil di-submit." -ForegroundColor Green }
    202 { Write-Host "OK (Accepted) - Sedang divalidasi & diproses." -ForegroundColor Green }
    default { Write-Host "Response: $($resp.StatusCode)" -ForegroundColor Yellow }
  }
  Write-Host "Bing & Yandex akan re-crawl URL ini dalam beberapa menit-jam." -ForegroundColor Gray
}
catch {
  $code = $_.Exception.Response.StatusCode.value__
  Write-Host "ERROR ($code): $($_.Exception.Message)" -ForegroundColor Red
  switch ($code) {
    400 { Write-Host "Format salah - cek URL valid & milik santripapua.com" -ForegroundColor Yellow }
    403 { Write-Host "Key tidak cocok - cek $keyLocation accessible di browser" -ForegroundColor Yellow }
    422 { Write-Host "URL tidak match host - URL harus santripapua.com" -ForegroundColor Yellow }
    429 { Write-Host "Rate limit - tunggu sebentar lalu coba lagi" -ForegroundColor Yellow }
  }
}
