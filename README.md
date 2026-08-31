# Collaborative Board Activity Explorer

A full-stack application for exploring and analyzing activity on a collaborative board. Load sticky notes from JSON, filter by author and color, view spatial positioning, and analyze statistics.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Data**: JSON files (no database)

## Prerequisites

- Node.js v18 or higher
- npm or yarn

## Installation

```bash
# Clone and enter directory
git clone <repository-url>
cd collaborative-board
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5001`

### 2. Frontend Setup (in new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

The frontend will automatically open in your browser.

## Features

- ✅ **Load Notes** - Display sticky notes from JSON file
- ✅ **Spatial Board** - View notes at their x,y coordinates with grid reference
- ✅ **Filter by Author** - Dropdown to filter notes by creator
- ✅ **Filter by Color** - Dropdown to filter notes by color
- ✅ **Statistics** - Collapsible panels showing notes per author and color
- ✅ **Real-time Updates** - Statistics update instantly when filters change

## Project Structure

```
collaborative-board/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Server entry point
│   │   ├── services/
│   │   │   └── notes.ts          # Note loading and filtering logic
│   │   └── routes/
│   │       └── notes.ts          # API endpoints
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main app component
│   │   ├── index.css             # Global styles
│   │   ├── App.css               # App component styles
│   │   └── components/
│   │       ├── FilterPanel.tsx   # Filter UI component
│   │       ├── Board.tsx         # Spatial board view
│   │       └── StatisticsPanel.tsx # Statistics display
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
├── data/
│   └── notes.json                # Sample notes data
└── README.md
```

## API Endpoints

### Get All Notes

```bash
GET /api/notes
```

Returns all notes with count.

### Filter Notes

```bash
GET /api/notes/filter?author=user_7&color=yellow
```

Query parameters:

- `author` - Filter by author name
- `color` - Filter by color
- Both can be combined

## Usage

1. Ensure backend is running on port 5001
2. Open frontend at `http://localhost:5173`
3. Notes automatically load from `notes.json`
4. Use FilterPanel on left sidebar:
- Select author from dropdown
- Select color from dropdown
- Click "Reset Filters" to clear
5. View statistics in Statistics panel below filters
6. Notes display spatially on the board with grid reference dots
7. Hover over notes to see details

## Data Format

Notes in `notes.json` should follow this schema:

```json
{
  "id": "note_123",
  "text": "Note content here",
  "x": 412,
  "y": 891,
  "author": "user_7",
  "color": "yellow"
}
```

## Next Steps

See `WRITEUP.md` for architectural decisions, trade-offs, and planned enhancements.
