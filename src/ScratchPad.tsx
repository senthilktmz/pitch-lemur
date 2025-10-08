import React, { useEffect, useState } from "react";
import MiniKeyboard from "./MiniKeyboard";
import KeyboardViewSVG from "./KeyboardViewSVG";

// Helpers to compute dynamic scaling for KeyboardViewSVG sizing
const NOTE_SEQUENCE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const BLACK_KEYS = new Set(["C#", "D#", "F#", "G#", "A#"]);
const WHITE_KEY_WIDTH = 9;   // must match KeyboardViewSVG
const WHITE_KEY_HEIGHT = 45; // must match KeyboardViewSVG

function baseNote(n: string) { return n.replace(/^0/, '').replace(/\d+$/, ''); }
function isWhite(n: string) { return !BLACK_KEYS.has(baseNote(n)); }
function getWhiteKeysInRange(start: string, end: string) {
  const notes: string[] = [];
  let [startNote, startOct] = [start.slice(0, -1), parseInt(start.slice(-1))];
  let [endNote, endOct] = [end.slice(0, -1), parseInt(end.slice(-1))];
  let idx = NOTE_SEQUENCE.indexOf(startNote);
  let oct = startOct;
  while (!(oct > endOct || (oct === endOct && idx > NOTE_SEQUENCE.indexOf(endNote)))) {
    const n = NOTE_SEQUENCE[idx] + oct;
    if (isWhite(n)) notes.push(n);
    idx++;
    if (idx === 12) { idx = 0; oct++; }
  }
  return notes;
}

interface ScratchPadItem {
  root: string;
  type: string;
  notes: string[];
  noteFrequencies: number[];
  timestamp: number;
  // New: exact keyboard view to reproduce the same mini keyboard image as in Chords view
  keySequence?: string[];
  backwardPadding?: string[];
  forwardPadding?: string[];
  // New: indicates how to play when clicked (chord or scale)
  playMode?: 'chord' | 'scale';
}

interface ScratchPadProps {
  items: Array<ScratchPadItem>;
  removeItem: (timestamp: number) => void;
}

