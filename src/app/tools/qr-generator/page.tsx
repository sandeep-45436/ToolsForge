'use client';

import React, { useEffect, useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import QRCode from 'qrcode';
import { QrCode, Download, Link as LinkIcon, Mail, Phone, Wifi, AlignLeft, Palette, Settings } from 'lucide-react';

type QrType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export default function QrGenerator() {
  const [qrType, setQrType] = useState<QrType>('url');
  const [inputText, setInputText] = useState('');
  
  // Custom WiFi states
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');

  // Custom Email states
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Custom Phone state
  const [phoneNumber, setPhoneNumber] = useState('');

  // QR Customizations
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [margin, setMargin] = useState(2);

  // Result state
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [svgBlobUrl, setSvgBlobUrl] = useState<string>('');

  // Helper to compile final raw text for QR encoding based on type
  const getRawText = (): string => {
    switch (qrType) {
      case 'url':
        return inputText.trim() && !/^https?:\/\//i.test(inputText) 
          ? `https://${inputText.trim()}` 
          : inputText.trim();
      case 'text':
        return inputText;
      case 'email':
        if (!emailAddress.trim()) return '';
        return `mailto:${emailAddress.trim()}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        if (!phoneNumber.trim()) return '';
        return `tel:${phoneNumber.trim()}`;
      case 'wifi':
        if (!wifiSsid.trim()) return '';
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
      default:
        return '';
    }
  };

  useEffect(() => {
    const rawText = getRawText();
    if (!rawText) {
      setQrDataUrl('');
      setSvgBlobUrl('');
      return;
    }

    const generateQR = async () => {
      try {
        const options: QRCode.QRCodeToDataURLOptions = {
          margin: margin,
          width: 512,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        };

        // PNG DataURL for image previews
        const url = await QRCode.toDataURL(rawText, options);
        setQrDataUrl(url);

        // SVG String -> Blob URL for high-quality vectors
        const svgString = await QRCode.toString(rawText, {
          ...options,
          type: 'svg',
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(blob);
        setSvgBlobUrl(svgUrl);
      } catch (err) {
        console.error('QR code generation failed:', err);
      }
    };

    generateQR();
  }, [qrType, inputText, wifiSsid, wifiPassword, wifiEncryption, emailAddress, emailSubject, emailBody, phoneNumber, fgColor, bgColor, margin]);

  // Set initial placeholders on load or type change
  useEffect(() => {
    setInputText('');
  }, [qrType]);

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create custom, high-resolution QR codes instantly. Supports URLs, Wi-Fi configuration, email templates, telephone links, and text templates."
      category="qr"
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Settings Panel */}
        <div className="md:col-span-3 space-y-6">
          <div className="border border-card-border bg-card rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* QR Types Selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground block">
                QR Code Type
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { type: 'url', label: 'URL', icon: LinkIcon },
                  { type: 'text', label: 'Text', icon: AlignLeft },
                  { type: 'wifi', label: 'WiFi', icon: Wifi },
                  { type: 'email', label: 'Email', icon: Mail },
                  { type: 'phone', label: 'Phone', icon: Phone },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => setQrType(item.type as QrType)}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-[10px] sm:text-xs font-semibold gap-1.5 transition-all ${
                        qrType === item.type
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-card-border bg-background hover:bg-muted-bg text-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs based on type */}
            <div className="space-y-4">
              
              {/* URL Type */}
              {qrType === 'url' && (
                <div className="space-y-2">
                  <label htmlFor="qr-url" className="text-sm font-semibold text-foreground block">Website URL</label>
                  <input
                    id="qr-url"
                    type="url"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g. google.com or https://toolforge.in"
                    className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              {/* Raw Text Type */}
              {qrType === 'text' && (
                <div className="space-y-2">
                  <label htmlFor="qr-text" className="text-sm font-semibold text-foreground block">Text Message</label>
                  <textarea
                    id="qr-text"
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter message to embed in QR code"
                    className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              {/* Wifi Type */}
              {qrType === 'wifi' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="wifi-ssid" className="text-sm font-semibold text-foreground block">Network Name (SSID)</label>
                      <input
                        id="wifi-ssid"
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        placeholder="My Home WiFi"
                        className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="wifi-pass" className="text-sm font-semibold text-foreground block">Password</label>
                      <input
                        id="wifi-pass"
                        type="password"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground block">Encryption Type</label>
                    <div className="flex gap-4">
                      {['WPA', 'WEP', 'nopass'].map((enc) => (
                        <label key={enc} className="inline-flex items-center gap-1.5 text-sm text-foreground">
                          <input
                            type="radio"
                            name="encryption"
                            value={enc}
                            checked={wifiEncryption === enc}
                            onChange={(e) => setWifiEncryption(e.target.value)}
                            className="accent-primary"
                          />
                          {enc === 'nopass' ? 'None (Open)' : enc}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Email Type */}
              {qrType === 'email' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email-to" className="text-sm font-semibold text-foreground block">Recipient Email</label>
                    <input
                      id="email-to"
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="hello@company.com"
                      className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email-sub" className="text-sm font-semibold text-foreground block">Subject Line</label>
                    <input
                      id="email-sub"
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Feedback about service"
                      className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email-body" className="text-sm font-semibold text-foreground block">Message Body</label>
                    <textarea
                      id="email-body"
                      rows={3}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Compose message..."
                      className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Phone Type */}
              {qrType === 'phone' && (
                <div className="space-y-2">
                  <label htmlFor="phone-num" className="text-sm font-semibold text-foreground block">Phone Number</label>
                  <input
                    id="phone-num"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +14155552671"
                    className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              )}

            </div>
          </div>

          {/* Style Customizer */}
          <div className="border border-card-border bg-card rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-card-border">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Style Options</h3>
                <p className="text-xs text-muted">Customize foreground, background, and breathing buffer</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Foreground */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground block">QR Code Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded border border-card-border cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono uppercase text-muted">{fgColor}</span>
                </div>
              </div>

              {/* Background */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground block">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded border border-card-border cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono uppercase text-muted">{bgColor}</span>
                </div>
              </div>

              {/* Margin */}
              <div className="space-y-2">
                <label htmlFor="margin-slider" className="text-sm font-semibold text-foreground block">Borders (Quiet Zone)</label>
                <input
                  id="margin-slider"
                  type="range"
                  min="0"
                  max="8"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted-bg rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted">
                  <span>Tight (0)</span>
                  <span>Wide (8)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview & Download Panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-card-border bg-card rounded-2xl p-6 shadow-md text-center flex flex-col items-center justify-between min-h-[400px]">
            <div className="w-full pb-4 border-b border-card-border text-left">
              <h3 className="font-bold text-foreground">Live QR Preview</h3>
              <p className="text-xs text-muted">Real-time vector rendering</p>
            </div>

            {/* QR Image Container */}
            <div className="my-8 flex items-center justify-center p-6 bg-white rounded-xl border border-card-border max-w-[240px] max-h-[240px] aspect-square relative shadow-inner">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="QR Code preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-muted">
                  <QrCode className="w-12 h-12 mx-auto mb-2 text-muted/30 animate-pulse" />
                  <p className="text-xs leading-normal">Enter text or URL to generate QR Code</p>
                </div>
              )}
            </div>

            {/* Downloads */}
            <div className="w-full space-y-2">
              <a
                href={qrDataUrl}
                download="qrcode.png"
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm transition-all text-center ${
                  !qrDataUrl ? 'pointer-events-none opacity-40' : 'glow-hover'
                }`}
              >
                <Download className="w-4 h-4" />
                Download PNG (Standard)
              </a>
              <a
                href={svgBlobUrl}
                download="qrcode.svg"
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-muted hover:text-foreground bg-muted-bg border border-card-border hover:border-muted rounded-xl transition-all text-center ${
                  !svgBlobUrl ? 'pointer-events-none opacity-40' : ''
                }`}
              >
                <Download className="w-4 h-4" />
                Download SVG (Vector)
              </a>
            </div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
