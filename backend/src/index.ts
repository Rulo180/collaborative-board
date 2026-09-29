import * as path from 'path';
import { NotesService } from './services/notes';
import { createApp } from './app';

const PORT = 5001;

const notesDataPath = path.join(__dirname, '../../data/notes.json');
const notesService = new NotesService(notesDataPath);
const app = createApp({ notesService });

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});