const ScratchPad: React.FC<ScratchPadProps> = ({ items, removeItem }) => {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [frequencies, setFrequencies] = useState<{note: string, freq: number}[]>([]);
  // Zoom for preview thumbnails (1 = 100%) - persisted across sessions
  const [zoom, setZoom] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('scratchpad_zoom');
      if (!saved) return 1.25;
      const z = Number(saved);
      // clamp to slider bounds
      return isFinite(z) ? Math.min(5.0, Math.max(0.75, z)) : 1.25;
    } catch {
      return 1.25;
    }
  });
  useEffect(() => {
    try { localStorage.setItem('scratchpad_zoom', String(zoom)); } catch {}
  }, [zoom]);
  const BASE_W = 100;
  const BASE_H = 32;
  const previewW = Math.round(BASE_W * zoom);
  const previewH = Math.round(BASE_H * zoom);
  const cardW = Math.max(120, previewW + 20);
  const cardH = Math.max(78, previewH + 46);
  // Helper: get frequency for note with octave (e.g. D#4, F#4, A4)
  function getFrequency(noteWithOctave: string) {
    const NOTE_TO_MIDI: Record<string, number> = {
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    const match = noteWithOctave.match(/^([A-G]#?)(\d)$/);
    if (!match) return 261.63; // default to middle C
    const [, note, octaveStr] = match;
    const octave = parseInt(octaveStr, 10);
    const midi = (octave + 1) * 12 + NOTE_TO_MIDI[note];
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
  
  // Derive canonical notes for an item: prefer item.keySequence (authoritative), else item.notes
  const getNotesForItem = (item: ScratchPadItem): string[] => {
    if (item.keySequence && item.keySequence.length > 0) {
      return item.keySequence.filter((n: string) => !n.startsWith('0'));
    }
    if (item.notes && item.notes.length > 0) return item.notes;
    return [];
  };
  // Helper function to find the closest note name for a frequency
  const getNoteFromFrequency = (freq: number): string => {
    const A4 = 440;
    // Use standard C-based note names and MIDI 69 as A4 reference
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const midi = Math.round(69 + 12 * Math.log2(freq / A4));
    const noteIndex = ((midi % 12) + 12) % 12; // ensure positive modulo
    const octave = Math.floor(midi / 12) - 1;
    return `${noteNames[noteIndex]}${octave}`;
  };

  const playChord = (noteFrequencies: number[]) => {
    // Update the frequencies state to show on screen
    const newFrequencies = noteFrequencies.map(freq => ({
      note: getNoteFromFrequency(freq),
      freq: Number(freq.toFixed(2))
    }));
    setFrequencies(newFrequencies);
    
    // Clear the frequencies after 3 seconds
    setTimeout(() => setFrequencies([]), 3000);

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.08);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.92);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    gain.connect(ctx.destination);
    const oscillators = noteFrequencies.map(f => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      osc.connect(gain);
      return osc;
    });
    oscillators.forEach(osc => osc.start());
    setTimeout(() => {
      oscillators.forEach(osc => { try { osc.stop(); } catch (e) {} });
      ctx.close();
    }, 1000);
  };

  const playScale = async (noteFrequencies: number[]) => {
    for (let f of noteFrequencies) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.08);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      gain.connect(ctx.destination);
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      osc.connect(gain);
      osc.start();
      await new Promise(res => setTimeout(res, 500));
      try { osc.stop(); } catch {}
      try { await ctx.close(); } catch {}
    }
  };

  return (
    <div style={{ padding: 40 }}>
      {/* Scratch Pad zoom control */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 4 }}>
        <label style={{ fontSize: 13, color: '#555' }}>Preview size:</label>
        <input
          type="range"
          min={0.75}
          max={5.0}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          style={{ width: 180 }}
        />
        <span style={{ fontSize: 12, color: '#666', width: 40, textAlign: 'left' }}>{Math.round(zoom * 100)}%</span>
      </div>
      <h2 style={{ textAlign: 'center', color: '#444' }}>Scratch Pad</h2>
      {/* Removed the global frequency display in favor of per-item frequency tables */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${cardW}px, 1fr))`,
          gap: '12px',
          marginTop: 32,
          justifyItems: 'center',
          alignItems: 'start',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.timestamp + '-' + idx}
            style={{
              width: '100%',
              minHeight: cardH,
              background: '#f5f8fa',
              border: '2px solid #1976d2',
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px #0001',
              cursor: 'pointer',
              userSelect: 'none',
              position: 'relative',
              margin: 0,
              paddingTop: 2,
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}
            onClick={() => {
              const notes = getNotesForItem(item);
              const freqs = notes.length > 0 ? notes.map(n => getFrequency(n)) : item.noteFrequencies;
              return item.playMode === 'scale' ? playScale(freqs) : playChord(freqs);
            }}
          >
            {/* Render the same full mini keyboard as in Chords view (no cropping), scaled to fit */}
            {item.keySequence && item.keySequence.length > 0 ? (() => {
              const backward = item.backwardPadding || [];
              const ks = item.keySequence!;
              const forward = item.forwardPadding || [];
              const all = [...backward, ...ks, ...forward];
              const firstWhite = all.find(n => isWhite(n.replace(/^0/, '')))?.replace(/^0/, '');
              const lastWhite = [...all].reverse().find(n => isWhite(n.replace(/^0/, '')))?.replace(/^0/, '');
              if (!firstWhite || !lastWhite) return null;
              const whiteCount = getWhiteKeysInRange(firstWhite, lastWhite).length;
              const targetW = previewW;
              const targetH = previewH;
              const widthPx = WHITE_KEY_WIDTH * Math.max(whiteCount, 1);
              const scaleW = targetW / widthPx;
              const scaleH = targetH / WHITE_KEY_HEIGHT;
              const scale = Math.min(scaleW, scaleH);
              return (
                <div style={{ width: targetW, height: targetH, overflow: 'hidden' }}>
                  <div style={{ transform: `scale(${scale})`, transformOrigin: 'left top', width: widthPx }}>
                    <KeyboardViewSVG
                      backwardPadding={backward}
                      keySequence={ks}
                      forwardPadding={forward}
                    />
                  </div>
                </div>
              );
            })() : (
              // Fallback to old MiniKeyboard rendering when legacy items exist
              item.notes && item.root ? (
                <MiniKeyboard notes={item.notes.map(n => n.replace(/\d+$/, ''))} root={item.root} width={previewW} height={previewH} />
              ) : null
            )}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              width: '100%',
              padding: '0 8px',
              boxSizing: 'border-box'
            }}>
              <div style={{ 
                fontSize: 12, 
                color: '#1976d2', 
                fontWeight: 500, 
                textAlign: 'center', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                flex: 1
              }}>
                {item.type.split('/')[0].trim()}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedItems(prev => ({
                    ...prev,
                    [item.timestamp]: !prev[item.timestamp]
                  }));
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: expandedItems[item.timestamp] ? '#1976d2' : '#666',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '4px'
                }}
                title="Show frequencies"
              >
                {/* Tuning fork icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3h2v5a3 3 0 0 1-6 0V3h2v5a1 1 0 0 0 2 0V3zm8 0h2v5a3 3 0 0 1-6 0V3h2v5a1 1 0 0 0 2 0V3zm-3 11h2v7h-2v-7z"/>
                </svg>
              </button>
            </div>
            
            {expandedItems[item.timestamp] && (
              <div style={{
                width: '100%',
                marginTop: '8px',
                padding: '8px',
                background: '#f5f5f5',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '2px 4px' }}>Note</th>
                      <th style={{ textAlign: 'right', padding: '2px 4px' }}>Freq (Hz)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const notes = getNotesForItem(item);
                      if (notes.length > 0) {
                        return notes.map((n, i) => (
                          <tr key={i}>
                            <td style={{ padding: '2px 4px' }}>{n}</td>
                            <td style={{ textAlign: 'right', padding: '2px 4px' }}>{getFrequency(n).toFixed(2)}</td>
                          </tr>
                        ));
                      }
                      return item.noteFrequencies.map((freq, i) => (
                        <tr key={i}>
                          <td style={{ padding: '2px 4px' }}>{getNoteFromFrequency(freq)}</td>
                          <td style={{ textAlign: 'right', padding: '2px 4px' }}>{freq.toFixed(2)}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#e53935',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 3
              }}
              title="Remove from Scratch Pad"
              onClick={e => { e.stopPropagation(); removeItem(item.timestamp); }}
            >
              -
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScratchPad;
