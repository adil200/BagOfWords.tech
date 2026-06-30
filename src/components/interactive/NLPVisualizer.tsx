'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrolly } from './Scrollytelling';

export function NLPVisualizer({ stepOverride }: { stepOverride?: number }) {
  const scrolly = useScrolly();
  const currentStep = stepOverride !== undefined ? stepOverride : scrolly.currentStep;

  const getDiagram = () => {
    switch (currentStep) {
      case 0: // Bag of Words (BoW)
        return (
          <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl">
            <h3 className="text-3xl font-bold mb-8">Bag of Words</h3>
            <div className="flex gap-4 mb-2 font-mono text-xl">
              {["The", "dog", "chased", "the", "cat"].map((w, i) => (
                <motion.div key={i} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.2 }} className="p-2 bg-accent/20 rounded border border-accent">
                  {w}
                </motion.div>
              ))}
            </div>
            {/* Downward arrow */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="flex flex-col items-center my-2 text-muted-foreground">
              <div className="h-6 w-px bg-muted-foreground" />
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-muted-foreground" />
            </motion.div>
            {/* Word → count row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="font-mono text-sm bg-background p-3 rounded-xl border w-full text-center">
              {`{ "the": 2, "dog": 1, "chased": 1, "cat": 1 }`}
            </motion.div>
            {/* Downward arrow */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="flex flex-col items-center my-2 text-muted-foreground">
              <div className="h-6 w-px bg-muted-foreground" />
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-muted-foreground" />
            </motion.div>
            {/* Numeric vector row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="font-mono text-sm bg-background p-3 rounded-xl border w-full text-center">
              {`[ 2, 1, 1, 1 ]`}
            </motion.div>
          </motion.div>
        );

      case 1: // The Problem (Giant Bars)
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl">
             <h3 className="text-2xl font-bold mb-8">The Problem with Common Words</h3>
             <div className="flex items-end gap-4 h-64 w-full max-w-md justify-center border-b-2 border-border pb-2">
                <div className="flex flex-col items-center gap-2">
                  <motion.div initial={{ height: 0 }} animate={{ height: 200 }} className="w-16 bg-red-500 rounded-t-md" />
                  <span className="font-mono font-bold">"THE"</span>
                  <span className="text-xs text-muted-foreground">Count: 1000</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <motion.div initial={{ height: 0 }} animate={{ height: 180 }} className="w-16 bg-red-400 rounded-t-md" />
                  <span className="font-mono font-bold">"IS"</span>
                  <span className="text-xs text-muted-foreground">Count: 850</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <motion.div initial={{ height: 0 }} animate={{ height: 20 }} className="w-16 bg-green-500 rounded-t-md" />
                  <span className="font-mono font-bold text-green-500">"DATA"</span>
                  <span className="text-xs text-muted-foreground">Count: 10</span>
                </div>
             </div>
          </motion.div>
        );

      case 2: // Log Squashing
        return (
          <motion.div key="step2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl">
             <h3 className="text-2xl font-bold mb-4 text-accent">Logarithmic Squashing (TF)</h3>
             <p className="font-mono bg-background p-2 rounded border mb-12">log₁₀(count + 1)</p>
             
             <div className="flex items-end gap-12 w-full max-w-md justify-center border-b-2 border-border pb-2">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex items-end w-16 h-[200px]">
                    {/* Original height ghost */}
                    <div className="absolute bottom-0 w-full h-[200px] border-2 border-dashed border-red-500/30 rounded-t-md" />
                    {/* Squashed height */}
                    <motion.div initial={{ height: 200 }} animate={{ height: 60 }} transition={{ duration: 1.5, type: "spring" }} className="relative w-full bg-red-500 rounded-t-md z-10" />
                  </div>
                  <span className="font-mono font-bold">"THE"</span>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-sm font-bold text-accent">Score: 3.0</motion.span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex items-end w-16 h-[200px]">
                    {/* Original height ghost */}
                    <div className="absolute bottom-0 w-full h-[20px] border-2 border-dashed border-green-500/30 rounded-t-md" />
                    {/* Squashed height */}
                    <motion.div initial={{ height: 20 }} animate={{ height: 30 }} transition={{ duration: 1.5, type: "spring" }} className="relative w-full bg-green-500 rounded-t-md z-10" />
                  </div>
                  <span className="font-mono font-bold text-green-500">"DATA"</span>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-sm font-bold text-accent">Score: 1.04</motion.span>
                </div>
             </div>
          </motion.div>
        );

      case 3: // IDF
        return (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl">
             <h3 className="text-2xl font-bold mb-8 text-primary">Inverse Document Frequency (IDF)</h3>
             <div className="grid grid-cols-4 gap-4 w-full max-w-md">
                {[...Array(8)].map((_, i) => (
                  <motion.div key={i} className="h-16 border rounded bg-background flex items-center justify-center relative overflow-hidden">
                    <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ repeat: Infinity, duration: 2 }} className="text-xs text-red-500 absolute top-1 left-1">the</motion.div>
                    {i === 3 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sm font-bold text-green-500 bg-green-500/20 px-1 rounded z-10">data</motion.div>}
                  </motion.div>
                ))}
             </div>
             <p className="mt-8 text-center text-muted-foreground">"The" appears everywhere → <span className="font-bold text-red-500">Multiplier: 0</span><br/>"Data" appears rarely → <span className="font-bold text-green-500">Multiplier: High</span></p>
          </motion.div>
        );

      case 4: // Semantic Gap
        return (
          <motion.div key="step4" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl">
             <h3 className="text-2xl font-bold mb-8">The Semantic Gap</h3>
             <div className="flex flex-col gap-6 w-full max-w-md">
               <div className="p-4 bg-background border rounded-lg shadow-sm text-center">
                  <p className="font-serif italic mb-2">"The puppy sprinted"</p>
                  <p className="font-mono text-xs text-blue-500">[0, 1, 0, 1, 0, 0]</p>
               </div>
               <div className="flex justify-center items-center">
                 <span className="bg-red-500/20 text-red-500 font-bold px-4 py-1 rounded-full border border-red-500">0% Overlap Match</span>
               </div>
               <div className="p-4 bg-background border rounded-lg shadow-sm text-center">
                  <p className="font-serif italic mb-2">"The dog ran"</p>
                  <p className="font-mono text-xs text-green-500">[0, 0, 1, 0, 1, 0]</p>
               </div>
             </div>
          </motion.div>
        );

      case 5: // Word2Vec Teaser
        return (
          <motion.div key="step5" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center p-8 bg-card rounded-xl border shadow-xl text-center relative overflow-hidden">
             <blockquote className="text-2xl font-serif italic mb-6 leading-relaxed">
               "You shall know a word by the company it keeps."
             </blockquote>
             <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">- John Rupert Firth, 1957</p>
             <div className="flex items-center gap-3 font-mono bg-muted/50 px-6 py-3 rounded-full border">
                <span className="opacity-70">The</span>
                <span className="opacity-70">puppy</span>
                <motion.span animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="font-bold text-accent bg-background px-3 py-1 rounded shadow text-foreground">
                  [ran/sprinted]
                </motion.span>
                <span className="opacity-70">fast.</span>
             </div>
          </motion.div>
        );

      default: return null;
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