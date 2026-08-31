import { useState, useEffect } from "react";
import { FilterPanel } from "./components/FilterPanel";
import './App.css';

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
  const [error, setError] = useState("");

  // Filter state
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [authors, setAuthors] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedAuthor, selectedColor, notes]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/api/notes");
      const data = await response.json();
      const notes = data.notes || [];
      setNotes(notes);
      setNotesCount(data.count || 0);
      setFilteredNotes(notes);
      extractFilterOptions(notes);
    } catch (err) {
      setError(`Failed to load notes: ${err}`);
      setNotes([]);
      setNotesCount(0);
    } finally {
      setLoading(false);
    }
  };

  const extractFilterOptions = (notesList: Note[]) => {
    const uniqueAuthors = Array.from(new Set(notesList.map((n) => n.author)));
    const uniqueColors = Array.from(new Set(notesList.map((n) => n.color)));
    setAuthors(uniqueAuthors);
    setColors(uniqueColors);
  };

  const applyFilters = () => {
    let filtered = notes;

    if (selectedAuthor) {
      filtered = filtered.filter((note) => note.author === selectedAuthor);
    }

    if (selectedColor) {
      filtered = filtered.filter((note) => note.color === selectedColor);
    }

    setFilteredNotes(filtered);
  };

  const handleReset = () => {
    setSelectedAuthor(undefined);
    setSelectedColor(undefined);
    setFilteredNotes(notes);
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
        <div className="app-content">
          <FilterPanel
            authors={authors}
            colors={colors}
            selectedAuthor={selectedAuthor}
            selectedColor={selectedColor}
            onAuthorChange={setSelectedAuthor}
            onColorChange={setSelectedColor}
            onReset={handleReset}
          />
          <div className="notes-section">
            <div className="stats">
              Showing <strong>{filteredNotes.length}</strong> of{" "}
              <strong>{notesCount}</strong> notes
            </div>
            <div className="notes-grid">
              {filteredNotes.length === 0 ? (
                <p className="no-results">No notes match your filters</p>
              ) : (
                filteredNotes.map((note) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
