import React from "react";
import './FilterPanel.css';

interface FilterPanelProps {
  authors: string[];
  colors: string[];
  selectedAuthor: string | undefined;
  selectedColor: string | undefined;
  onAuthorChange: (author: string | undefined) => void;
  onColorChange: (color: string | undefined) => void;
  onReset: () => void;
}

export function FilterPanel({
  authors,
  colors,
  selectedAuthor,
  selectedColor,
  onAuthorChange,
  onColorChange,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="filter-panel">
      <h3>Filters</h3>

      {/* Author dropdown */}
      <div className="filter-group">
        <label htmlFor="author-select">Author:</label>
        <select
          id="author-select"
          value={selectedAuthor || ""}
          onChange={(e) => onAuthorChange(e.target.value || undefined)}
        >
          <option value="">All authors</option>
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>

      {/* Color dropdown */}
      <div className="filter-group">
        <label htmlFor="color-select">Color:</label>
        <select
          id="color-select"
          value={selectedColor || ""}
          onChange={(e) => onColorChange(e.target.value || undefined)}
        >
          <option value="">All colors</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      {/* Reset button */}
      <button onClick={onReset} className="reset-btn">
        Reset Filters
      </button>
    </div>
  );
}
