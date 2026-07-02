// AI Agent Studio - Hierarchical Agent System
import React from 'react';
import { Metadata } from 'next';
import { MicrochipsOutline, Plan, Brain, Code, WebSearch, Editor, ChevronRight, TestBub, CircleCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Agent Studio - GOAT Royalties',
  description: 'Advanced AI Agent System with Hierarchical Orchestration, Autonomous Agents, and Collaborative Multi-Agent Systems.',
};

const agentTypes = [
  { name: 'Hierarchical', desc: 'Supervisor/Worker structure', level: 'Most Advanced', icon: MicrochipsOutline, color: 'purple' },
  { name: 'Autonomous', desc: 'Full autonomy, minimal human intervention', level: 'Most Advanced', icon: Plan, color: 'pink' },
  { name: 'Collaborative', desc: 'Multi-agent systems working together', level: 'Most Advanced', icon: Plan, color: 'blue' },
  { name: 'Learning', desc: 'Improves over time via feedback', level: 'Advanced', icon: Brain, color: 'green' },
  { name: 'Utility-Based', desc: 'Optimizes using utility functions', level: 'Advanced', icon: WebSearch, color: 'yellow' },
  { name: 'Goal-Based', desc: 'Multi-step planning to reach goals', level: 'Advanced', icon: Plan, color: 'orange' },
  { name: 'Model-Based', desc: 'Maintains internal state model', level: 'Basic', icon: Brain, color: 'red' },
  { name: 'Simple Reflex', desc: 'If-then rules, no memory or learning', level: 'Least Advanced', icon: Code, color: 'gray' },
];

const workerAgents = [
  { name: 'Coder', role: 'Writes and reviews code', status: 'active', icon: Code, tasks: 23 },
  { name: 'Planner', role: 'Creates execution plans', status: 'active', icon: Plan, tasks: 15 },
  { name: 'Researcher', role: 'Gathers information', status: 'active', icon: WebSearch, tasks: 32 },
  { name: 'Creative', role: 'Generates content', status: 'active', icon: Editor, tasks: 19 },
  { name: 'Analyst', role: 'Analyzes data and provides insights', status: 'active', icon: Brain, tasks: 27 },
  { name: 'Tester', role: 'Tests and validates output', status: 'active', icon: TestBub, tasks: 11 },
];

const llmModels = [
  { name: 'GPT-5.2', type: 'Flagship Reasoning', rating: '5/5', reasoning: 'Excellent', color: 'green' },
  { name: 'Claude Opus 4.6', type: 'Flagship Reasoning', rating: '5/5', reasoning: 'Excellent', color: 'green' },
  { name: 'Gemini 3.0 Pro', type: 'Flagship Reasoning', rating: '5/5', reasoning: 'Excellent', color: 'green' },
  { name: 'Liama 4', type: 'Open-Source', rating: '4/5', reasoning: 'Very Good', color: 'blue' },
  { name: 'Mistral Devstral', type: 'Specialized/Coding', rating: '5/5', reasoning: 'Excellent', color: 'purple' },
];

export default function AIAgentsStudio() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-7px px-6 py-12">
         <h1 className="text-4xl md:5xl font-bold text-white mb-4">AI Agent Studio</h1>
         <p className="text-lg text-gray-400 mb-8">Advanced hierarchical AI system with autonomous agents, collaborative multi-agent systems, and learning capabilities.</p>

         <div className="bg-gray-800/50 rounded-xl p-w-2 px-6 my-8">
           <div className="flex items-center gap-3 mb-4">
             <MicrochipsOutline className="w-8 h-8 text-purple-400" />
             <h2 className="text-xl font-bold text-white">Agent Kierarchy</h2>
           </div>
           <div className="flex flex-col md:flex-row gap-4 items-center">
             <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center"><span className="text-sm font-bold text-white">SUPERVISOR</span></div>
             {workerAgents.map((a, i) => (
               <div key={i} className="text-center">
                 <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center"><a.icon className="w-6 h-6 text-white" /></div>
                 <p className="text-sm font-semibold text-white">{a.name}</p>
                 <p className="text-xs text-gray-400">{a.tasks} tasks</p>
               </div>
            ))}
           </div>
         </div>

         <div className="grid gap-6 mb-8">
           {agentTypes.map((a, i) => (
             <div key={i} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-{${a.color}-500}">
               <a.icon className="w-10 h-10 text-{${a.color}-400}" />
               <h3 className="text-lg font-semibold text-white">{a.name}</h3>
               <p className="text-sm text-gray-400">{a.level}</p>
               <p className="text-sm text-gray-300">{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 my-8">
          <h2 className="text-xl font-bold text-white mb-4">LLM Models Lineup</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {llmModels.map((m, i) => (
              <div key={i} className="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm font-semibold text-white">{m.name}</h3>
                <p className="text-xs text-gray-400">{m.type}</p>
                <span className="text-sm px-2 py-1 rounded-full bg-{m.color}-600 text-white">{m.rating}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 my-8">
          <div className="flex items-center gap-4 mb-4">
            <WebSearch className="w-12 h-12 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Agentic RAG</h2>
          </div>
          <p className="text-gray-300 mb-4">Intelligent retrieval that decides what to fetch, when, and how to verify eliminating hallucinations.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-900/30 rounded-lg p-4">
              <CircleCheck className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-semibold text-white">Intelligent Retrieval</h3>
            </div>
            <div className="bg-gray-900/30 rounded-lg p-4">
              <CircleCheck className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-semibold text-white">No Hallucinations</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
