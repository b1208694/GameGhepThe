$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class IconGenerator {
    private static void FillRoundRect(Graphics g, Brush brush, float x, float y, float w, float h, float radius) {
        using (GraphicsPath path = new GraphicsPath()) {
            float d = radius * 2;
            path.AddArc(x, y, d, d, 180, 90);
            path.AddArc(x + w - d, y, d, d, 270, 90);
            path.AddArc(x + w - d, y + h - d, d, d, 0, 90);
            path.AddArc(x, y + h - d, d, d, 90, 90);
            path.CloseFigure();
            g.FillPath(brush, path);
        }
    }

    private static void DrawRoundRect(Graphics g, Pen pen, float x, float y, float w, float h, float radius) {
        using (GraphicsPath path = new GraphicsPath()) {
            float d = radius * 2;
            path.AddArc(x, y, d, d, 180, 90);
            path.AddArc(x + w - d, y, d, d, 270, 90);
            path.AddArc(x + w - d, y + h - d, d, d, 0, 90);
            path.AddArc(x, y + h - d, d, d, 90, 90);
            path.CloseFigure();
            g.DrawPath(pen, path);
        }
    }

    public static void Generate(int size, string outputPath) {
        using (Bitmap bmp = new Bitmap(size, size))
        using (Graphics g = Graphics.FromImage(bmp)) {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAliasGridFit;

            float s = size / 512f;

            // 1. Nền Squircle App Icon: Gradient Hồng San Hô -> Tím Sang Trọng
            float pad = 16f * s;
            float iconW = size - (pad * 2);
            float iconH = size - (pad * 2);
            float cornerR = 108f * s;

            RectangleF rectBg = new RectangleF(pad, pad, iconW, iconH);
            Color cTop = Color.FromArgb(255, 255, 75, 90);    // Đỏ san hô
            Color cBot = Color.FromArgb(255, 108, 92, 231);  // Tím mộng mơ
            using (LinearGradientBrush bgBrush = new LinearGradientBrush(rectBg, cTop, cBot, 45f)) {
                FillRoundRect(g, bgBrush, pad, pad, iconW, iconH, cornerR);
            }

            // Viền bóng bẩy mờ
            using (Pen borderPen = new Pen(Color.FromArgb(90, 255, 255, 255), 3.5f * s)) {
                DrawRoundRect(g, borderPen, pad + 1.5f * s, pad + 1.5f * s, iconW - 3f * s, iconH - 3f * s, cornerR - 1.5f * s);
            }

            // Ánh sáng phản chiếu nửa trên (Glass shine)
            using (GraphicsPath clipPath = new GraphicsPath()) {
                float d = cornerR * 2;
                clipPath.AddArc(pad, pad, d, d, 180, 90);
                clipPath.AddArc(pad + iconW - d, pad, d, d, 270, 90);
                clipPath.AddArc(pad + iconW - d, pad + iconH - d, d, d, 0, 90);
                clipPath.AddArc(pad, pad + iconH - d, d, d, 90, 90);
                clipPath.CloseFigure();
                g.SetClip(clipPath);

                using (GraphicsPath shinePath = new GraphicsPath()) {
                    shinePath.AddEllipse(pad - 60f * s, pad - 120f * s, iconW + 120f * s, iconH * 0.72f);
                    using (LinearGradientBrush shineBrush = new LinearGradientBrush(
                        new RectangleF(0, 0, size, size / 2f),
                        Color.FromArgb(75, 255, 255, 255),
                        Color.FromArgb(0, 255, 255, 255),
                        90f)) {
                        g.FillPath(shineBrush, shinePath);
                    }
                }
                g.ResetClip();
            }

            // 2. Các hạt sao lấp lánh ở góc
            using (Font starFont = new Font("Segoe UI Emoji", 26f * s, FontStyle.Bold))
            using (Brush starBrush = new SolidBrush(Color.FromArgb(240, 255, 215, 0))) {
                g.DrawString("\u2728", starFont, starBrush, 385f * s, 42f * s);
                g.DrawString("\u2B50", starFont, starBrush, 52f * s, 365f * s);
            }

            // 3. Ba thẻ bài xếp lớp Match-3 (Layer Stacking)
            float tw = 142f * s;
            float th = 162f * s;
            float tr = 22f * s;

            Action<float, float, string, bool, float> drawCard = (x, y, emoji, isCrown, angle) => {
                GraphicsState state = g.Save();
                if (angle != 0) {
                    g.TranslateTransform(x + tw / 2, y + th / 2);
                    g.RotateTransform(angle);
                    g.TranslateTransform(-(x + tw / 2), -(y + th / 2));
                }

                // Bóng râm đáy thẻ
                using (Brush shadowBrush = new SolidBrush(Color.FromArgb(90, 0, 0, 0))) {
                    FillRoundRect(g, shadowBrush, x + 2f * s, y + 10f * s, tw, th, tr);
                }

                // Đế 3D thẻ
                using (Brush baseBrush = new SolidBrush(Color.FromArgb(255, 222, 226, 235))) {
                    FillRoundRect(g, baseBrush, x, y + 7f * s, tw, th, tr);
                }

                // Mặt thẻ trắng gradient
                RectangleF fRect = new RectangleF(x, y, tw, th);
                using (LinearGradientBrush faceBrush = new LinearGradientBrush(
                    fRect,
                    Color.FromArgb(255, 255, 255, 255),
                    Color.FromArgb(255, 245, 248, 253),
                    90f)) {
                    FillRoundRect(g, faceBrush, x, y, tw, th, tr);
                }

                // Viền thẻ
                Color borderC = isCrown ? Color.FromArgb(255, 255, 205, 0) : Color.FromArgb(180, 225, 232, 242);
                float borderW = isCrown ? 4.5f * s : 2.5f * s;
                using (Pen cardPen = new Pen(borderC, borderW)) {
                    DrawRoundRect(g, cardPen, x + 1f * s, y + 1f * s, tw - 2f * s, th - 2f * s, tr);
                }

                // Biểu tượng bên trong thẻ
                float fSize = isCrown ? 58f * s : 50f * s;
                using (Font eFont = new Font("Segoe UI Emoji", fSize, FontStyle.Bold))
                using (Brush eBrush = new SolidBrush(Color.Black))
                using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center }) {
                    g.DrawString(emoji, eFont, eBrush, x + tw / 2, y + th / 2, sf);
                }

                g.Restore(state);
            };

            // Thẻ trái (Dưa hấu 🍉) nghiêng -13 độ
            drawCard(105f * s, 215f * s, "\uD83C\uDF49", false, -13f);

            // Thẻ phải (Cún con 🐶) nghiêng +13 độ
            drawCard(265f * s, 215f * s, "\uD83D\uDC36", false, 13f);

            // Thẻ giữa ĐỈNH (Vương miện vàng 👑) thẳng đứng, viền vàng rực rỡ
            drawCard(185f * s, 130f * s, "\uD83D\uDC51", true, 0f);

            // 4. Ribbon vàng nhũ ở góc dưới: "GHÉP THẺ"
            float ribW = 320f * s;
            float ribH = 68f * s;
            float ribX = (size - ribW) / 2;
            float ribY = 398f * s;

            // Bóng ribbon
            using (Brush rShadow = new SolidBrush(Color.FromArgb(90, 0, 0, 0))) {
                FillRoundRect(g, rShadow, ribX + 2f * s, ribY + 6f * s, ribW, ribH, 18f * s);
            }

            // Nền ribbon vàng kim
            RectangleF rRect = new RectangleF(ribX, ribY, ribW, ribH);
            using (LinearGradientBrush ribBrush = new LinearGradientBrush(
                rRect,
                Color.FromArgb(255, 255, 215, 0),
                Color.FromArgb(255, 255, 140, 0),
                0f)) {
                FillRoundRect(g, ribBrush, ribX, ribY, ribW, ribH, 18f * s);
            }

            // Viền ánh kim ribbon
            using (Pen rPen = new Pen(Color.FromArgb(220, 255, 255, 255), 2.5f * s)) {
                DrawRoundRect(g, rPen, ribX + 1, ribY + 1, ribW - 2, ribH - 2, 18f * s);
            }

            // Text "GHÉP THẺ"
            using (Font ribFont = new Font("Arial Black", 23f * s, FontStyle.Bold))
            using (Brush textShadow = new SolidBrush(Color.FromArgb(140, 100, 40, 0)))
            using (Brush textBrush = new SolidBrush(Color.White))
            using (StringFormat sfR = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center }) {
                g.DrawString("GHÉP THẺ", ribFont, textShadow, ribX + ribW / 2 + 2f * s, ribY + ribH / 2 + 2f * s, sfR);
                g.DrawString("GHÉP THẺ", ribFont, textBrush, ribX + ribW / 2, ribY + ribH / 2, sfR);
            }

            bmp.Save(outputPath, ImageFormat.Png);
        }
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies System.Drawing

[IconGenerator]::Generate(512, "D:\TuanNH\MyApp\MiniGame\GameGhepThe\icon_512.png")
[IconGenerator]::Generate(128, "D:\TuanNH\MyApp\MiniGame\GameGhepThe\favicon.png")
[IconGenerator]::Generate(64,  "D:\TuanNH\MyApp\MiniGame\GameGhepThe\favicon_64.png")

Write-Host "SUCCESS: Generated all 3 icons!"
