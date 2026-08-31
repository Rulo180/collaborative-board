import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { NotesService } from './services/notes';
import { createNotesRouter } from './routes/notes';

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

const notesDataPath = path.join(__dirname, '../../data/notes.json');
const notesService = new NotesService(notesDataPath);

// Routes
app.use('/api/notes', createNotesRouter(notesService));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});