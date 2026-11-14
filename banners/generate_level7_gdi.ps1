Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# 1. Background gradient (Tím galaxy sâu thẳm: #130026 -> #540e7a -> #1d003b)
$bgRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$c1 = [System.Drawing.Color]::FromArgb(255, 19, 0, 38)
$c2 = [System.Drawing.Color]::FromArgb(255, 84, 14, 122)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, $c1, $c2, 45.0)
$g.FillRectangle($brush, $bgRect)
$brush.Dispose()

# 2. Central Golden Radial Glow
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(200, 20, 800, 500)
$pbg = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
$pbg.CenterColor = [System.Drawing.Color]::FromArgb(110, 255, 215, 0)
$pbg.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 84, 14, 122))
$g.FillPath($pbg, $path)
$pbg.Dispose()
$path.Dispose()

# 3. Random Stars
$rand = New-Object System.Random(42)
$starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 255, 255, 220))
for ($i = 0; $i -lt 70; $i++) {
    $sx = $rand.Next(30, 1170)
    $sy = $rand.Next(20, 610)
    $ss = $rand.Next(2, 6)
    $g.FillEllipse($starBrush, $sx, $sy, $ss, $ss)
}
$starBrush.Dispose()

# 4. Accent Strip Left
$stripBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 215, 0))
$g.FillRectangle($stripBrush, 0, 0, 10, $height)
$stripBrush.Dispose()

# 5. Top Left Logo: SIÊU GHÉP THẺ
$logoFont = New-Object System.Drawing.Font("Arial Black", 46, [System.Drawing.FontStyle]::Bold)
$logoShadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 0, 0, 0))
$logoBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 223, 0))
$g.DrawString("SIÊU GHÉP THẺ", $logoFont, $logoShadowBrush, 54, 44)
$g.DrawString("SIÊU GHÉP THẺ", $logoFont, $logoBrush, 50, 40)
$logoFont.Dispose()
$logoShadowBrush.Dispose()
$logoBrush.Dispose()

# Subtitle logo
$subLogoFont = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Regular)
$subLogoBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 255, 255, 255))
$g.DrawString("game-ghep-the-vui.blogspot.com", $subLogoFont, $subLogoBrush, 55, 115)
$subLogoFont.Dispose()
$subLogoBrush.Dispose()

# 6. Central Crown Emoticon / Graphic
$crownFont = New-Object System.Drawing.Font("Segoe UI Emoji", 68, [System.Drawing.FontStyle]::Bold)
$crownBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Gold)
$sfCenter = New-Object System.Drawing.StringFormat
$sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString([char]::ConvertFromUtf32(0x1F451), $crownFont, $crownBrush, 600, 110, $sfCenter)
$crownFont.Dispose()
$crownBrush.Dispose()

# 7. Ribbon: MÀN 7: HUYỀN THOẠI
$ribbonRect = New-Object System.Drawing.Rectangle(0, 230, $width, 86)
$rc1 = [System.Drawing.Color]::FromArgb(255, 184, 134, 11)
$rc2 = [System.Drawing.Color]::FromArgb(255, 255, 225, 80)
$rBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($ribbonRect, $rc1, $rc2, 0.0)
$g.FillRectangle($rBrush, $ribbonRect)
$rBrush.Dispose()

# Ribbon Borders
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 255, 255, 255), 3)
$g.DrawLine($borderPen, 0, 230, $width, 230)
$g.DrawLine($borderPen, 0, 316, $width, 316)
$borderPen.Dispose()

# Ribbon Text
$titleFont = New-Object System.Drawing.Font("Arial Black", 42, [System.Drawing.FontStyle]::Bold)
$titleShadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(150, 255, 255, 255))
$titleTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 26, 0, 48))
$g.DrawString("MÀN 7: HUYỀN THOẠI", $titleFont, $titleShadowBrush, 602, 246, $sfCenter)
$g.DrawString("MÀN 7: HUYỀN THOẠI", $titleFont, $titleTextBrush, 600, 244, $sfCenter)
$titleFont.Dispose()
$titleShadowBrush.Dispose()
$titleTextBrush.Dispose()

