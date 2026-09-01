import React, { useState } from "react";
import "./StatisticsPanel.css";
import { getColorLabel } from "../constants/colors";

export type Stats = {
  totalNotes: number;
  notesByAuthor: Record<string, number>;
  notesByColor: Record<string, number>;
  authors: string[];
  colors: string[];
};

interface StatisticsPanelProps {
  stats: Stats;
}

export function StatisticsPanel({ stats }: StatisticsPanelProps) {
  const [expandAuthor, setExpandAuthor] = useState(true);
  const [expandColor, setExpandColor] = useState(true);

  return (
    <div className="statistics-panel">
      <h3>📊 Statistics</h3>

      <div className="stat-total">
        Total Notes: <strong>{stats.totalNotes}</strong>
      </div>

      {/* Authors Section */}
      <div
        className="stat-section-header"
        onClick={() => setExpandAuthor(!expandAuthor)}
      >
        <span className="toggle-icon">{expandAuthor ? "▼" : "▶"}</span>
        <span className="section-title">
          By Author ({stats.authors.length})
        </span>
      </div>
      {expandAuthor && (
        <ul className="stat-list">
          {stats.authors.map((author) => (
            <li key={author} className="stat-item">
              <span className="stat-name">{author}</span>
              <span className="stat-count">{stats.notesByAuthor[author]}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Colors Section */}
      <div
        className="stat-section-header"
        onClick={() => setExpandColor(!expandColor)}
      >
        <span className="toggle-icon">{expandColor ? "▼" : "▶"}</span>
        <span className="section-title">By Color ({stats.colors.length})</span>
      </div>
      {expandColor && (
        <ul className="stat-list">
          {stats.colors.map((color) => (
            <li key={color} className="stat-item">
              <span className="stat-name">
                <span
                  className="color-dot"
                  style={{ backgroundColor: color }}
                ></span>
                {getColorLabel(color)}
              </span>
              <span className="stat-count">{stats.notesByColor[color]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
