import { Router } from "express";
import { NotesService } from "../services/notes";
import type { Request, Response } from "express";

type NotesQuery = {
    author?: string;
    color?: string;
};

function validateNotesQuery(query: Request['query']): { filters?: NotesQuery; errors: string[] } {
    const errors: string[] = [];
    const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;

    const parseTextFilter = (value: unknown, key: 'author' | 'color') => {
        if (value === undefined) {
            return undefined;
        }

        if (typeof value !== 'string') {
            errors.push(`${key} must be a string`);
            return undefined;
        }

        const trimmed = value.trim();
        if (!trimmed) {
            errors.push(`${key} cannot be empty`);
            return undefined;
        }

        if (key === 'color' && !hexColorPattern.test(trimmed)) {
            errors.push('color must be a valid hex value like #FFEDB9');
            return undefined;
        }

        return trimmed;
    };

    const author = parseTextFilter(query.author, 'author');
    const color = parseTextFilter(query.color, 'color');

    if (errors.length > 0) {
        return { errors };
    }

    return {
        errors,
        filters: {
            author,
            color,
        },
    };
}

export function createNotesRouter(notesService: NotesService) {
    const router = Router();

    router.get('/', (req: Request, res: Response) => {
        const validation = validateNotesQuery(req.query);

        if (validation.errors.length > 0 || !validation.filters) {
            return res.status(400).json({
                error: 'Invalid query parameters',
                details: validation.errors,
            });
        }

        const result = notesService.filterNotes(validation.filters);

        res.json({
            notes: result.notes,
            count: result.notes.length,
            total: result.total,
        });
    });

    return router;
}