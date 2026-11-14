Add-Type -AssemblyName System.Drawing

function Create-GameIcon {
    param(
        [int]$size = 512,
        [string]$outputPath = "D:\TuanNH\MyApp\MiniGame\GameGhepThe\icon_512.png"
    )

    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $scale = $size / 512.0

    # Helper: Draw rounded rectangle
    function Fill-RoundRect($graphics, $brush, $x, $y, $w, $h, $radius) {
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $d = $radius * 2
        $path.AddArc($x, $y, $d, $d, 180, 90)
        $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
        $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
        $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
        $path.CloseFigure()
        $graphics.FillPath($brush, $path)
        $path.Dispose()
    }

    function Draw-RoundRect($graphics, $pen, $x, $y, $w, $h, $radius) {
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $d = $radius * 2
        $path.AddArc($x, $y, $d, $d, 180, 90)
        $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
        $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
        $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
        $path.CloseFigure()
        $graphics.DrawPath($pen, $path)
        $path.Dispose()
    }

    # 1. Background Squircle (Gradient từ Đỏ Cam rực rỡ sang Hồng Tím Cute: #ff4757 -> #ff6b81 -> #6c5ce7)
    $pad = 16 * $scale
    $iconW = $size - ($pad * 2)
    $iconH = $size - ($pad * 2)
    $cornerR = 105 * $scale

    $rectBg = New-Object System.Drawing.Rectangle($pad, $pad, $iconW, $iconH)
    $cTop = [System.Drawing.Color]::FromArgb(255, 255, 71, 87)    # #ff4757 (Đỏ hồng san hô)
    $cBot = [System.Drawing.Color]::FromArgb(255, 108, 92, 231)  # #6c5ce7 (Tím mộng mơ)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rectBg, $cTop, $cBot, 45.0)
    Fill-RoundRect $g $bgBrush $pad $pad $iconW $iconH $cornerR
    $bgBrush.Dispose()

    # Viền bóng bẩy cho squircle
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 255, 255, 255), 4 * $scale)
    Draw-RoundRect $g $borderPen ($pad + 2*$scale) ($pad + 2*$scale) ($iconW - 4*$scale) ($iconH - 4*$scale) ($cornerR - 2*$scale)
    $borderPen.Dispose()

    # Vệt sáng phản chiếu (Glass highlight) nửa trên
    $glassPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $glassPath.AddEllipse($pad - 50*$scale, $pad - 120*$scale, $iconW + 100*$scale, ($iconH * 0.75))
    $glassBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Rectangle(0, 0, $size, $size/2)),
        [System.Drawing.Color]::FromArgb(70, 255, 255, 255),
        [System.Drawing.Color]::FromArgb(0, 255, 255, 255),
        90.0
    )
    $g.SetClip((New-Object System.Drawing.Region($rectBg)))
    $g.FillPath($glassBrush, $glassPath)
    $g.ResetClip()
    $glassBrush.Dispose()
    $glassPath.Dispose()

    # 2. Ngôi sao vàng phát sáng ở góc
    $starFont = New-Object System.Drawing.Font("Segoe UI Emoji", 26 * $scale, [System.Drawing.FontStyle]::Bold)
    $starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Gold)
    $g.DrawString([char]::ConvertFromUtf32(0x2728), $starFont, $starBrush, (380 * $scale), (45 * $scale))
    $g.DrawString([char]::ConvertFromUtf32(0x2B50), $starFont, $starBrush, (55 * $scale), (360 * $scale))
    $starFont.Dispose()
    $starBrush.Dispose()

    # 3. Ba thẻ bài game xếp tầng (Match-3 Layer Stacking Cards)
    # Thẻ chuẩn: rộng 140, cao 160, bo góc 24
    $tw = 142 * $scale
    $th = 162 * $scale
    $tr = 22 * $scale

    # Hàm vẽ 1 thẻ bài 3D có bóng và đáy thẻ
    function Draw-GameTile($x, $y, $emojiCode, $isCrown = $false, $angle = 0) {
        $state = $g.Save()
        if ($angle -ne 0) {
            $g.TranslateTransform($x + $tw/2, $y + $th/2)
            $g.RotateTransform($angle)
            $g.TranslateTransform(-($x + $tw/2), -($y + $th/2))
        }

        # Đổ bóng thẻ
        $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(90, 0, 0, 0))
        Fill-RoundRect $g $shadowBrush ($x + 2*$scale) ($y + 12*$scale) $tw $th $tr
        $shadowBrush.Dispose()

        # Phần đế 3D dưới thẻ (màu xám xanh hoặc cam nhạt)
        $baseBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 220, 225, 235))
        Fill-RoundRect $g $baseBrush $x ($y + 8*$scale) $tw $th $tr
        $baseBrush.Dispose()

        # Mặt trên thẻ (màu trắng tinh khôi)
        $faceRect = New-Object System.Drawing.Rectangle($x, $y, $tw, $th)
        $fTop = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)
        $fBot = [System.Drawing.Color]::FromArgb(255, 245, 247, 252)
        $faceBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($faceRect, $fTop, $fBot, 90.0)
        Fill-RoundRect $g $faceBrush $x $y $tw $th $tr
        $faceBrush.Dispose()

        # Viền thẻ: Nếu là thẻ Crown đỉnh thì viền VÀNG lấp lánh, còn lại viền xanh nhạt
        if ($isCrown) {
            $tPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 200, 0), 4 * $scale)
            Draw-RoundRect $g $tPen ($x + 1*$scale) ($y + 1*$scale) ($tw - 2*$scale) ($th - 2*$scale) $tr
            $tPen.Dispose()
        } else {
            $tPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 230, 235, 245), 2.5 * $scale)
            Draw-RoundRect $g $tPen ($x + 1*$scale) ($y + 1*$scale) ($tw - 2*$scale) ($th - 2*$scale) $tr
            $tPen.Dispose()
        }

        # Vẽ Icon / Emoji bên trong thẻ
        $fontSize = if ($isCrown) { 62 * $scale } else { 54 * $scale }
        $eFont = New-Object System.Drawing.Font("Segoe UI Emoji", $fontSize, [System.Drawing.FontStyle]::Bold)
        $eBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
        
        $textYOffset = if ($isCrown) { 2 * $scale } else { 0 }
        $g.DrawString($emojiCode, $eFont, $eBrush, ($x + $tw/2), ($y + $th/2 - $textYOffset), $sf)
        
        $eFont.Dispose()
        $eBrush.Dispose()
        $sf.Dispose()

        $g.Restore($state)
    }

    # Thẻ 1: Bên trái hơi nghiêng (Dưa hấu 🍉 hoặc Phở 🍜)
    Draw-GameTile (100 * $scale) (210 * $scale) ([char]::ConvertFromUtf32(0x1F349)) $false -14

    # Thẻ 2: Bên phải hơi nghiêng (Cún cute 🐶 hoặc Trà sữa 🧋)
    Draw-GameTile (270 * $scale) (210 * $scale) ([char]::ConvertFromUtf32(0x1F436)) $false 14

    # Thẻ 3: ĐÈ LÊN TRÊN CÙNG Ở GIỮA (Vương miện vàng 👑 lung linh)
    Draw-GameTile (185 * $scale) (130 * $scale) ([char]::ConvertFromUtf32(0x1F451)) $true 0

    # 4. Ribbon chữ nhỏ bên dưới: "SIÊU GHÉP" hoặc "3 TILES"
    $ribW = 320 * $scale
    $ribH = 68 * $scale
    $ribX = ($size - $ribW) / 2
    $ribY = 395 * $scale

    # Bóng râm ribbon
    $ribShadow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 0, 0, 0))
    Fill-RoundRect $g $ribShadow ($ribX + 2*$scale) ($ribY + 6*$scale) $ribW $ribH (18 * $scale)
    $ribShadow.Dispose()

    # Nền ribbon vàng óng
    $rRect = New-Object System.Drawing.Rectangle($ribX, $ribY, $ribW, $ribH)
    $rc1 = [System.Drawing.Color]::FromArgb(255, 255, 215, 0)
    $rc2 = [System.Drawing.Color]::FromArgb(255, 255, 140, 0)
    $ribBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rRect, $rc1, $rc2, 0.0)
    Fill-RoundRect $g $ribBrush $ribX $ribY $ribW $ribH (18 * $scale)
    $ribBrush.Dispose()

    $ribPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 255, 255, 255), 2.5 * $scale)
    Draw-RoundRect $g $ribPen ($ribX + 1) ($ribY + 1) ($ribW - 2) ($ribH - 2) (18 * $scale)
    $ribPen.Dispose()

    # Text ribbon: "GHÉP THẺ"
    $ribFont = New-Object System.Drawing.Font("Arial Black", (24 * $scale), [System.Drawing.FontStyle]::Bold)
    $rTextShadow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(140, 100, 40, 0))
    $rTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $sfR = New-Object System.Drawing.StringFormat
    $sfR.Alignment = [System.Drawing.StringAlignment]::Center
    $sfR.LineAlignment = [System.Drawing.StringAlignment]::Center

    $g.DrawString("GHÉP THẺ", $ribFont, $rTextShadow, ($ribX + $ribW/2 + 2*$scale), ($ribY + $ribH/2 + 2*$scale), $sfR)
    $g.DrawString("GHÉP THẺ", $ribFont, $rTextBrush, ($ribX + $ribW/2), ($ribY + $ribH/2), $sfR)

    $ribFont.Dispose()
    $rTextShadow.Dispose()
    $rTextBrush.Dispose()
    $sfR.Dispose()

    # 5. Lưu ảnh PNG
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created: $outputPath"
}

# Tạo icon chuẩn 512x512
Create-GameIcon -size 512 -outputPath "D:\TuanNH\MyApp\MiniGame\GameGhepThe\icon_512.png"

# Tạo favicon tối ưu 128x128 (đảm bảo siêu nhẹ < 100KB theo quy định của Blogger)
Create-GameIcon -size 128 -outputPath "D:\TuanNH\MyApp\MiniGame\GameGhepThe\favicon.png"

# Tạo icon 64x64
Create-GameIcon -size 64 -outputPath "D:\TuanNH\MyApp\MiniGame\GameGhepThe\favicon_64.png"
