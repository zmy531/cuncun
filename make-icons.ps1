Add-Type -AssemblyName System.Drawing

$src = "C:\Users\Lenovo\Doubao\chats\2026-11-21\new-chat\cuncun\icon-source.png"
$root = "C:\Users\Lenovo\Doubao\chats\2026-11-21\new-chat\cuncun"
$res = "$root\res"

function New-Rounded([System.Drawing.Bitmap]$img, [int]$size, [double]$radiusRatio, [double]$innerRatio) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Transparent)

  $pad = [int]($size * ((1 - $innerRatio) / 2))
  $side = $size - $pad * 2
  $r = [int]($side * $radiusRatio)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $x = $pad; $y = $pad; $w = $side; $h = $side
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()

  $ib = New-Object System.Drawing.Bitmap($img, $side, $side)
  $ib.SetResolution(96, 96)
  $g.SetClip($path)
  $g.DrawImage($ib, $x, $y, $side, $side)
  $g.ResetClip()
  $ib.Dispose()
  $g.Dispose()
  return $bmp
}

$master = [System.Drawing.Image]::FromFile($src)
$w = $master.Width; $h = $master.Height
"source: $w x $h"

# 母版 1024（应用内展示用）
$m1024 = New-Rounded $master 1024 0.22 1.0
$m1024.Save("$root\icon-master.png", [System.Drawing.Imaging.ImageFormat]::Png)
$m1024.Dispose()

# 桌面图标（传统）：整图圆角
$legacy = @{ 'mdpi' = 48; 'hdpi' = 72; 'xhdpi' = 96; 'xxhdpi' = 144; 'xxxhdpi' = 192 }
foreach ($k in $legacy.Keys) {
  $b = New-Rounded $master $legacy[$k] 0.22 1.0
  $b.Save("$res\mipmap-$k\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $b.Dispose()
}

# 自适应前景：108dp 画布中内容占 66%
$fg = @{ 'mdpi' = 108; 'hdpi' = 162; 'xhdpi' = 216; 'xxhdpi' = 324; 'xxxhdpi' = 432 }
foreach ($k in $fg.Keys) {
  $b = New-Rounded $master $fg[$k] 0.2 0.66
  $b.Save("$res\mipmap-$k\ic_launcher_fg.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $b.Dispose()
}
$master.Dispose()

# 应用内展示图（512）
$in = [System.Drawing.Image]::FromFile("$root\icon-master.png")
$ib = New-Object System.Drawing.Bitmap($in, 512, 512)
New-Item -ItemType Directory -Force -Path "$root\assets\www\img" | Out-Null
$ib.Save("$root\assets\www\img\cuncun.png", [System.Drawing.Imaging.ImageFormat]::Png)
$ib.Dispose(); $in.Dispose()

# 自适应背景色：取原图左上角像素贴近的米色
$bg = [System.Drawing.Image]::FromFile($src)
$px = (New-Object System.Drawing.Bitmap($bg, 8, 8)).GetPixel(1, 1)
"bg color: $($px.R),$($px.G),$($px.B)"
$bg.Dispose()

"icons done"
