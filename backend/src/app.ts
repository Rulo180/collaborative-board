import cors from 'cors';
import express from 'express';
import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from './errors';
import { JsonLogger, MetricsStore, type Logger } from './observability';
import { createNotesRouter } from './routes/notes';
import { NotesService } from './services/notes';

export interface AppDependencies {
  notesService: NotesService;
  logger?: Logger;
  metrics?: MetricsStore;
}

export function createApp({ notesService, logger = new JsonLogger(), metrics = new MetricsStore() }: AppDependencies) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Attach a request ID early so logs, metrics, and error responses can all be correlated.
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = req.header('x-request-id') || randomUUID();
    const startedAt = Date.now();

    res.locals.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    res.on('finish', () => {
      const durationMs = Date.now() - startedAt;

      metrics.recordRequest(req, res.statusCode, durationMs);
      logger.info('request completed', {
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
      });
    });

    next();
  });

  app.use('/api/notes', createNotesRouter(notesService));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/metrics', (req, res) => {
    res.setHeader('content-type', 'text/plain; version=0.0.4; charset=utf-8');
    res.send(metrics.toPrometheusText());
  });

  // Centralized error shaping keeps route handlers simple and response format consistent.
  app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    const requestId = res.locals.requestId as string | undefined;

    if (res.headersSent) {
      next(error);
      return;
    }

    if (error instanceof HttpError) {
      logger.info('handled http error', {
        requestId,
        statusCode: error.statusCode,
        message: error.message,
        details: error.details,
      });

      res.status(error.statusCode).json({
        error: error.message,
        details: error.details,
        requestId,
      });
      return;
    }

    logger.error('unhandled error', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
    });

    res.status(500).json({
      error: 'Internal server error',
      requestId,
    });
  });

  return app;
}
