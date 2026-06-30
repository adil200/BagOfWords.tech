'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrolly } from './Scrollytelling';

export function LLMVisualizer({ stepOverride }: { stepOverride?: number }) {
  const scrolly = useScrolly();
  const currentStep = stepOverride !== undefined ? stepOverride : scrolly.currentStep;

  const getDiagram = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl text-center overflow-hidden relative"
          >
            {/* Background pulsating circles */}
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute w-96 h-96 bg-primary rounded-full blur-3xl -z-10"
            />
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="w-48 h-48 bg-background border-4 border-primary rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/20 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>
              </div>
              {/* Orbiting nodes */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`orbit-${i}`}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, delay: i, ease: "linear" }}
                  className="absolute w-full h-full"
                >
                  <div className="w-4 h-4 bg-accent rounded-full absolute -top-2 left-1/2 transform -translate-x-1/2 shadow-lg shadow-accent" />
                </motion.div>
              ))}
            </motion.div>
            <h3 className="text-3xl font-extrabold mb-2 tracking-tight text-foreground">Vast Amounts of Data</h3>
            <p className="text-muted-foreground text-lg">Billions of parameters learning human language patterns.</p>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl"
          >
             <h3 className="text-3xl font-extrabold mb-10 tracking-tight">The Pre-LLM Era</h3>
             <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                {/* RNN Visual */}
                <div className="p-8 border rounded-xl bg-background text-center shadow-inner relative overflow-hidden group">
                  <h4 className="font-bold text-accent mb-4 text-2xl tracking-tight">RNNs</h4>
                  <div className="h-24 w-full flex items-center justify-center mb-4">
                     <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-16 h-16 border-4 border-t-accent border-r-accent border-b-transparent border-l-transparent rounded-full"
                     />
                  </div>
                  <p className="text-sm font-medium">Sequential Data</p>
                  <p className="text-xs text-muted-foreground mt-2">Time-series, stock prices</p>
                </div>

                {/* CNN Visual */}
                <div className="p-8 border rounded-xl bg-background text-center shadow-inner relative overflow-hidden group">
                  <h4 className="font-bold text-primary mb-4 text-2xl tracking-tight">CNNs</h4>
                  <div className="h-24 w-full flex items-center justify-center mb-4">
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <motion.div 
                          key={`cnn-${i}`}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                          className="w-6 h-6 bg-primary/40 rounded-sm"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-medium">Spatial Data</p>
                  <p className="text-xs text-muted-foreground mt-2">Images, object tracking</p>
                </div>
             </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl"
          >
             <h3 className="text-3xl font-extrabold mb-6 tracking-tight">Traditional NLP</h3>
             <p className="text-center text-muted-foreground mb-8 max-w-sm text-lg">Task-specific models, rather than generative intelligence.</p>
             
             <div className="w-full max-w-md space-y-4">
               {/* Animated pipeline blocks */}
               {[
                 { name: "Sentiment Analysis", icon: "😊😡", delay: 0 },
                 { name: "Named Entity Recog (NER)", icon: "🏷️", delay: 0.2 },
                 { name: "POS Tagging", icon: "[N] [V]", delay: 0.4 }
               ].map((task, i) => (
                 <motion.div 
                   key={task.name}
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: task.delay, duration: 0.5 }}
                   className="p-5 border-2 border-transparent hover:border-primary/50 transition-colors rounded-xl bg-background shadow-md flex items-center justify-between"
                 >
                   <span className="font-semibold">{task.name}</span> 
                   <span className="text-2xl font-mono text-accent">{task.icon}</span>
                 </motion.div>
               ))}
             </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 bg-primary text-primary-foreground rounded-xl border shadow-2xl text-center overflow-hidden relative"
          >
             {/* Dramatic background effect */}
             <motion.div 
               animate={{ rotate: 360, scale: [1, 1.2, 1] }}
               transition={{ repeat: Infinity, duration: 20 }}
               className="absolute w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent -z-10"
             />

             <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="text-8xl mb-8 drop-shadow-2xl"
             >
                📜
             </motion.div>
             <h3 className="text-5xl font-black mb-4 tracking-tighter">2017</h3>
             <p className="text-2xl font-medium mb-10 text-primary-foreground/90">Vaswani et al. publish</p>
             
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.5, type: "spring" }}
               className="px-10 py-8 bg-background text-foreground rounded-2xl font-black text-4xl shadow-2xl italic border-l-8 border-accent"
             >
               "Attention Is All You Need"
             </motion.div>
             <p className="mt-12 font-bold tracking-[0.3em] uppercase text-sm text-accent">The Birth of the Transformer</p>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl overflow-hidden"
          >
             <h3 className="text-2xl font-bold mb-12 text-center text-primary">Tokenization & Embedding</h3>
             
             <div className="w-full max-w-lg">
                {/* 1. Raw Text */}
                <div className="mb-8 text-center">
                  <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Raw Prompt</p>
                  <div className="p-4 bg-background border rounded-lg shadow-sm text-lg font-serif">
                    "What is Mainframe Modernization?"
                  </div>
                </div>

                {/* 2. Tokenization animation */}
                <div className="mb-8 text-center relative">
                  <motion.div 
                    animate={{ height: ["0%", "100%"] }} 
                    transition={{ duration: 1 }} 
                    className="absolute left-1/2 top-0 w-0.5 bg-border -translate-y-8 -z-10" 
                  />
                  <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Tokens</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['What', ' is', ' Main', 'frame', ' Modern', 'ization', '?'].map((token, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        key={i} 
                        className="px-3 py-2 bg-accent/20 border border-accent/40 text-accent rounded font-mono text-sm shadow-sm"
                      >
                        {token}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 3. Embedding animation */}
                <div className="text-center relative">
                  <motion.div 
                    animate={{ height: ["0%", "100%"] }} 
                    transition={{ duration: 1, delay: 1 }} 
                    className="absolute left-1/2 top-0 w-0.5 bg-border -translate-y-8 -z-10" 
                  />
                  <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Embeddings (Vectors)</p>
                  <div className="flex flex-col gap-2">
                    {[0, 1, 2].map((row) => (
                      <motion.div 
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: 1.5 + (row * 0.2) }}
                        key={`vector-${row}`}
                        className="w-full h-8 flex overflow-hidden rounded bg-background border"
                      >
                        {[...Array(10)].map((_, col) => {
                          const intensity = Math.random();
                          return (
                            <motion.div 
                              key={col}
                              animate={{ opacity: [intensity, Math.random(), intensity] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="flex-1 h-full"
                              style={{ backgroundColor: `rgba(var(--primary-rgb), ${intensity * 0.8 + 0.2})` }}
                            />
                          );
                        })}
                      </motion.div>
                    ))}
                  </div>
                </div>
             </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl"
          >
             <h3 className="text-3xl font-bold mb-8 text-center text-primary">Self-Attention</h3>
             
             <div className="w-full max-w-lg flex flex-col items-center relative">
                {/* The sentence */}
                <div className="flex gap-4 mb-16 text-xl font-bold z-10">
                  <span className="text-muted-foreground">The</span>
                  <motion.span 
                    animate={{ color: ["var(--foreground)", "var(--accent)", "var(--foreground)"] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="relative"
                  >
                    bank
                    {/* The attention curve */}
                    <motion.svg 
                      className="absolute top-8 left-1/2 overflow-visible pointer-events-none" 
                      width="100" height="60"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    >
                      <path d="M 0 0 C 0 60, 80 60, 80 0" fill="transparent" stroke="var(--accent)" strokeWidth="3" strokeDasharray="5,5" />
                    </motion.svg>
                  </motion.span>
                  <span className="text-muted-foreground">of</span>
                  <span className="text-muted-foreground">the</span>
                  <motion.span 
                    animate={{ color: ["var(--foreground)", "var(--accent)", "var(--foreground)"] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    river
                  </motion.span>
                </div>

                {/* Q K V matrices */}
                <div className="flex gap-8 justify-center items-center mt-8">
                  {[
                    { label: "Query (Q)", desc: "What am I looking for?", color: "text-blue-500", border: "border-blue-500/50" },
                    { label: "Key (K)", desc: "What do I have?", color: "text-green-500", border: "border-green-500/50" },
                    { label: "Value (V)", desc: "Actual Content", color: "text-purple-500", border: "border-purple-500/50" }
                  ].map((matrix, i) => (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.3 }}
                      key={matrix.label} 
                      className={`p-4 border-2 rounded-xl bg-background shadow-lg text-center w-32 h-32 flex flex-col items-center justify-center ${matrix.border}`}
                    >
                      <h4 className={`font-black text-2xl mb-2 ${matrix.color}`}>{matrix.label.split(' ')[0]}</h4>
                      <p className="text-[10px] text-muted-foreground leading-tight">{matrix.desc}</p>
                    </motion.div>
                  ))}
                </div>
             </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl"
          >
             <h3 className="text-3xl font-bold mb-4 text-center">Output Layer (Softmax)</h3>
             <p className="text-muted-foreground mb-12 text-center max-w-sm">Predicting the single most likely next token.</p>
             
             <div className="w-full max-w-md space-y-6">
                {[
                  { word: "Mainframe", prob: 85, color: "bg-green-500" },
                  { word: "Cloud", prob: 10, color: "bg-blue-500" },
                  { word: "Computer", prob: 4, color: "bg-yellow-500" },
                  { word: "Database", prob: 1, color: "bg-red-500" },
                ].map((item, i) => (
                  <div key={item.word} className="w-full">
                    <div className="flex justify-between mb-1 text-sm font-bold font-mono">
                      <span>"{item.word}"</span>
                      <span>{item.prob}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-4 overflow-hidden border">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.prob}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1), type: "spring" }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                  className="mt-12 text-center"
                >
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Final Selection</p>
                  <div className="inline-block px-6 py-3 bg-accent text-accent-foreground font-bold text-xl rounded-lg shadow-lg">
                    Mainframe
                  </div>
                </motion.div>
             </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            key="step7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl overflow-hidden relative"
          >
             {/* Floating math background */}
             <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none text-4xl font-mono flex flex-wrap gap-12 p-8 -z-10">
               {[...Array(20)].map((_, i) => <span key={i}>W×x+b</span>)}
             </div>

             <h3 className="text-3xl font-black mb-8 text-center flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                The Code Level
             </h3>
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ type: "spring" }}
               className="w-full bg-[#1e1e1e] rounded-2xl p-8 font-mono text-base text-green-400 text-left overflow-hidden shadow-2xl border border-gray-800 relative group"
             >
                {/* Simulated scanline effect */}
                <motion.div 
                  animate={{ y: [-100, 300] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
                />

                <p><span className="text-purple-400">class</span> <span className="text-yellow-200">LinearLayer</span>:</p>
                <p className="ml-4 mt-3"><span className="text-purple-400">def</span> <span className="text-blue-300">__init__</span>(self, input_size, output_size):</p>
                <p className="ml-8 text-gray-500 italic mt-3"># Weight matrix (The core 'Knowledge')</p>
                <p className="ml-8"><span className="text-blue-300">self</span>.weight = np.random.randn(input_size, output_size)</p>
                <p className="ml-8 text-gray-500 italic mt-4"># Bias vector</p>
                <p className="ml-8"><span className="text-blue-300">self</span>.bias = np.random.randn(output_size)</p>
             </motion.div>
             
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 1 }}
               className="mt-10 p-6 bg-accent/10 border-2 border-accent/30 rounded-xl text-center w-full shadow-lg"
             >
                <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-2">Total Parameters in 1 layer</p>
                <p className="font-black text-accent text-2xl font-mono tracking-tighter">
                  (input × output) + output
                </p>
             </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full relative p-4 lg:p-8">
      <AnimatePresence mode="wait">
        {getDiagram()}
      </AnimatePresence>
    </div>
  );
}
