Add-Type -AssemblyName System.Drawing
$size = 256
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'

# Rounded-square dusk-indigo tile
$gp = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 56
$gp.AddArc(0, 0, $r, $r, 180, 90)
$gp.AddArc($size - $r, 0, $r, $r, 270, 90)
$gp.AddArc($size - $r, $size - $r, $r, $r, 0, 90)
$gp.AddArc(0, $size - $r, $r, $r, 90, 90)
$gp.CloseFigure()

$grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(0, $size)),
    [System.Drawing.Color]::FromArgb(255, 34, 30, 66),
    [System.Drawing.Color]::FromArgb(255, 74, 44, 92))
$g.FillPath($grad, $gp)

# Hyacinth-pink crescent moon
$pink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 177, 201))
$g.FillEllipse($pink, 62, 48, 132, 132)
$cut = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 40, 34, 74))
$g.FillEllipse($cut, 96, 34, 122, 122)

# Wind-teal sparkle star (4-point)
$teal = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 142, 212, 207))
$cx = 178; $cy = 178; $long = 30; $short = 9
$p0 = New-Object System.Drawing.Point($cx, ($cy - $long))
$p1 = New-Object System.Drawing.Point(($cx + $short), ($cy - $short))
$p2 = New-Object System.Drawing.Point(($cx + $long), $cy)
$p3 = New-Object System.Drawing.Point(($cx + $short), ($cy + $short))
$p4 = New-Object System.Drawing.Point($cx, ($cy + $long))
$p5 = New-Object System.Drawing.Point(($cx - $short), ($cy + $short))
$p6 = New-Object System.Drawing.Point(($cx - $long), $cy)
$p7 = New-Object System.Drawing.Point(($cx - $short), ($cy - $short))
$pts = [System.Drawing.Point[]]@($p0, $p1, $p2, $p3, $p4, $p5, $p6, $p7)
$g.FillPolygon($teal, $pts)

# Tiny gold star
$gold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 240, 162, 78))
$g.FillEllipse($gold, 96, 172, 12, 12)

$g.Dispose()

# Save PNG, then wrap into a 256px PNG-compressed .ico
$pngPath = 'C:\Users\33352\zcode-hyacine-theme\icon\hyacine.png'
$icoPath = 'C:\Users\33352\zcode-hyacine-theme\icon\hyacine.ico'
$bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

$png = [System.IO.File]::ReadAllBytes($pngPath)
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($ms)
$bw.Write([uint16]0)          # reserved
$bw.Write([uint16]1)          # type: icon
$bw.Write([uint16]1)          # count
$bw.Write([byte]0)            # width 256 (0 = 256)
$bw.Write([byte]0)            # height 256
$bw.Write([byte]0)            # palette
$bw.Write([byte]0)            # reserved
$bw.Write([uint16]1)          # planes
$bw.Write([uint16]32)         # bpp
$bw.Write([uint32]$png.Length)
$bw.Write([uint32]22)         # data offset
$bw.Write($png)
$bw.Flush()
[System.IO.File]::WriteAllBytes($icoPath, $ms.ToArray())
$bw.Dispose(); $ms.Dispose()
Write-Output "ico saved: $((Get-Item $icoPath).Length) bytes"
