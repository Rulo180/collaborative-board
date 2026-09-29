import path from 'path';
import fs from 'fs';
import os from 'os';
import { describe, expect, it } from 'vitest';
import { NotesService } from '../src/services/notes';

describe('NotesService', () => {
  const dataPath = path.join(process.cwd(), '../data/notes.json');

  it('returns all notes when no filters are provided', () => {
    const service = new NotesService(dataPath);

    const result = service.filterNotes({});

    expect(result.total).toBe(8);
    expect(result.notes).toHaveLength(8);
  });

  it('filters notes by author', () => {
    const service = new NotesService(dataPath);

    const result = service.filterNotes({ author: 'Martin' });

    expect(result.total).toBe(3);
    expect(result.notes.every((note) => note.author === 'Martin')).toBe(true);
  });

  it('filters notes by color', () => {
    const service = new NotesService(dataPath);

    const result = service.filterNotes({ color: '#FFEDB9' });

    expect(result.total).toBe(2);
    expect(result.notes.every((note) => note.color === '#FFEDB9')).toBe(true);
  });

  it('applies author and color filters together', () => {
    const service = new NotesService(dataPath);

    const result = service.filterNotes({ author: 'Martin', color: '#FFEDB9' });

    expect(result.total).toBe(1);
    expect(result.notes).toHaveLength(1);
    expect(result.notes[0].id).toBe('note_1');
  });

  it('returns empty notes when JSON content is invalid', () => {
    const tempFilePath = path.join(os.tmpdir(), `invalid-json-${Date.now()}.json`);
    fs.writeFileSync(tempFilePath, '{not-valid-json', 'utf-8');

    const service = new NotesService(tempFilePath);

    expect(service.getAllNotes()).toHaveLength(0);

    fs.unlinkSync(tempFilePath);
  });

  it('returns empty notes when notes schema is invalid', () => {
    const tempFilePath = path.join(os.tmpdir(), `invalid-schema-${Date.now()}.json`);
    fs.writeFileSync(
      tempFilePath,
      JSON.stringify([
        {
          id: 'broken-note',
          text: 'missing valid color and numeric coordinates',
          x: '100',
          y: null,
          author: 'tester',
          color: 'yellow',
        },
      ]),
      'utf-8',
    );

    const service = new NotesService(tempFilePath);

    expect(service.getAllNotes()).toHaveLength(0);

    fs.unlinkSync(tempFilePath);
  });
});
