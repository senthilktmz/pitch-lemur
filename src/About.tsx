import React from "react";

const About: React.FC = () => {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 16px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <img
          src={process.env.PUBLIC_URL + "/pitch-lemur-texted-icon.png"}
          alt="Pitch Lemur"
          style={{ width: '100%', height: 'auto', maxWidth: 512, borderRadius: 12, boxShadow: '0 2px 12px #0002' }}
        />
      </div>
      <div style={{ fontSize: 18, lineHeight: 1.7 }}>
        <p style={{ margin: '8px 0 16px', fontWeight: 600 }}>Pitch Lemur app has been created for</p>
        <p style={{ margin: '8px 0' }}>Everyone to learn music theory in structured and interactive way. Now you can</p>
        <p style={{ margin: '8px 0' }}>Lean Chords easily</p>
        <p style={{ margin: '8px 0' }}>Learn Scales easily</p>
        <p style={{ margin: '8px 0' }}>Understand the visualized keyboard chords and scales</p>
        <p style={{ margin: '8px 0' }}>Create your own chords and scales set as reference to learn or perform</p>
        <p style={{ margin: '8px 0' }}>Hear the chords and scales by clicking on the play buttons</p>
        <p style={{ margin: '8px 0' }}>Learn the chords and scales pattern formulas interactively</p>
        <p style={{ margin: '16px 0', fontWeight: 600 }}>Happy learning!</p>
      </div>
    </div>
  );
};

export default About;
