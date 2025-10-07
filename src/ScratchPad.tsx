import React, { useState } from "react";
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
}

interface ScratchPadProps {
  items: Array<ScratchPadItem>;
  removeItem: (timestamp: number) => void;
}

const ScratchPad: React.FC<ScratchPadProps> = ({ items, removeItem }) => {
  // Zoom for preview thumbnails (1 = 100%)
  const [zoom, setZoom] = useState(1.25);
  const BASE_W = 100;
  const BASE_H = 32;
  const previewW = Math.round(BASE_W * zoom);
  const previewH = Math.round(BASE_H * zoom);
  const cardW = Math.max(120, previewW + 20);
  const cardH = Math.max(78, previewH + 46);
  const playChord = (noteFrequencies: number[]) => {
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '12px',
          marginTop: 32,
          justifyItems: 'center',
          alignItems: 'center',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.timestamp + '-' + idx}
            style={{
              width: cardW,
              height: cardH,
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
              margin: 'auto',
              paddingTop: 2,
              overflow: 'visible'
            }}
            onClick={() => playChord(item.noteFrequencies)}
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
            <div style={{ fontSize: 12, color: '#1976d2', fontWeight: 500, marginTop: 2, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: previewW }}>
              {item.type.split('/')[0].trim()}
            </div>
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