# 8. Subtitle Taunt
$tauntFont = New-Object System.Drawing.Font("Arial", 25, [System.Drawing.FontStyle]::Bold)
$tauntBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 230, 120))
$g.DrawString("0.1% - KHÔNG THỂ CHINH PHỤC???", $tauntFont, $tauntBrush, 600, 335, $sfCenter)
$tauntFont.Dispose()
$tauntBrush.Dispose()

# 9. Stat Badges Box
$boxRect = New-Object System.Drawing.Rectangle(180, 385, 840, 80)
$boxBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(140, 0, 0, 0))
$g.FillRectangle($boxBrush, $boxRect)
$boxBrush.Dispose()

$labelFont = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Regular)
$valFont = New-Object System.Drawing.Font("Arial Black", 22, [System.Drawing.FontStyle]::Bold)
$lblBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 255, 255, 255))
$goldValBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Gold)
$whiteValBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$redValBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 100, 100))

# Col 1: ĐỘ HIẾM
$g.DrawString("ĐỘ HIẾM", $labelFont, $lblBrush, 320, 395, $sfCenter)
$g.DrawString("HUYỀN THOẠI", $valFont, $goldValBrush, 320, 425, $sfCenter)

# Col 2: THỬ THÁCH
$g.DrawString("THỬ THÁCH", $labelFont, $lblBrush, 600, 395, $sfCenter)
$g.DrawString("5 TẦNG THẺ", $valFont, $whiteValBrush, 600, 425, $sfCenter)

# Col 3: NGƯỜI VƯỢT QUA
$g.DrawString("NGƯỜI VƯỢT QUA", $labelFont, $lblBrush, 880, 395, $sfCenter)
$g.DrawString("CHỈ 0.1%", $valFont, $redValBrush, 880, 425, $sfCenter)

$labelFont.Dispose()
$valFont.Dispose()
$lblBrush.Dispose()
$goldValBrush.Dispose()
$whiteValBrush.Dispose()
$redValBrush.Dispose()

# 10. CTA Button: CHƠI NGAY MIỄN PHÍ!
$ctaRect = New-Object System.Drawing.Rectangle(360, 490, 480, 74)
$cb1 = [System.Drawing.Color]::FromArgb(255, 255, 107, 0)
$cb2 = [System.Drawing.Color]::FromArgb(255, 255, 170, 0)
$ctaBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($ctaRect, $cb1, $cb2, 0.0)
$g.FillRectangle($ctaBrush, $ctaRect)
$ctaBrush.Dispose()

$ctaPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(150, 255, 255, 255), 2)
$g.DrawRectangle($ctaPen, $ctaRect)
$ctaPen.Dispose()

$ctaFont = New-Object System.Drawing.Font("Arial Black", 26, [System.Drawing.FontStyle]::Bold)
$ctaTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.DrawString("CHƠI NGAY MIỄN PHÍ!", $ctaFont, $ctaTextBrush, 600, 508, $sfCenter)
$ctaFont.Dispose()
$ctaTextBrush.Dispose()

# Bottom footer hint
$hintFont = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Regular)
$hintBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 255, 255, 255))
$g.DrawString("Thử thách trí tuệ cực hạn - Không cần cài đặt", $hintFont, $hintBrush, 600, 582, $sfCenter)
$hintFont.Dispose()
$hintBrush.Dispose()
$sfCenter.Dispose()

# 11. Save as JPG (Quality = 92)
$destPath = "D:\TuanNH\MyApp\MiniGame\GameGhepThe\banners\level7.jpg"
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)

$bmp.Save($destPath, $encoder, $encoderParams)

$g.Dispose()
$bmp.Dispose()
Write-Host "✅ Created level7.jpg successfully: $destPath"
