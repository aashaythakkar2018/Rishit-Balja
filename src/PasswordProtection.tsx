import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function PasswordProtection({ onAuthenticated, onBack }: { onAuthenticated: () => void, onBack: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Keepitsimple*123') {
      setError(false);
      onAuthenticated();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
      className="min-h-screen bg-[var(--bg)] flex flex-col pt-[68px]"
    >
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[500] h-[68px] flex items-center justify-between px-6 md:px-12 border-b border-[var(--bdr)] bg-[rgba(225,225,227,0.82)] backdrop-blur-[22px]">
        <button
          onClick={onBack}
          className="nav-logo font-[var(--font-syne)] font-extrabold text-[15px] tracking-[0.05em] lowercase text-[var(--txt)] flex items-center gap-2 hover:text-[var(--acc)] transition-colors duration-250 cursor-pointer border-none bg-transparent"
        >
          ← rishit<em className="text-[var(--acc)] not-italic">.</em>
        </button>
        <span className="font-[var(--font-syne)] text-[11px] tracking-[0.16em] uppercase text-[var(--txt3)]">
          Protected Area
        </span>
        <div className="w-[100px]"></div> {/* Spacer for symmetry */}
      </nav>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.77, 0, 0.175, 1] }}
          className="font-[var(--font-syne)] text-[11px] tracking-[0.2em] uppercase text-[var(--txt3)] mb-4 flex items-center gap-3 justify-center"
        >
          <em className="text-[var(--acc)] not-italic">🔒</em> Restricted Access
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.77, 0, 0.175, 1] }}
          className="font-[var(--font-swifter)] font-bold text-[clamp(40px,5vw,72px)] leading-[0.88] uppercase tracking-[-0.01em] text-[var(--txt)] mb-8"
        >
          Enter Password
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.77, 0, 0.175, 1] }}
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-[320px]"
        >
          <div className="relative w-full">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full bg-[var(--bg2)] border ${error ? 'border-[#ff4d4d]' : 'border-[var(--bdr)]'} text-[var(--txt)] font-[var(--font-syne)] text-[13px] px-6 py-4 rounded-[4px] outline-none focus:border-[var(--acc)] transition-colors mb-4`}
              autoFocus
            />
            {error && (
              <span className="absolute -bottom-6 left-0 right-0 text-center font-[var(--font-syne)] text-[12px] tracking-[0.05em] text-[#ff1a1a]">
                Please input the correct password.
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full font-[var(--font-syne)] text-[12px] font-semibold tracking-[0.12em] uppercase text-[var(--bg)] bg-[var(--acc)] px-8 py-[14px] rounded-[4px] transition-all duration-300 hover:bg-[#d6ff8a] hover:-translate-y-[2px] shadow-[0_4px_15px_rgba(255,120,60,0.25)] hover:shadow-[0_8px_20px_rgba(214,255,138,0.3)] mt-2 cursor-pointer border-none"
          >
            Access Projects
          </button>
        </motion.form>
      </div>
    </motion.div>
  );
}
