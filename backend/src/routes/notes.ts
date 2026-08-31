import { Router } from "express";
import { NotesService } from "../services/notes";
import type { Request, Response } from "express";

export function createNotesRouter(notesService: NotesService) {
    const router = Router();

    router.get('/', (req: Request, res: Response) => {
        const notes = notesService.getAllNotes();
        res.json(notes);
    });

    router.get('/filter', (req: Request, res: Response) => {
        const { author, color, search } = req.query;

        const filters = {
            author: author as string | undefined,
            color: color as string | undefined,
            search: search as string | undefined,
        }

        const filteredNotes = notesService.filterNotes(filters);
        res.json(filteredNotes);
    });

    return router;
}