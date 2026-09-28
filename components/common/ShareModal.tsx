'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send, QrCode, Image as ImageIcon } from 'lucide-react';
import QRCode from 'qrcode';
import { sfx } from '@/lib/audio';
import { ThemeType } from '@/types/experience';
import ShareCardGenerator from './ShareCardGenerator';
import { getAppUrl } from '@/lib/config';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  names: string;
  subtitle?: string;
  theme?: ThemeType;
}

export default function ShareModal({
  isOpen,
  onClose,
  url,
  title,
  names,
  subtitle = 'A personalized romantic experience created just for you ❤️',
  theme = 'romantic',
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'links' | 'card'>('links');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const fullUrl = getAppUrl(url);


  useEffect(() => {
    if (fullUrl) {
      QRCode.toDataURL(fullUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: '#e11d48',
          light: '#0b070c',
        },
      }).then(setQrDataUrl).catch(() => {});
    }
  }, [fullUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    sfx.playPop();
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} - ${subtitle}`,
          url: fullUrl,
        });
        sfx.playChime();
      } catch {
        // cancelled
      }
    } else {
      handleCopy();
    }
  };

  const shareText = encodeURIComponent(`${title} ✨ Tap to open our special link: `);
  const shareEncodedUrl = encodeURIComponent(fullUrl);

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-500',
      href: `https://api.whatsapp.com/send?text=${shareText}${shareEncodedUrl}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-600 hover:bg-sky-500',
      href: `https://t.me/share/url?url=${shareEncodedUrl}&text=${shareText}`,
    },
    {
      name: 'X (Twitter)',
      icon: Share2,
      color: 'bg-slate-800 hover:bg-slate-700',
      href: `https://twitter.com/intent/tweet?url=${shareEncodedUrl}&text=${shareText}`,
    },
    {
      name: 'Facebook',
      icon: Share2,
      color: 'bg-blue-600 hover:bg-blue-500',
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareEncodedUrl}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-rose-500/25 bg-[#140a17]/95 p-6 shadow-2xl backdrop-blur-2xl text-rose-50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-rose-300 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close share modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 shadow-lg shadow-rose-600/30">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">Share Your Love Experience</h3>
          <p className="mt-1 text-xs text-rose-300/70">
            Send this unique link or save a photo card for social media
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-rose-950/40 rounded-xl mb-5 border border-rose-500/15">
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'links'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-rose-300 hover:text-white'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Instant Link & QR</span>
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'card'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-rose-300 hover:text-white'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Share Card & Poster</span>
          </button>
        </div>

        {activeTab === 'links' ? (
          <div className="space-y-5">
            {/* Copyable URL Bar */}
            <div>
              <label className="block text-xs font-medium text-rose-300/80 mb-1.5">
                Shareable Unique Link
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-2">
                <input
                  type="text"
                  readOnly
                  value={fullUrl}
                  className="flex-1 bg-transparent px-2 text-xs text-white focus:outline-none select-all truncate"
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-500 active:scale-95 transition-all whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Native Share button */}
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <Share2 className="h-4 w-4" />
              <span>Send via Phone Apps / Share Menu</span>
            </button>

            {/* Quick Social Icons */}
            <div>
              <span className="block text-xs font-medium text-rose-300/70 mb-2">
                One-Click Messenger & Socials:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-medium text-white shadow transition-all active:scale-95 ${s.color}`}
                  >
                    <s.icon className="h-4 w-4" />
                    <span>{s.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* QR Code quick preview */}
            {qrDataUrl && (
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-rose-950/20 border border-rose-500/15">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-200 mb-2">
                  <QrCode className="h-4 w-4 text-rose-400" />
                  <span>Scan to open instantly</span>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt="Experience QR Code" className="w-32 h-32" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-1">
            <ShareCardGenerator
              names={names}
              title={title}
              subtitle={subtitle}
              theme={theme}
              url={fullUrl}
            />
          </div>
        )}
      </div>
    </div>
  );
}
