import "./Intervals.css";
import React, { useState } from "react";
import { CHORDS_PATTERNS_ARRAY } from "./patterns/Chords";
import { SCALES_PATTERNS_ARRAY } from "./patterns/Scales";

const intervalMatrix = [
  ["", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "6", "♭7", "7"],
  ["UNISON", "1", "", "", "", "", "", "", "", "", "", "", ""],
  ["MINOR 2ND", "1", "♭2", "", "", "", "", "", "", "", "", "", ""],
  ["MAJOR 2ND", "1", "♭2", "2", "", "", "", "", "", "", "", "", ""],
  ["MINOR 3RD", "1", "♭2", "2", "♭3", "", "", "", "", "", "", "", ""],
  ["MAJOR 3RD", "1", "♭2", "2", "♭3", "3", "", "", "", "", "", "", ""],
  ["PERFECT 4TH", "1", "♭2", "2", "♭3", "3", "4", "", "", "", "", "", ""],
  ["DIMINISHED 5TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "", "", "", "", ""],
  ["PERFECT 5TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "", "", "", ""],
  ["MINOR 6TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "", "", ""],
  ["MAJOR 6TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "6", "", ""],
  ["MINOR 7TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "6", "♭7", ""],
  ["MAJOR 7TH", "1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "6", "♭7", "7"]
];

const intervalDescriptions = [
  ["UNISON", "0 STEPS"],
  ["MINOR 2ND", "½ STEP"],
  ["MAJOR 2ND", "1 WHOLE STEP"],
  ["MINOR 3RD", "1½ STEPS"],
  ["MAJOR 3RD", "2 WHOLE STEPS"],
  ["PERFECT 4TH", "2½ STEPS"],
  ["DIMINISHED 5TH", "3 WHOLE STEPS"],
  ["PERFECT 5TH", "3½ STEPS"],
  ["MINOR 6TH", "4 WHOLE STEPS"],
  ["MAJOR 6TH", "4½ STEPS"],
  ["MINOR 7TH", "5 WHOLE STEPS"],
  ["MAJOR 7TH", "5½ STEPS"]
];

const LEGEND_TYPES = [
  { label: "Unison", className: "unison" },
  { label: "Minor", className: "minor" },
  { label: "Major", className: "major" },
  { label: "Perfect", className: "perfect" },
  { label: "Diminished", className: "diminished" },
];

const ROW_TYPE = [
  "unison",   // 1
  "minor",    // 2
  "major",    // 3
  "minor",    // 4
  "major",    // 5
  "perfect",  // 6
  "diminished",// 7
  "perfect",  // 8
  "minor",    // 9
  "major",    // 10
  "minor",    // 11
  "major"     // 12
];

const getRowColor = (rowIdx: number) => {
  switch (rowIdx) {
    case 1: return "unison";
    case 2: return "minor";
    case 3: return "major";
    case 4: return "minor";
    case 5: return "major";
    case 6: return "perfect";
    case 7: return "diminished";
    case 8: return "perfect";
    case 9: return "minor";
    case 10: return "major";
    case 11: return "minor";
    case 12: return "major";
    default: return "";
  }
};

const Intervals: React.FC = () => {
  const [activeTypes, setActiveTypes] = useState<string[]>([]);

  const toggleType = (type: string) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const showAll = activeTypes.length === 0;

  return (
    <div className="intervals-container">
      {/*<h2>Musical Intervals Reference</h2>*/}
      {/*<table className="intervals-table">*/}
      {/*  <thead>*/}
      {/*    <tr>*/}
      {/*      <th>Interval</th>*/}
      {/*      <th>Description</th>*/}
      {/*      {intervalMatrix[0].slice(1).map((header, idx) => (*/}
      {/*        <th key={idx}>{header}</th>*/}
      {/*      ))}*/}
      {/*    </tr>*/}
      {/*  </thead>*/}
      {/*  <tbody>*/}
      {/*    {intervalMatrix.slice(1).map((row, rowIdx) => {*/}
      {/*      const rowType = ROW_TYPE[rowIdx];*/}
      {/*      if (!showAll && !activeTypes.includes(rowType)) return null;*/}
      {/*      const intervalCells = row.slice(1);*/}
      {/*      const firstIdx = intervalCells.findIndex(cell => cell !== "");*/}
      {/*      const lastIdx = intervalCells.length - 1 - [...intervalCells].reverse().findIndex(cell => cell !== "");*/}
      {/*      return (*/}
      {/*        <tr key={rowIdx} className={getRowColor(rowIdx + 1)}>*/}
      {/*          <td>{row[0]}</td>*/}
      {/*          <td>{intervalDescriptions[rowIdx][1]}</td>*/}
      {/*          {intervalCells.map((cell, colIdx) => {*/}
      {/*            if (!cell) return <td key={colIdx}></td>;*/}
      {/*            if (colIdx === firstIdx || colIdx === lastIdx) {*/}
      {/*              return <td key={colIdx}><b>{cell}</b></td>;*/}
      {/*            }*/}
      {/*            return <td key={colIdx} style={{ color: '#bbb' }}>{cell}</td>;*/}
      {/*          })}*/}
      {/*        </tr>*/}
      {/*      );*/}
      {/*    })}*/}
      {/*  </tbody>*/}
      {/*</table>*/}
      {/* Extended intervals mapping for scales and chords */}
      <details className="section section-ref" open>
        <summary>Musical Intervals Reference for Scales and Chords</summary>
        {(() => {
        const rows = [
          { f: '1', s: '1', off: 0,  note: 'C',              name: 'Root (1)',                                       steps: '0 STEPS' },
          { f: '2♭', s: '1♯', off: 1,  note: 'C♯ / D♭',       name: 'Minor 2nd (♭2)',                                 steps: '½ STEP' },
          { f: '2', s: '2', off: 2,  note: 'D',              name: 'Major 2nd (2)',                                  steps: '1 WHOLE STEP' },
          { f: '3♭', s: '2♯', off: 3,  note: 'D♯ / E♭',       name: 'Minor 3rd (♭3) / Augmented 2nd (♯2)',            steps: '1½ STEPS' },
          { f: '3', s: '3', off: 4,  note: 'E',              name: 'Major 3rd (3)',                                  steps: '2 WHOLE STEPS' },
          { f: '4', s: '4', off: 5,  note: 'F',              name: 'Perfect 4th (4)',                                steps: '2½ STEPS' },
          { f: '5♭', s: '4♯', off: 6,  note: 'F♯ / G♭',       name: 'Diminished 5th (♭5) / Augmented 4th (♯4)',       steps: '3 WHOLE STEPS' },
          { f: '5', s: '5', off: 7,  note: 'G',              name: 'Perfect 5th (5)',                                steps: '3½ STEPS' },
          { f: '6♭', s: '5♯', off: 8,  note: 'G♯ / A♭',       name: 'Minor 6th (♭6) / Augmented 5th (♯5)',            steps: '4 WHOLE STEPS' },
          { f: '6', s: '6', off: 9,  note: 'A',              name: 'Major 6th (6)',                                  steps: '4½ STEPS' },
          { f: '7♭', s: '6♯', off: 10, note: 'A♯ / B♭',       name: 'Minor 7th (♭7)',                                 steps: '5 WHOLE STEPS' },
          { f: '7', s: '7', off: 11, note: 'B',              name: 'Major 7th (7)',                                  steps: '5½ STEPS' },
          { f: '8', s: '8', off: 12, note: 'C',              name: 'Octave (8ve)',                                   steps: '6 WHOLE STEPS' },
          { f: '9♭', s: '8♯', off: 13, note: 'C♯ / D♭',       name: 'Minor 9th (♭9)',                                 steps: '6½ STEPS' },
          { f: '9', s: '9', off: 14, note: 'D',              name: 'Major 9th (9)',                                  steps: '7 WHOLE STEPS' },
          { f: '10♭', s: '9♯', off: 15, note: 'D♯ / E♭',       name: 'Augmented 9th (♯9) / Minor 10th',                 steps: '7½ STEPS' },
          { f: '10', s: '10', off: 16, note: 'E',              name: 'Major 10th (M3 an octave higher)',               steps: '8 WHOLE STEPS' },
          { f: '11', s: '11', off: 17, note: 'F',              name: 'Perfect 11th (11)',                              steps: '8½ STEPS' },
          { f: '12♭', s: '11♯', off: 18, note: 'F♯ / G♭',       name: 'Augmented 11th (♯11)',                           steps: '9 WHOLE STEPS' },
          { f: '12', s: '12', off: 19, note: 'G',              name: 'Perfect 12th (P5 an octave higher)',             steps: '9½ STEPS' },
          { f: '13♭', s: '12♯', off: 20, note: 'G♯ / A♭',       name: 'Minor 13th (♭13)',                               steps: '10 WHOLE STEPS' },
          { f: '13', s: '13', off: 21, note: 'A',              name: 'Major 13th (13)',                                steps: '10½ STEPS' },
        ];
        return (
          <div style={{ overflowX: 'auto' }}>
            <table className="intervals-table" style={{ minWidth: 760 }}>
              <thead>
                <tr>
                  <th>Degree (flats)</th>
                  <th>Degree (sharps)</th>
                  <th>Description</th>
                  <th>Note (from C)</th>
                  <th>Interval Name</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  // alternate row colors to match section-specific theme
                  const palette = ['ref-a', 'ref-b', 'ref-c', 'ref-d', 'ref-e'];
                  const cls = palette[i % palette.length];
                  return (
                    <tr key={i} className={cls}>
                      <td>{r.f}</td>
                      <td>{r.s}</td>
                      <td>{r.steps}</td>
                      <td>{r.note}</td>
                      <td>{r.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })()}
      </details>

      {/* Chord patterns table */}
      <details className="section section-chords" open>
        <summary>Chord Patterns Reference</summary>
        {(() => {
        // 22-degree column headers (flats notation for consistency)
        const DEG_COLUMNS = [
          "1","b2","2","b3","3","4","b5","5","b6","6","b7","7","8","b9","9","10♭","10","11","12♭","12","13♭","13"
        ];
        // Map degree strings (as used in patterns) to 0..21 offsets
        const degreeToOffset: Record<string, number> = {
          "1": 0, "b2": 1, "2": 2, "#2": 3, "b3": 3, "3": 4, "4": 5, "#4": 6, "b5": 6, "5": 7, "#5": 8, "b6": 8, "6": 9, "bb7": 9, "b7": 10, "7": 11,
          "8": 12, "b9": 13, "9": 14, "#9": 15, "b10": 15, "10": 16, "11": 17, "#11": 18, "b12": 18, "12": 19, "b13": 20, "13": 21
        };
        // Build grouped rows by header sections in CHORDS_PATTERNS_ARRAY
        const groups: { label: string; rows: { name: string; type: string; degrees: string[] }[] }[] = [];
        let currentGroup = "";
        let bucket: { name: string; type: string; degrees: string[] }[] = [];
        const flush = () => {
          if (currentGroup && bucket.length) {
            groups.push({ label: currentGroup, rows: bucket });
            bucket = [];
          }
        };
        for (const row of CHORDS_PATTERNS_ARRAY as any[]) {
          if (!row || row.length === 0) continue;
          const name = row[0];
          if (typeof name === 'string' && name.startsWith('---') && name.endsWith('---')) {
            flush();
            currentGroup = name.slice(3, -3).trim();
            continue;
          }
          bucket.push({ name, type: currentGroup, degrees: row.slice(1) });
        }
        flush();

        // Render a separate table for each group
        return (
          <div>
            {groups.map((g) => (
              <div key={g.label} style={{ marginTop: 24 }}>
                <h3 style={{ margin: '8px 0 8px 0' }}>{g.label} Chords Patterns Reference</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="intervals-table" style={{ minWidth: 980 }}>
                    <thead>
                      <tr>
                        <th>Chord name</th>
                        <th>Type</th>
                        {DEG_COLUMNS.map((deg, i) => (
                          <th key={i}>{deg}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {g.rows.map((r, idx) => {
                        // Build offset->label map using the actual labels from the chord
                        const labelByOffset: Record<number, string> = {};
                        for (const d of r.degrees) {
                          const off = degreeToOffset[d];
                          if (off !== undefined) labelByOffset[off] = d;
                        }
                        // Green gradient-like palette for chords section rows
                        const palette = ['chords-a', 'chords-b', 'chords-c', 'chords-d', 'chords-e'];
                        const rowClass = palette[idx % palette.length];
                        return (
                          <tr key={g.label + '-' + idx} className={rowClass}>
                            <td style={{ fontWeight: 600 }}>{r.name}</td>
                            <td style={{ color: '#555' }}>{r.type}</td>
                            {DEG_COLUMNS.map((_, colIdx) => {
                              const has = labelByOffset[colIdx] !== undefined;
                              const label = has ? labelByOffset[colIdx] : DEG_COLUMNS[colIdx];
                              return (
                                <td key={colIdx} style={{ textAlign: 'center', color: has ? '#000' : '#bbb', fontWeight: has ? 700 as any : 400 }}>
                                  {label}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
      </details>
      {/* Scales patterns tables, grouped with a different color scheme (after chords) */}
      <details className="section section-scales" open>
        <summary>Scale Patterns Reference</summary>
        {(() => {
        // 12-degree columns (within one octave)
        const DEG_COLUMNS = ["1","b2","2","b3","3","4","b5","5","b6","6","b7","7"];
        const degreeToSemitone: Record<string, number> = {
          "1":0, "b2":1, "2":2, "#2":3, "b3":3, "3":4, "4":5, "#4":6, "b5":6, "5":7, "#5":8, "b6":8, "6":9, "bb7":9, "b7":10, "7":11
        };
        const groups: { label: string; rows: { name: string; degrees: string[] }[] }[] = [];
        let currentGroup = "";
        let bucket: { name: string; degrees: string[] }[] = [];
        const flush = () => {
          if (currentGroup && bucket.length) {
            groups.push({ label: currentGroup, rows: bucket });
            bucket = [];
          }
        };
        for (const row of SCALES_PATTERNS_ARRAY as any[]) {
          if (!row || row.length === 0) continue;
          const name = row[0];
          if (typeof name === 'string' && name.startsWith('---') && name.endsWith('---')) {
            flush();
            currentGroup = name.slice(3, -3).trim();
            continue;
          }
          bucket.push({ name, degrees: row.slice(1) });
        }
        flush();

        return (
          <div>
            {groups.map((g) => (
              <div key={g.label} style={{ marginTop: 24 }}>
                <h3 style={{ margin: '8px 0 8px 0' }}>{g.label} Scales Patterns Reference</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="intervals-table" style={{ minWidth: 820 }}>
                    <thead>
                      <tr>
                        <th>Scale name</th>
                        {DEG_COLUMNS.map((deg, i) => (
                          <th key={i}>{deg}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {g.rows.map((r, idx) => {
                        const labelBySemi: Record<number, string> = {};
                        for (const d of r.degrees) {
                          const semi = degreeToSemitone[d];
                          if (semi !== undefined) labelBySemi[semi] = d;
                        }
                        // Different color scheme for scales rows
                        const palette = ['scales-a', 'scales-b', 'scales-c', 'scales-d', 'scales-e'];
                        const rowClass = palette[idx % palette.length];
                        return (
                          <tr key={g.label + '-' + idx} className={rowClass}>
                            <td style={{ fontWeight: 600 }}>{r.name}</td>
                            {DEG_COLUMNS.map((_, colIdx) => {
                              const has = labelBySemi[colIdx] !== undefined;
                              const label = has ? labelBySemi[colIdx] : DEG_COLUMNS[colIdx];
                              return (
                                <td key={colIdx} style={{ textAlign: 'center', color: has ? '#000' : '#bbb', fontWeight: has ? 700 as any : 400 }}>
                                  {label}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
      </details>
    </div>
  );
};

export default Intervals;
