import * as fs from 'fs';

export interface Note {
    id: string;
    text: string;
    x: number;
    y: number;
    author: string;
    color: string;
}

export interface NotesFilters {
    author?: string;
    color?: string;
}

export interface FilteredNotesResult {
    notes: Note[];
    total: number;
}

function isNote(value: unknown): value is Note {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const candidate = value as Record<string, unknown>;
    const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;

    return (
        typeof candidate.id === 'string' &&
        typeof candidate.text === 'string' &&
        typeof candidate.x === 'number' &&
        Number.isFinite(candidate.x) &&
        typeof candidate.y === 'number' &&
        Number.isFinite(candidate.y) &&
        typeof candidate.author === 'string' &&
        typeof candidate.color === 'string' &&
        hexColorPattern.test(candidate.color)
    );
}

export class NotesService {
    private notes: Note[] = [];

    constructor(dataPath: string) {
        this.loadNotes(dataPath);
    }

    private loadNotes(dataPath: string): void {
        try {
            const data = fs.readFileSync(dataPath, 'utf-8');
            const parsed = JSON.parse(data) as unknown;

            if (!Array.isArray(parsed)) {
                throw new Error('Notes data must be an array');
            }

            const hasInvalidNote = parsed.some((note) => !isNote(note));

            if (hasInvalidNote) {
                throw new Error('Notes data contains invalid note entries');
            }

            this.notes = parsed;
            console.log(`✅ Loaded ${this.notes.length} notes`);
        } catch (error) {
            console.error(`❌ Failed to load notes: ${error}`);
            this.notes = [];
        }
    }

    getAllNotes(): Note[] {
        return this.notes;
    }

    filterNotes(filters: NotesFilters): FilteredNotesResult {
        let filtered = this.notes.filter((note) => {
            // Filter by author
            if (filters.author && note.author !== filters.author) {
                return false;
            }

            // Filter by color
            if (filters.color && note.color !== filters.color) {
                return false;
            }

            return true;
        });

        return {
            notes: filtered,
            total: filtered.length,
        };
    }
}