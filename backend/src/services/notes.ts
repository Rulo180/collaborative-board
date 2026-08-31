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
}