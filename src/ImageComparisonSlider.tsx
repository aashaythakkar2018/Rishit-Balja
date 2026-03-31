import { useRef, useState, useEffect, useCallback } from 'react';

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function ImageComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Old UI',
  afterLabel = 'New UI',
}: ImageComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    setPosition(pct);
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => updatePosition(e.clientX);
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, updatePosition]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      updatePosition(e.touches[0].clientX);
    };
    const onEnd = () => setIsDragging(false);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, updatePosition]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Labels row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="font-[var(--font-syne)] text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-[2px] transition-all duration-300"
            style={{
              background: position > 15 ? 'var(--bdr)' : 'var(--acc)',
              color: position > 15 ? 'var(--txt3)' : '#080808',
            }}
          >
            {beforeLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[var(--txt3)] font-[var(--font-syne)] text-[10px] tracking-[0.1em]">
          Drag to compare
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-[var(--font-syne)] text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-[2px] transition-all duration-300"
            style={{
              background: position < 85 ? 'var(--bdr)' : 'var(--acc)',
              color: position < 85 ? 'var(--txt3)' : '#080808',
            }}
          >
            {afterLabel}
          </span>
        </div>
      </div>

      {/* Slider container */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-[6px] border border-[var(--bdr)] select-none"
        style={{
          aspectRatio: '16/9',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* BEFORE image (old UI) — full width, clipped on the right */}
        <img
          src={beforeImage}
          alt={beforeLabel}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
        />

        {/* AFTER image (new UI) — revealed from left using clip */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={afterImage}
            alt={afterLabel}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* After label watermark */}
          <div
            className="absolute top-4 right-4 font-[var(--font-syne)] text-[9px] font-bold tracking-[0.2em] uppercase text-[#080808] bg-[var(--acc)] px-2 py-1 rounded-[2px]"
            style={{ opacity: position > 20 ? 1 : 0, transition: 'opacity 0.3s' }}
          >
            {afterLabel}
          </div>
        </div>

        {/* Before label watermark */}
        <div
          className="absolute top-4 left-4 font-[var(--font-syne)] text-[9px] font-bold tracking-[0.2em] uppercase text-white bg-[rgba(8,8,8,0.55)] backdrop-blur-sm px-2 py-1 rounded-[2px]"
          style={{ opacity: position < 80 ? 1 : 0, transition: 'opacity 0.3s' }}
        >
          {beforeLabel}
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_16px_rgba(0,0,0,0.35)] z-10 pointer-events-none"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />

        {/* Drag Handle */}
        <div
          className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div
            className="flex items-center justify-center rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.28)] transition-transform duration-200"
            style={{
              width: isDragging ? '52px' : isHovered ? '48px' : '44px',
              height: isDragging ? '52px' : isHovered ? '48px' : '44px',
              background: isDragging ? 'var(--acc)' : 'white',
              transform: `translateX(-50%) translateY(-50%) scale(${isDragging ? 1.1 : 1})`,
              transition: 'width 0.2s, height 0.2s, background 0.2s',
            }}
          >
            {/* Left chevron */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: '-2px' }}>
              <path d="M15 18l-6-6 6-6" stroke={isDragging ? '#080808' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Right chevron */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '-2px' }}>
              <path d="M9 18l6-6-6-6" stroke={isDragging ? '#080808' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Progress bar indicator */}
      <div className="w-full h-[2px] bg-[var(--bdr)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--acc)] rounded-full transition-none"
          style={{ width: `${position}%` }}
        />
      </div>
    </div>
  );
}
