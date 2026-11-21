# 存存 · 构建脚本（无需 Gradle / Android Studio）
# 用法:  powershell -ExecutionPolicy Bypass -File build.ps1
# 产物:  <项目目录>\cuncun-1.5.1.apk

$ErrorActionPreference = 'Continue'
$proj = $PSScriptRoot
$dev  = 'C:\Users\Lenovo\cuncun-dev'
$sdk  = "$dev\sdk"
$bt   = "$sdk\build-tools\34.0.0"
$jar  = "$sdk\platforms\android-34\android.jar"
$jdk  = "$dev\jdk-17.0.2"
$java = "$jdk\bin\java.exe"
$javac = "$jdk\bin\javac.exe"
$keytool = "$jdk\bin\keytool.exe"
$adb  = "$sdk\platform-tools\adb.exe"
$out  = "$proj\build"
$apkName = 'cuncun-1.5.1.apk'

$env:JAVA_HOME = $jdk
$env:Path = "$jdk\bin;$bt;$sdk\platform-tools;$env:Path"

Write-Host '[1/7] 清理输出目录' -ForegroundColor Cyan
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Force -Path $out, "$out\gen", "$out\classes", "$out\dex" | Out-Null

Write-Host '[2/7] 编译资源 (aapt2 compile)' -ForegroundColor Cyan
& "$bt\aapt2.exe" compile --dir "$proj\res" -o "$out\res.zip"
if ($LASTEXITCODE -ne 0) { throw 'aapt2 compile 失败' }

Write-Host '[3/7] 链接资源与清单 (aapt2 link)' -ForegroundColor Cyan
& "$bt\aapt2.exe" link `
  -o "$out\base.apk" `
  -I $jar `
  --manifest "$proj\AndroidManifest.xml" `
  --java "$out\gen" `
  --min-sdk-version 26 `
  --target-sdk-version 34 `
  --version-code 14 `
  --version-name 1.5.1 `
  "$out\res.zip"
if ($LASTEXITCODE -ne 0) { throw 'aapt2 link 失败' }

Write-Host '[4/7] 编译 Java (javac)' -ForegroundColor Cyan
$srcs = @()
$srcs += Get-ChildItem -Path "$proj\java" -Recurse -Filter *.java | ForEach-Object { $_.FullName }
$srcs += Get-ChildItem -Path "$out\gen" -Recurse -Filter *.java | ForEach-Object { $_.FullName }
& $javac -encoding UTF-8 -source 8 -target 8 -nowarn -Xlint:none `
  -classpath $jar `
  -d "$out\classes" $srcs 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) { throw 'javac 编译失败' }

Write-Host '[5/7] 生成 dex (d8)' -ForegroundColor Cyan
$classes = Get-ChildItem -Path "$out\classes" -Recurse -Filter *.class | ForEach-Object { $_.FullName }
& $java -cp "$bt\lib\d8.jar" com.android.tools.r8.D8 --release --lib $jar --min-api 26 --output "$out\dex" $classes 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) { throw 'd8 失败' }

Copy-Item "$out\base.apk" "$out\unsigned.apk" -Force

# 把 dex 与 assets 以标准“/”分隔的路径写入 APK
# （aapt2 在 Windows 下会把 assets 写成反斜杠，导致 AssetManager 读不到）
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open("$out\unsigned.apk", [System.IO.Compression.ZipArchiveMode]::Update)
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
  $zip, "$out\dex\classes.dex", "classes.dex", [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
$assetRoot = "$proj\assets"
Get-ChildItem -Path $assetRoot -Recurse -File | ForEach-Object {
  $rel = 'assets/' + ($_.FullName.Substring($assetRoot.Length + 1) -replace '\\', '/')
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
    $zip, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
}
$zip.Dispose()

# 自检：assets 条目必须是正斜杠，且入口存在
$chk = [System.IO.Compression.ZipFile]::OpenRead("$out\unsigned.apk")
$names = @($chk.Entries | ForEach-Object { $_.FullName })
$chk.Dispose()
$bad = @($names | Where-Object { $_ -like 'assets*' -and $_ -match '\\' })
if ($bad.Count -gt 0) { throw ('assets 条目含反斜杠: ' + ($bad -join ', ')) }
if ($names -notcontains 'assets/www/index.html') { throw 'assets/www/index.html 未写入' }
if ($names -notcontains 'classes.dex') { throw 'classes.dex 未写入' }
Write-Host ('  assets 条目: ' + ((@($names) | Where-Object { $_ -like 'assets*' }) -join ', '))

Write-Host '[6/7] 对齐与签名' -ForegroundColor Cyan
& "$bt\zipalign.exe" -f -p 4 "$out\unsigned.apk" "$out\aligned.apk"
if ($LASTEXITCODE -ne 0) { throw 'zipalign 失败' }

$ks = "$dev\keys\cuncun.jks"
if (-not (Test-Path $ks)) {
  New-Item -ItemType Directory -Force -Path (Split-Path $ks) | Out-Null
  & $keytool -genkeypair -keystore $ks -alias cuncun -keyalg RSA -keysize 2048 -validity 12000 `
    -storepass cuncun2026 -keypass cuncun2026 `
    -dname "CN=CunCun,OU=Personal,O=CunCun,L=Zhengzhou,ST=Henan,C=CN"
  if ($LASTEXITCODE -ne 0) { throw '生成签名密钥失败' }
}

& "$bt\apksigner.bat" sign `
  --ks $ks --ks-key-alias cuncun --ks-pass pass:cuncun2026 --key-pass pass:cuncun2026 `
  --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true `
  --out "$proj\$apkName" "$out\aligned.apk"
if ($LASTEXITCODE -ne 0) { throw 'apksigner 签名失败' }

& "$bt\apksigner.bat" verify --print-certs "$proj\$apkName" | Select-Object -First 4

Write-Host '[7/7] 构建完成' -ForegroundColor Green
Get-Item "$proj\$apkName" | Select-Object Name, @{n = 'MB'; e = { [math]::Round($_.Length / 1MB, 2) } } | Format-Table -AutoSize

Write-Host ('安装到手机：adb install -r "{0}"' -f "$proj\$apkName")
