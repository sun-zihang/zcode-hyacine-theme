Add-Type -AssemblyName System.Drawing
$size = 256
$src = [System.Drawing.Image]::FromFile('C:\Users\33352\zcode-hyacine-theme\icon\hyacine-crop.png')
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.InterpolationMode = 'HighQualityBicubic'

# Rounded-rect clip (radius 52)
$r = 52
$gp = New-Object System.Drawing.Drawing2D.GraphicsPath
$gp.AddArc(0, 0, $r, $r, 180, 90)
$gp.AddArc($size - $r, 0, $r, $r, 270, 90)
$gp.AddArc($size - $r, $size - $r, $r, $r, 0, 90)
$gp.AddArc(0, $size - $r, $r, $r, 90, 90)
$gp.CloseFigure()
$g.SetClip($gp)
$g.DrawImage($src, 0, 0, $size, $size)
$g.ResetClip()

# Subtle dusk-indigo inner border for definition
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 60, 44, 96), 6)
$g.DrawPath($pen, $gp)

$g.Dispose()

# Wrap as PNG-in-ICO
$pngPath = 'C:\Users\33352\zcode-hyacine-theme\icon\hyacine.png'
$icoPath = 'C:\Users\33352\zcode-hyacine-theme\icon\hyacine.ico'
$bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose(); $src.Dispose()

$png = [System.IO.File]::ReadAllBytes($pngPath)
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($ms)
$bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]1)
$bw.Write([byte]0); $bw.Write([byte]0); $bw.Write([byte]0); $bw.Write([byte]0)
$bw.Write([uint16]1); $bw.Write([uint16]32)
$bw.Write([uint32]$png.Length); $bw.Write([uint32]22)
$bw.Write($png); $bw.Flush()
[System.IO.File]::WriteAllBytes($icoPath, $ms.ToArray())
$bw.Dispose(); $ms.Dispose()
Write-Output "ico saved: $((Get-Item $icoPath).Length) bytes"
