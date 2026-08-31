import { Router } from "express";
import { NotesService } from "../services/notes";

export function createNotesRouter(notesService: NotesService) {
    const router = Router();

    router.get('/', (req, res) => {
        const notes = notesService.getAllNotes();
        res.json(notes);
    });

    return router;
}