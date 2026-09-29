import cors from 'cors';
import express from 'express';
import { createNotesRouter } from './routes/notes';
import { NotesService } from './services/notes';

export function createApp(notesService: NotesService) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/notes', createNotesRouter(notesService));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
