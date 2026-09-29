import { Router } from "express";
import { NotesService } from "../services/notes";
import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors";

type NotesQuery = {
    author?: string;
    color?: string;
};

function validateNotesQuery(query: Request['query']): { filters?: NotesQuery; errors: string[] } {
    const errors: string[] = [];
    const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;

    // Reuse the same parser for both filters to keep validation behavior consistent.
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

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
        const validation = validateNotesQuery(req.query);

        if (validation.errors.length > 0 || !validation.filters) {
            next(new BadRequestError('Invalid query parameters', validation.errors));
            return;
        }

        const result = notesService.filterNotes(validation.filters);

        // Keep legacy fields for compatibility while exposing clearer counter names.
        res.json({
            notes: result.notes,
            count: result.notes.length,
            total: result.total,
            filteredCount: result.notes.length,
            totalCount: notesService.getAllNotes().length,
        });
    });

    return router;
}