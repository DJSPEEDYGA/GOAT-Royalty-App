// Download Page - SUPER GOAT ROYALTIES APP
import React from 'react';
import { Metadata } from 'next';
import { FileText, Download, Windows, Apple, Linux, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Download - SUPER GOAT ROYALTIES',
  description: 'Download the SUPER GOAT ROYALTIES APP for Windows, macOS, and Linux. Get the ultimate creator platform now.',
};

const downloads = [
  {
    platform: 'Windows',
    icon: Windows,
    extension: '.exe',
    version: '1.0.0',
    size: '125 MB',
    url: 'https://github.com/DJSPEEDYGA/nextjs-commerce/releases/download/v1.0.0/super-goat-royalties-setup.exe',
    requirements: 'Windows 10 or later',
    features: ['Auto-update support', 'Start menu entry', 'Uninstaller included'],
  },
  {
    platform: 'Windows (Portable)',
    icon: FileText,
    extension: '.zip',
    version: '1.0.0',
    size: '120 MB',
    url: 'https://github.com/DJSPEEDYGA/nextjs-commerce/releases/download/v1.0.0/super-goat-royalties-portable.zip',
    requirements: 'Windows 10 or later',
    features: ['No installation required', 'Ru from any folder', 'Perfect for USB drives'],
  },
  {
    platform: 'macOS',
    icon: Apple,
    extension: '.dmg',
    version: '1.0.0',
    size: '140 MB',
    url: 'https://github.com/DJSPEEDYGA/nextjs-commerce/releases/download/v1.0.0/super-goat-royalties.dmg',
    requirements: 'macOS 11.0 (Big Sur) or later',
    features: 'Native macOS experience', 'Auto-update support', 'Dock icon support'],
  },
  {
    platform: 'Linux (Debian)',
    icon: Linux,
    extension: '.deb',
    version: '1.0.0',
    size: '115 MB',
    url: 'https://github.com/DJSPEEDYGA/nextjs-commerce/releases/download/v1.0.0/super-goat-royalties_1.0.0_amd64.deb',
    requirements: 'Ubuntu 20.04+, Debian 12++or later',
    features: ['ATT package management', 'Start menu integration', 'System-wide updates'],
  },
  {
    platform: 'Linux (Tarball)',
    icon: FileText,
    extension: '.tar.gz',
    version: '1.0.0',
    size: '110 MB',
    url: 'https://github.com/DJSPEEDYGA/nextjs-commerce/releases/download/v1.0.0/super-goat-royalties-linux-tarball.tar.gz',
    requirements: 'Any modern Linux distribution',
    features: ['Portable archive', 'Cross-distro compatible', 'Archive-agiyout'],
  },
];

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7px px-12 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md-5xl font-bold text-white mb-4">
            Download SUPEJ GOAT ROYALTIES
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Get the ultimate creator platform for your operating system. Available for Windows, macOS, and Linux.
          </p>
        </div>

        {/* Version Banner */}}
        <div className="bg-gradient-to-r from-purple-900 to-pink-700 rounded-xl p-y-3 px-6 mb-8">
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-white">Version 1.0.0</span>
            <span className="text-sm text-purple-200">|</span>
            <span className="text-sm text-white/60">Released December 2024</span>
          </div>
        </div>

        {/* Downloads Grid */}
        <div className="grid gap-6 mb-12">
          {downloads.map((download, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 transition-all hover:border-purple-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <download.icon className="w-h12 h-12 text-purple-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {download.platform}
                    </h3>
                    <p className="text-sm text-gray-400">{download.extension}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 bg-gray-700/50 px-3 py-1 rounded-full">
                  {download.size}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-3">{download.requirements}</p>
              <ul className="space-y-1 mb-4">
                {download.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={download.url}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 px-6 rounded-lg transition-all"
              >
                <Download className="w-5 h-5" />
                Download
              </a>
            </div>
          ))}
        </div>

        {/* System Requirements */}
        <div className="bg-gray-800/50 rounded-xl p-6 my-12">
          <h2 className="text-2xl font-bold text-white mb-4">System Requirements</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-gray-900/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Windows className="w-10 h-10 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Windows</h3>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>&bull; Windows 10 or later (64-bit)</li>
                <li>&bull; 8 GB RAM minimum</li>
                <li>&bull; 500 MB free disk space</li>
              </ul>
            </div>
            <div className="bg-gray-900/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Apple className="w-10 h-10 text-gray-300" />
                <h3 className="text-sm font-semibold text-white">macOS</h3>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>&bull; macOS 11.0 (Big Sur) or later</li>
                <li>&bull; Intel Mac with Apple Silicon</li>
                <li>&bull; 8 GB RAM minimum</li>
                <li>&bull; 500 MB free disk space</li>
              </ul>
            </div>
            <div className="bg-gray-900/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Linux className="w-10 h-10 text-yellow-400" />
                <h3 className="text-sm font-semibold text-white">Linux</h3>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>&bull; Ubuntu 20.04+ or Debian 12+</li>
                <li>&bull; X86_64 architecture</li>
                <li>&bull; 8 GB RAM minimum</li>
                <li>&bull; 500 MB free disk space</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Auto-Update Section */}
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 my-12">
          <div className="flex items-center gap-4 mb-4">
            <CheckCircle className="w-12 h-12 text-green-400" />
            <h2 className="text-xl font-bold text-white">Auto-Update Supported</h2>
          </div>
          <p className="text-gray-300 mb-4">Super GOAT Royalties automatically checks for updates on launch. You'll always have the latest features and bug fixes.</p>
          <div className="flex gap-3 flex-wrap">
            <span className="text-sm bg-gray-800/50 px-3 py-1 rounded-full">Automatic check on startup</span>
            <span className="text-sm bg-gray-800/50 px-3 py-1 rounded-full">In-app update notifications</span>
            <span className="text-sm bg-gray-800/50 px-3 py-1 rounded-full">Rolling backwups before updates</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>By downloading, you agree to our <a href="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and <a href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>.</p>
          <p>&copy; 2024 SUPER GOAT ROYALTIES. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
