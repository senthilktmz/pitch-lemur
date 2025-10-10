import React from "react";

interface MenuBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ activeTab, setActiveTab }) => (
  <nav
    style={{
      display: "flex",
      alignItems: "center",
      background: "#fff",
      borderBottom: "1.5px solid #e0e6ef",
      position: "sticky",
      top: 0,
      zIndex: 10,
      width: "100%",
      minHeight: 80,
      padding: "0 0 0 0"
    }}
  >
    <img
      src={process.env.PUBLIC_URL + "/pitch-lemur-icon.png"}
      alt="App Logo"
      width={72}
      height={72}
      draggable={false}
      style={{
        width: 72,
        height: 72,
        aspectRatio: '1 / 1',
        objectFit: 'contain',
        background: '#fff',
        padding: 2,
        borderRadius: 8,
        boxShadow: '0 0 0 1px #e0e6ef inset',
        margin: "0 18px 0 14px",
        verticalAlign: "middle",
        display: "block"
      }}
    />
    <div style={{ display: "flex", alignItems: "center", height: "80px" }}>
        <div className="menu-bar-tabs" style={{display: 'flex', gap: 24, alignItems: 'center'}}>
            <button
                style={{
                    padding: "10px 24px",
                    border: "none",
                    borderBottom: activeTab === "chords" ? "3px solid #007bff" : "none",
                    background: "none",
                    fontWeight: activeTab === "chords" ? "bold" : "normal",
                    cursor: "pointer"
                }}
                onClick={() => setActiveTab("chords")}
            >
                Chords
            </button>
            <button
                style={{
                    padding: "10px 24px",
                    border: "none",
                    borderBottom: activeTab === "scales" ? "3px solid #007bff" : "none",
                    background: "none",
                    fontWeight: activeTab === "scales" ? "bold" : "normal",
                    cursor: "pointer"
                }}
                onClick={() => setActiveTab("scales")}
            >
                Scales
            </button>

            {/*
            <button
                style={{
                    padding: "10px 24px",
                    border: "none",
                    borderBottom: activeTab === "carnatic_scales" ? "3px solid #007bff" : "none",
                    background: "none",
                    fontWeight: activeTab === "carnatic_scales" ? "bold" : "normal",
                    cursor: "pointer"
                }}
                onClick={() => setActiveTab("carnatic_scales")}
            >
                Carnatic Scales
            </button>
            */}

            <button
                style={{
                    padding: "10px 24px",
                    border: "none",
                    borderBottom: activeTab === "scratchpad" ? "3px solid #007bff" : "none",
                    background: "none",
                    fontWeight: activeTab === "scratchpad" ? "bold" : "normal",
                    cursor: "pointer"
                }}
                onClick={() => setActiveTab("scratchpad")}
            >
                Scratch Pad
            </button>

            <button
                style={{
                    padding: "10px 24px",
                    border: "none",
                    borderBottom: activeTab === "intervals" ? "3px solid #007bff" : "none",
                    background: "none",
                    fontWeight: activeTab === "intervals" ? "bold" : "normal",
                    cursor: "pointer"
                }}
                onClick={() => setActiveTab("intervals")}
            >
                Intervals & Patterns
            </button>

            <button
                style={{
                    padding: "10px 24px",
                    border: "none",
                    borderBottom: activeTab === "about" ? "3px solid #007bff" : "none",
                    background: "none",
                    fontWeight: activeTab === "about" ? "bold" : "normal",
                    cursor: "pointer"
                }}
                onClick={() => setActiveTab("about")}
            >
                About
            </button>

        </div>
    </div>
  </nav>
);

export default MenuBar;
