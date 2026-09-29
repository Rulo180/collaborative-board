import express from 'express';
import request from 'supertest';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { createNotesRouter } from '../src/routes/notes';
import { NotesService } from '../src/services/notes';

describe('GET /api/notes', () => {
  const dataPath = path.join(process.cwd(), '../data/notes.json');

  const buildApp = () => {
    const app = express();
    const service = new NotesService(dataPath);

    app.use(express.json());
    app.use('/api/notes', createNotesRouter(service));

    return app;
  };

  it('returns all notes with count and total', async () => {
    const app = buildApp();

    const response = await request(app).get('/api/notes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.notes)).toBe(true);
    expect(response.body.notes).toHaveLength(8);
    expect(response.body.count).toBe(8);
    expect(response.body.total).toBe(8);
  });

  it('filters by author query parameter', async () => {
    const app = buildApp();

    const response = await request(app).get('/api/notes').query({ author: 'Emilia' });

    expect(response.status).toBe(200);
    expect(response.body.notes).toHaveLength(3);
    expect(response.body.notes.every((note: { author: string }) => note.author === 'Emilia')).toBe(true);
  });

  it('filters by color query parameter', async () => {
    const app = buildApp();

    const response = await request(app).get('/api/notes').query({ color: '#2BBBD7' });

    expect(response.status).toBe(200);
    expect(response.body.notes).toHaveLength(2);
    expect(response.body.notes.every((note: { color: string }) => note.color === '#2BBBD7')).toBe(true);
  });

  it('applies author and color query parameters together', async () => {
    const app = buildApp();

    const response = await request(app)
      .get('/api/notes')
      .query({ author: 'Florencia', color: '#76C457' });

    expect(response.status).toBe(200);
    expect(response.body.notes).toHaveLength(1);
    expect(response.body.notes[0].id).toBe('note_4');
    expect(response.body.count).toBe(1);
    expect(response.body.total).toBe(1);
  });
});
