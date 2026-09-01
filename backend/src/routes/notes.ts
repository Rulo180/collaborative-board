import { Router } from "express";
import { NotesService } from "../services/notes";
import type { Request, Response } from "express";

export function createNotesRouter(notesService: NotesService) {
    const router = Router();

    router.get('/', (req: Request, res: Response) => {
        const { author, color } = req.query;

        const result = notesService.filterNotes({
            author: typeof author === 'string' ? author : undefined,
            color: typeof color === 'string' ? color : undefined,
        });

        res.json({
            notes: result.notes,
            count: result.notes.length,
            total: result.total,
        });
    });

    return router;
}