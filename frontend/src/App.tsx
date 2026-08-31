import { useState, useEffect } from 'react';
// import './App.css';

interface Note {
  id: string;
  text: string;
  x: number;
  y: number;
  author: string;
  color: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesCount, setNotesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/notes');
      const data = await response.json();
      setNotes(data.notes || []);
      setNotesCount(data.count || 0);
    } catch (err) {
      setError(`Failed to load notes: ${err}`);
      setNotes([]);
      setNotesCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>📋 Collaborative Board Activity Explorer</h1>
        <p>Explore sticky notes from your brainstorming session</p>
      </header>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading notes...</div>
      ) : (
        <div className="notes-section">
          <div className="stats">
            Total notes: <strong>{notesCount}</strong>
          </div>
          <div className="notes-grid">
            {notes.map((note) => (
              <div
                key={note.id}
                className="note-card"
                style={{ backgroundColor: note.color }}
              >
                <p className="note-text">{note.text}</p>
                <div className="note-meta">
                  <span className="author">👤 {note.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
