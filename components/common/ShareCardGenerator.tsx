'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { Download, Share2, Sparkles, Check } from 'lucide-react';
import { THEMES } from '@/lib/themes';
import { ThemeType } from '@/types/experience';
import { sfx } from '@/lib/audio';
import { APP_BASE_URL, APP_DOMAIN, getAppUrl } from '@/lib/config';

interface ShareCardGeneratorProps {
  names: string;
  title: string;
  subtitle: string;
  theme?: ThemeType;
  url: string;
  badge?: string;
}

export default function ShareCardGenerator({
  names,
  title,
  subtitle,
  theme = 'romantic',
  url,
  badge = 'SPECIAL LOVE EXPERIENCE',
}: ShareCardGeneratorProps) {
  const [selectedLayout, setSelectedLayout] = useState<'romantic' | 'valentine' | 'minimal' | 'neon' | 'elegant' | 'cute'>('romantic');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const activeTheme: ThemeType = 
    selectedLayout === 'neon' ? 'pink_glow' :
    selectedLayout === 'minimal' ? 'minimal' :
    selectedLayout === 'valentine' ? 'valentine' :
    selectedLayout === 'cute' ? 'cute' :
    selectedLayout === 'elegant' ? 'dreamy' : 'romantic';

  const renderCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Card dimensions: 1080 x 1080 (Instagram / Social square standard)
    const w = (canvas.width = 1080);
    const h = (canvas.height = 1080);

    const themeConfig = THEMES[activeTheme] || THEMES.romantic;


    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    if (theme === 'valentine') {
      bgGrad.addColorStop(0, '#22030d');
      bgGrad.addColorStop(0.5, '#3b0819');
      bgGrad.addColorStop(1, '#110107');
    } else if (theme === 'dark_love') {
      bgGrad.addColorStop(0, '#060205');
      bgGrad.addColorStop(0.5, '#190616');
      bgGrad.addColorStop(1, '#020002');
    } else if (theme === 'cute') {
      bgGrad.addColorStop(0, '#22102b');
      bgGrad.addColorStop(0.5, '#381647');
      bgGrad.addColorStop(1, '#15061c');
    } else if (theme === 'pink_glow') {
      bgGrad.addColorStop(0, '#26042b');
      bgGrad.addColorStop(0.5, '#450a4e');
      bgGrad.addColorStop(1, '#120215');
    } else if (theme === 'dreamy') {
      bgGrad.addColorStop(0, '#1c0c29');
      bgGrad.addColorStop(0.5, '#331245');
      bgGrad.addColorStop(1, '#100619');
    } else if (theme === 'minimal') {
      bgGrad.addColorStop(0, '#11141b');
      bgGrad.addColorStop(0.5, '#1e2430');
      bgGrad.addColorStop(1, '#0b0c10');
    } else {
      // romantic default
      bgGrad.addColorStop(0, '#1c0813');
      bgGrad.addColorStop(0.5, '#300a20');
      bgGrad.addColorStop(1, '#0e030a');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Soft atmospheric glows
    const orbGrad = ctx.createRadialGradient(w / 2, h / 3, 20, w / 2, h / 3, 480);
    orbGrad.addColorStop(0, themeConfig.glowColor.replace('0.4', '0.35'));
    orbGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = orbGrad;
    ctx.fillRect(0, 0, w, h);

    // 3. Stardust / floating decorative hearts in background
    ctx.save();
    for (let i = 0; i < 40; i++) {
      const rx = (i * 243) % w;
      const ry = (i * 387) % h;
      const rSize = (i % 5) + 2;
      ctx.beginPath();
      ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.15 + (i % 4) * 0.1;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#fda4af';
      ctx.fill();
    }
    ctx.restore();

    // 4. Inner frosted container
    const m = 64;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(251, 113, 133, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(m, m, w - m * 2, h - m * 2, 48);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 5. Header: Lover logo + Badge
    ctx.save();
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('❤️  LOVER', m + 48, m + 72);

    ctx.font = '600 20px sans-serif';
    ctx.fillStyle = '#f43f5e';
    ctx.letterSpacing = '2px';
    ctx.fillText(badge.toUpperCase(), m + 48, m + 116);
    ctx.restore();

    // 6. Centerpiece: Names with gold/rose gradient
    ctx.save();
    ctx.textAlign = 'center';
    
    // Names
    const nameGrad = ctx.createLinearGradient(w / 2 - 300, 0, w / 2 + 300, 0);
    nameGrad.addColorStop(0, '#ffffff');
    nameGrad.addColorStop(0.5, '#fecdd3');
    nameGrad.addColorStop(1, '#fda4af');
    ctx.fillStyle = nameGrad;
    ctx.font = 'bold 74px serif';
    ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
    ctx.shadowBlur = 24;
    ctx.fillText(names, w / 2, 360);

    // Title
    ctx.font = '600 42px sans-serif';
    ctx.fillStyle = '#ffe4e6';
    ctx.shadowBlur = 10;
    
    // Word wrap title
    const maxTitleWidth = 800;
    const words = title.split(' ');
    let line = '';
    let currentY = 440;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTitleWidth && n > 0) {
        ctx.fillText(line, w / 2, currentY);
        line = words[n] + ' ';
        currentY += 56;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, w / 2, currentY);

    // Subtitle / message
    ctx.font = '400 28px sans-serif';
    ctx.fillStyle = '#fda4af';
    ctx.shadowBlur = 0;
    const maxSubWidth = 780;
    const subWords = subtitle.split(' ');
    let subLine = '';
    let subY = currentY + 70;
    for (let n = 0; n < Math.min(subWords.length, 30); n++) {
      const testLine = subLine + subWords[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxSubWidth && n > 0) {
        ctx.fillText(subLine, w / 2, subY);
        subLine = subWords[n] + ' ';
        subY += 40;
      } else {
        subLine = testLine;
      }
    }
    ctx.fillText(subLine, w / 2, subY);
    ctx.restore();

    // 7. Render QR Code directly into canvas bottom right
    try {
      const qrCanvas = document.createElement('canvas');
      const targetUrl = url ? getAppUrl(url) : APP_BASE_URL;
      await QRCode.toCanvas(qrCanvas, targetUrl, {
        width: 190,
        margin: 1,
        color: {
          dark: '#1e0a16',
          light: '#ffffff',
        },
      });

      // Draw QR container background
      const qrX = w - m - 240;
      const qrY = h - m - 230;
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(qrX - 10, qrY - 10, 210, 210, 20);
      ctx.fill();
      ctx.drawImage(qrCanvas, qrX, qrY, 190, 190);
      ctx.restore();

      // QR label
      ctx.save();
      ctx.font = '600 20px sans-serif';
      ctx.fillStyle = '#fda4af';
      ctx.fillText('Scan to experience ✨', qrX - 220, qrY + 100);
      ctx.font = '400 18px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('open in camera or browser', qrX - 220, qrY + 130);
      ctx.restore();
    } catch {
      // QR fallback
    }

    // 8. Footer URL stamp
    ctx.save();
    ctx.font = '500 24px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(`${APP_DOMAIN} · personalized love experiences`, m + 48, h - m - 40);
    ctx.restore();
  }, [names, title, subtitle, theme, activeTheme, url, badge]);



  useEffect(() => {
    renderCard();
  }, [renderCard]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    sfx.playChime();

    try {
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `lover-${names.toLowerCase().replace(/[^a-z0-9]/g, '-')}-card.png`;
      link.href = imageUri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        sfx.playPop();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2400);
      });
    } catch {
      // Fallback: download
      handleDownload();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Layout Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-rose-950/40 rounded-xl border border-rose-500/15">
        {[
          { id: 'romantic', label: 'Romantic' },
          { id: 'valentine', label: 'Valentine' },
          { id: 'neon', label: 'Neon Love' },
          { id: 'elegant', label: 'Elegant' },
          { id: 'cute', label: 'Cute' },
          { id: 'minimal', label: 'Minimal' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedLayout(item.id as typeof selectedLayout);
              sfx.playPop();
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedLayout === item.id
                ? 'bg-rose-600 text-white shadow'
                : 'text-rose-300 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Canvas preview (scaled down responsively) */}
      <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-rose-500/30">

        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Action controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Download className="h-4 w-4" />
          <span>{downloading ? 'Preparing...' : 'Download Card (.PNG)'}</span>
        </button>

        <button
          onClick={handleCopyImage}
          className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-sm font-medium text-rose-200 hover:border-rose-400 hover:text-white transition-all active:scale-95"
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-300">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              <span>Copy Card Image</span>
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-rose-400/60 text-center">
        High-resolution 1080×1080 card ready for Instagram, Stories, WhatsApp & print!
      </p>
    </div>
  );
}
