# Coloca o Node.js oficial antes do Node embutido do Cursor no PATH desta sessão.
$nodeDir = "C:\Program Files\nodejs"
if (Test-Path $nodeDir) {
  $env:PATH = "$nodeDir;" + ($env:PATH -split ';' | Where-Object { $_ -notmatch 'cursor.*helpers' }) -join ';'
  Write-Host "Node: $(node --version) em $(Get-Command node | Select-Object -ExpandProperty Source)"
  Write-Host "npm:  $(npm --version)"
} else {
  Write-Host "Node.js não encontrado em $nodeDir. Instale: winget install OpenJS.NodeJS.LTS"
}
