import * as fs from 'fs';
import * as path from 'path';

export interface Note {
    id: string;
    text: string;
    x: number;
    y: number;
    author: string;
    color: string;
}

export class NotesService {
    private notes: Note[] = [];

    constructor(dataPath: string) {
        this.loadNotes(dataPath);
    }

    private loadNotes(dataPath: string): void {
        try {
            const data = fs.readFileSync(dataPath, 'utf-8');
            this.notes = JSON.parse(data);
            console.log(`✅ Loaded ${this.notes.length} notes`);
        } catch (error) {
            console.error(`❌ Failed to load notes: ${error}`);
            this.notes = [];
        }
    }

    getAllNotes(): Note[] {
        return this.notes;
    }

    filterNotes(filters: {
        author?: string;
        color?: string;
    }): Note[] {
        return this.notes.filter((note) => {
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
    }
}