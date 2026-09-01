import { useState, useEffect } from "react";
import { FilterPanel } from "./components/FilterPanel";
import { Board } from "./components/Board";
import { StatisticsPanel, Stats } from "./components/StatisticsPanel";
import "./App.css";

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
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState("");
  const [statistics, setStatistics] = useState<Stats | null>(null);

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
    calculateStatistics(filteredNotes);
  }, [filteredNotes]);

  useEffect(() => {
    const controller = new AbortController();
    fetchFilteredNotes(selectedAuthor, selectedColor, controller.signal);

    return () => controller.abort();
  }, [selectedAuthor, selectedColor]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      const allNotes = data.notes || [];

      setNotes(allNotes);
      extractFilterOptions(allNotes);
    } catch (err) {
      setError(`Failed to load notes: ${err}`);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredNotes = async (
    author?: string,
    color?: string,
    signal?: AbortSignal
  ) => {
    try {
      setFilterLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (author) {
        params.set("author", author);
      }
      if (color) {
        params.set("color", color);
      }

      const query = params.toString();
      const url = query ? `/api/notes?${query}` : "/api/notes";

      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error("Failed to fetch filtered notes");
      }

      const data = await response.json();
      setFilteredNotes(data.notes || []);
      setNotesCount(data.total ?? data.count ?? 0);
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        return;
      }

      setError(`Failed to apply filters: ${err}`);
      setFilteredNotes([]);
      setNotesCount(0);
    } finally {
      setFilterLoading(false);
    }
  };

  const calculateStatistics = (filteredNotes: Note[]) => {
    const stats: Stats = {
      totalNotes: filteredNotes.length,
      notesByAuthor: {},
      notesByColor: {},
      authors: [],
      colors: [],
    };

    filteredNotes.forEach((note) => {
      stats.notesByAuthor[note.author] =
        (stats.notesByAuthor[note.author] || 0) + 1;
      stats.notesByColor[note.color] =
        (stats.notesByColor[note.color] || 0) + 1;
    });

    stats.authors = Object.keys(stats.notesByAuthor).sort();
    stats.colors = Object.keys(stats.notesByColor).sort();

    setStatistics(stats);
  };

  const extractFilterOptions = (notesList: Note[]) => {
    const uniqueAuthors = Array.from(new Set(notesList.map((n) => n.author)));
    const uniqueColors = Array.from(new Set(notesList.map((n) => n.color)));
    setAuthors(uniqueAuthors);
    setColors(uniqueColors);
  };

  const handleReset = () => {
    setSelectedAuthor(undefined);
    setSelectedColor(undefined);
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
          <div className="sidebar">
            <FilterPanel
              authors={authors}
              colors={colors}
              selectedAuthor={selectedAuthor}
              selectedColor={selectedColor}
              onAuthorChange={setSelectedAuthor}
              onColorChange={setSelectedColor}
              onReset={handleReset}
            />
            {statistics && <StatisticsPanel stats={statistics} />}
          </div>
          <div className="notes-section">
            <div className="stats">
              Showing <strong>{filteredNotes.length}</strong> of{" "}
              <strong>{notesCount}</strong> notes
            </div>
            {filterLoading && <div className="loading">Updating results...</div>}
            {filteredNotes.length === 0 ? (
              <p className="no-results">No notes match your filters</p>
            ) : (
              <Board notes={filteredNotes} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
