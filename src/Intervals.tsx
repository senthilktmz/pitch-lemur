import "./Intervals.css";
import React, { useState } from "react";
import { CHORDS_PATTERNS_ARRAY } from "./patterns/Chords";

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
      <h2>Musical Intervals Reference</h2>
      <table className="intervals-table">
        <thead>
          <tr>
            <th>Interval</th>
            <th>Description</th>
            {intervalMatrix[0].slice(1).map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {intervalMatrix.slice(1).map((row, rowIdx) => {
            const rowType = ROW_TYPE[rowIdx];
            if (!showAll && !activeTypes.includes(rowType)) return null;
            const intervalCells = row.slice(1);
            const firstIdx = intervalCells.findIndex(cell => cell !== "");
            const lastIdx = intervalCells.length - 1 - [...intervalCells].reverse().findIndex(cell => cell !== "");
            return (
              <tr key={rowIdx} className={getRowColor(rowIdx + 1)}>
                <td>{row[0]}</td>
                <td>{intervalDescriptions[rowIdx][1]}</td>
                {intervalCells.map((cell, colIdx) => {
                  if (!cell) return <td key={colIdx}></td>;
                  if (colIdx === firstIdx || colIdx === lastIdx) {
                    return <td key={colIdx}><b>{cell}</b></td>;
                  }
                  return <td key={colIdx} style={{ color: '#bbb' }}>{cell}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="intervals-legend">
        {LEGEND_TYPES.map((legend, idx) => (
          <button
            key={legend.className}
            className={`legend-btn ${legend.className}${activeTypes.includes(legend.className) ? ' active' : ''}`}
            onClick={() => toggleType(legend.className)}
          >
            {legend.label}
          </button>
        ))}
      </div>

      {/* Chord patterns table */}
      <h2 style={{ marginTop: 36 }}>Chord Patterns Reference</h2>
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
                        // Alternate background classes using the same palette as the intervals table
                        const palette = ['unison', 'minor', 'major', 'perfect', 'diminished'];
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
    </div>
  );
};

export default Intervals;
