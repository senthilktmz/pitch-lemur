import React from "react";

const About: React.FC = () => {
  return (
    <div style={{ padding: '24px 16px 56px', background: 'linear-gradient(180deg,#f8fbff,#ffffff)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 36, lineHeight: 1.15 }}>Pitch Lemur</h1>
          <p style={{ margin: 0, fontSize: 18, color: '#5a6777' }}>
            Learn music theory the interactive way — visualize, hear, and master chords and scales.
          </p>
        </div>

        {/* Content Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 24,
            padding: 20,
            borderRadius: 14,
            background: '#fff',
            boxShadow: '0 6px 24px #00000014',
          }}
          className="about-grid-2col"
        >
          {/* Image */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={process.env.PUBLIC_URL + "/pitch-lemur-texted-icon.png"}
              alt="Pitch Lemur"
              style={{ width: '100%', height: 'auto', maxWidth: 540, borderRadius: 12, boxShadow: '0 2px 12px #0002' }}
            />
          </div>

          {/* Benefits */}
          <div style={{ alignSelf: 'center' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 24 }}>Built for everyone</h2>
            <p style={{ margin: '0 0 16px', fontSize: 16, color: '#5a6777' }}>
              Learn music theory in a structured and interactive way. Practice visually and aurally with tools designed for clarity and speed.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '10px 12px', borderRadius: 10 }}>
                <span role="img" aria-label="check" style={{ fontSize: 18 }}>✅</span> Easy learning of <strong>Chords</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '10px 12px', borderRadius: 10 }}>
                <span role="img" aria-label="check" style={{ fontSize: 18 }}>✅</span> Easy learning of <strong>Scales</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '10px 12px', borderRadius: 10 }}>
                <span role="img" aria-label="keyboard" style={{ fontSize: 18 }}>🎹</span> Understand visualized keyboard chords and scales
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '10px 12px', borderRadius: 10 }}>
                <span role="img" aria-label="music" style={{ fontSize: 18 }}>🎵</span> Create your own chords and scales set to learn or perform
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '10px 12px', borderRadius: 10 }}>
                <span role="img" aria-label="headphones" style={{ fontSize: 18 }}>🎧</span> Hear chords and scales with the Play buttons
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '10px 12px', borderRadius: 10 }}>
                <span role="img" aria-label="check" style={{ fontSize: 18 }}>✅</span> Learn pattern formulas interactively
              </li>
            </ul>
            <p style={{ margin: '18px 0 0', fontWeight: 600, fontSize: 18 }}>Happy learning!</p>
          </div>
        </div>

        {/* Responsive tweak for larger screens */}
        <style>{`
          @media (min-width: 920px) {
            .about-grid-2col { grid-template-columns: 1fr 1fr; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default About;
