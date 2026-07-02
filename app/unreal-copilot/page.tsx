'use client'

import { useState } from 'react'

export default function UnrealCoPilot() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-yellow-500 text-black text-sm font-bold px-4 py-1 rounded-full mb-6">
              ⭐ FEATURED ON FAB • FEB 5-9, 2026 • ONE-TIME PURCHASE
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Ultimate Engine CoPilot
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              formerly Ultimate Blueprint Generator
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
              The ultimate AI copilot for Unreal Engine. Go beyond simple code generation: analyze your entire project's architecture, 
              build complex scenes and UI from a single command, and refactor Blueprints conversationally.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <div className="bg-green-500/20 border border-green-500/40 rounded-lg px-4 py-2 text-green-400 text-sm font-semibold">
                ✅ One-Time Purchase. Lifetime Updates.
              </div>
              <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg px-4 py-2 text-blue-400 text-sm font-semibold">
                ✅ Full C++ Source Code Included
              </div>
              <div className="bg-purple-500/20 border border-purple-500/40 rounded-lg px-4 py-2 text-purple-400 text-sm font-semibold">
                ✅ Free & Unlimited AI Usage
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#purchase" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25">
                🚀 Get The CoPilot Now
              </a>
              <a href="#features" className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 font-bold py-4 px-8 rounded-xl text-lg transition-all">
                View Features
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-black/40 border-y border-purple-500/20 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-purple-400">v0.3.5</div>
              <div className="text-gray-400 text-sm">Latest Version</div>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-400">Jan 26, 2026</div>
              <div className="text-gray-400 text-sm">Last Updated</div>
            </div>
            <div>
              <div className="text-3xl font-black text-green-400">UE5</div>
              <div className="text-gray-400 text-sm">Compatible</div>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-400">#1</div>
              <div className="text-gray-400 text-sm">Fastest Growing CoPilot</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {['overview', 'features', 'why-different', 'pricing', 'faq'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-4 text-white">The AI Revolution in Unreal is Here</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                The standard for professional development is evolving at lightning speed. AI assistance is no longer a gimmick — 
                it's the new competitive edge. While others are manually wiring nodes, you could be directing your vision, 
                iterating on core gameplay, and focusing on what truly makes your game special.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="font-bold text-white mb-2">Conversational AI Partner</h3>
                  <p className="text-gray-400 text-sm">Select a node and ask the AI to add logic directly. It feels like collaboration, not a command line.</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-3">🧠</div>
                  <h3 className="font-bold text-white mb-2">Think in Your Language</h3>
                  <p className="text-gray-400 text-sm">English, Spanish, German, Chinese — the AI understands intent, not just words.</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="font-bold text-white mb-2">Master Blueprints Fast</h3>
                  <p className="text-gray-400 text-sm">Like a 24/7 senior developer on your shoulder, showing you the right way to build logic.</p>
                </div>
              </div>
            </div>

            {/* Media Links */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <a href="#" className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 flex items-center gap-4 hover:bg-red-900/50 transition-all">
                <div className="text-4xl">🎬</div>
                <div>
                  <div className="font-bold text-white">Video Trailer</div>
                  <div className="text-gray-400 text-sm">Watch the official trailer</div>
                </div>
              </a>
              <a href="#" className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 flex items-center gap-4 hover:bg-blue-900/50 transition-all">
                <div className="text-4xl">📹</div>
                <div>
                  <div className="font-bold text-white">13-Minute Overview</div>
                  <div className="text-gray-400 text-sm">Deep dive into all powerful features</div>
                </div>
              </a>
              <a href="#" className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 flex items-center gap-4 hover:bg-purple-900/50 transition-all">
                <div className="text-4xl">💬</div>
                <div>
                  <div className="font-bold text-white">Join Discord Server</div>
                  <div className="text-gray-400 text-sm">Exclusive developer community</div>
                </div>
              </a>
              <a href="#" className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 flex items-center gap-4 hover:bg-green-900/50 transition-all">
                <div className="text-4xl">📚</div>
                <div>
                  <div className="font-bold text-white">Documentation</div>
                  <div className="text-gray-400 text-sm">Full guides and API reference</div>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Powerful Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🏗️',
                  title: 'Project Architecture Analysis',
                  description: 'Analyze your entire project architecture. The AI understands your codebase holistically, not just individual files.'
                },
                {
                  icon: '🎨',
                  title: 'Scene & UI Builder',
                  description: 'Build complex scenes and UI from a single command. Describe what you want, watch it get built.'
                },
                {
                  icon: '🔄',
                  title: 'Conversational Blueprint Refactoring',
                  description: 'Select any node in your Blueprint graph and have a conversation with AI to modify, extend, or refactor it.'
                },
                {
                  icon: '🔌',
                  title: 'Multi-Provider Support',
                  description: 'Connect to Claude Desktop, Cursor, GitHub Copilot, Google Antigravity, DeepSeek, Gemini, or any local LLM.'
                },
                {
                  icon: '🌍',
                  title: 'Multi-Language Support',
                  description: 'Think and communicate in your native language. English, Spanish, German, Chinese, and more supported.'
                },
                {
                  icon: '🏠',
                  title: 'Local LLM Support',
                  description: 'Run completely offline with local LLM support. Your code never leaves your machine.'
                },
                {
                  icon: '📖',
                  title: 'Blueprint Explainer',
                  description: 'Add any Blueprint as context and have the AI explain it precisely. Perfect for marketplace assets.'
                },
                {
                  icon: '💻',
                  title: 'Full C++ Source Code',
                  description: 'Complete source code included. Modify, extend, and learn from the entire plugin codebase.'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why Different Tab */}
        {activeTab === 'why-different' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-white">The CoPilot Difference</h2>
            <p className="text-center text-gray-400 mb-8">Why this plugin is the best value in Unreal</p>
            
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: '✅',
                  title: 'One-Time Purchase. Lifetime Updates. No Subscriptions. Ever.',
                  description: 'You buy it, you own it. No monthly fees, no usage limits tied to our servers. Unlike subscription-based competitors, your workflow never gets disrupted by billing issues.',
                  color: 'green'
                },
                {
                  icon: '✅',
                  title: 'You Get the Full C++ Source Code',
                  description: 'This isn\'t a black box. Modify, extend, and learn from the plugin\'s complete source code. No other co-pilot on the market offers this level of freedom and transparency.',
                  color: 'blue'
                },
                {
                  icon: '✅',
                  title: 'Truly Free & Unlimited Usage Options',
                  description: 'Connect to free API keys from Gemini or other providers. Local LLM support means zero usage costs. The "off-FAB" plugins charge enormous fees for what you can get free here.',
                  color: 'purple'
                },
                {
                  icon: '✅',
                  title: 'Robust & Resilient Architecture',
                  description: 'Multiple connection methods (Desktop Apps & Web AI) mean if one service has issues, you keep working. Single-server competitors leave you stranded when they go down.',
                  color: 'yellow'
                },
                {
                  icon: '✅',
                  title: 'Built by a Developer, For Developers',
                  description: 'Not a corporate cash grab. A passion project from a solo developer with direct, transparent community support on Discord. Your feedback directly shapes the roadmap.',
                  color: 'red'
                }
              ].map((item, index) => (
                <div key={index} className={`bg-${item.color}-900/20 border border-${item.color}-500/30 rounded-xl p-6`}>
                  <div className="flex gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-gray-800/50 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">Feature Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="text-left p-4 text-gray-400">Feature</th>
                      <th className="text-center p-4 text-purple-400 font-bold">Ultimate CoPilot</th>
                      <th className="text-center p-4 text-gray-500">Other Plugins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['One-time purchase', '✅', '❌ Monthly subscription'],
                      ['Source code included', '✅', '❌ Closed source'],
                      ['Local LLM support', '✅', '❌'],
                      ['Free AI usage option', '✅', '❌ Pay per use'],
                      ['Multiple AI providers', '✅', '❌ Single provider'],
                      ['Featured on FAB by Epic', '✅', '❓'],
                      ['Active community', '✅ Discord', '❓'],
                    ].map(([feature, ours, theirs], index) => (
                      <tr key={index} className="border-t border-gray-700/50 hover:bg-gray-700/20">
                        <td className="p-4 text-gray-300">{feature}</td>
                        <td className="p-4 text-center text-green-400">{ours}</td>
                        <td className="p-4 text-center text-red-400">{theirs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Simple, Honest Pricing</h2>
            <p className="text-gray-400 mb-8">One price. Full ownership. Lifetime updates.</p>
            
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/50 rounded-2xl p-10 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                FEATURED ON FAB
              </div>
              <div className="text-7xl font-black text-white mb-2">One-Time</div>
              <div className="text-2xl text-purple-300 mb-6">Purchase on FAB Marketplace</div>
              
              <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                {[
                  'Full C++ Source Code',
                  'Lifetime Updates',
                  'No Monthly Fees',
                  'Commercial License',
                  'Discord Community Access',
                  'Local LLM Support',
                  'Multi-Provider Support',
                  'Priority Bug Fixes'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-gray-300">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <a href="#" className="inline-block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg">
                🛒 Purchase on FAB Marketplace
              </a>
              <p className="text-gray-500 text-sm mt-4">Available exclusively on the FAB Marketplace by Epic Games</p>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4 text-left">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-bold text-white mb-1">Not Ready Yet?</h3>
                <p className="text-gray-400 text-sm">Try the <strong className="text-purple-400">Blueprint Analyst</strong> first — a lighter tool to explore AI-powered Blueprint analysis.</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-2xl mb-2">⚔️</div>
                <h3 className="font-bold text-white mb-1">RPG System</h3>
                <p className="text-gray-400 text-sm">Check out the <strong className="text-purple-400">Flexible Combat System</strong> — the best RPG system for Unreal Engine 5.</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-2xl mb-2">🗺️</div>
                <h3 className="font-bold text-white mb-1">Roadmap & Changelog</h3>
                <p className="text-gray-400 text-sm">See what's coming next and track all updates in the public roadmap and changelog.</p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is this really a one-time purchase with no subscriptions?',
                  a: 'Yes, absolutely. You pay once on FAB and you own it forever. All future updates are included at no additional cost. We will never introduce subscription fees for existing customers.'
                },
                {
                  q: 'Can I use free AI models with this plugin?',
                  a: 'Yes! You can connect to free API keys from Gemini and other providers, or run completely free with local LLMs on your own machine. The AI usage cost is entirely up to you.'
                },
                {
                  q: 'What AI providers are supported?',
                  a: 'Claude Desktop, Cursor, GitHub Copilot, Google Antigravity, DeepSeek, Gemini via browser extension, and any local LLM. New providers are added regularly.'
                },
                {
                  q: 'Is the C++ source code really included?',
                  a: 'Yes, the complete plugin source code is included. You can modify it, learn from it, and extend it for your specific needs. This is unique — no other AI copilot plugin for Unreal offers this.'
                },
                {
                  q: 'What Unreal Engine versions are supported?',
                  a: 'The plugin supports Unreal Engine 5. Check the FAB listing for the specific UE5 versions compatible with your project.'
                },
                {
                  q: 'This is a beta — how stable is it?',
                  a: 'The core features are stable and used by hundreds of developers daily. Being in beta means we\'re actively adding major new features. Bug reports directly shape what gets fixed and improved.'
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Q: {item.q}</h3>
                  <p className="text-gray-400">A: {item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-t border-purple-500/20 py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Unreal Workflow?</h2>
          <p className="text-gray-400 text-lg mb-8">Join the AI revolution in Unreal Engine development. Don't get left behind.</p>
          <a href="#" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-5 px-12 rounded-xl text-xl transition-all transform hover:scale-105 shadow-xl shadow-purple-500/25">
            🚀 Get The Ultimate CoPilot Today
          </a>
          <p className="text-gray-500 text-sm mt-4">One-time purchase • Featured on FAB • Full source code included</p>
        </div>
      </div>
    </div>
  )
}
