import React from "react";
import "./Board.css";

interface Note {
  id: string;
  text: string;
  x: number;
  y: number;
  author: string;
  color: string;
}

interface BoardProps {
  notes: Note[];
  width?: number;
  height?: number;
}

export function Board({ notes, width = 1200, height = 1200 }: BoardProps) {
  const maxX = Math.max(...notes.map((n) => n.x + 200), width);
  const maxY = Math.max(...notes.map((n) => n.y + 200), height);

  return (
    <div
      className="board"
      style={{
        width: `${maxX}px`,
        height: `${maxY}px`,
      }}
    >
      {notes.map((note) => (
        <div
          key={note.id}
          className="board-note"
          style={{
            left: `${note.x}px`,
            top: `${note.y}px`,
            backgroundColor: note.color,
          }}
        >
          <p className="board-note-text">{note.text}</p>
          <p className="board-note-author">👤 {note.author}</p>
        </div>
      ))}
    </div>
  );
}
