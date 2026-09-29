import type { Request } from 'express';

export interface Logger {
  info(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
}

export class JsonLogger implements Logger {
  // Emit single-line JSON logs so downstream log processors can parse fields reliably.
  info(message: string, metadata: Record<string, unknown> = {}) {
    console.log(JSON.stringify({ level: 'info', message, ...metadata }));
  }

  error(message: string, metadata: Record<string, unknown> = {}) {
    console.error(JSON.stringify({ level: 'error', message, ...metadata }));
  }
}

type RequestMetricBucket = {
  count: number;
  totalDurationMs: number;
};

export class MetricsStore {
  private requestCount = 0;
  private requestBySignature = new Map<string, number>();
  private requestDurationByRoute = new Map<string, RequestMetricBucket>();
  private errorByRoute = new Map<string, number>();

  recordRequest(req: Request, statusCode: number, durationMs: number) {
    this.requestCount += 1;

    const route = this.resolveRoute(req);
    const signature = `${req.method} ${route} ${statusCode}`;
    this.requestBySignature.set(signature, (this.requestBySignature.get(signature) ?? 0) + 1);

    const bucket = this.requestDurationByRoute.get(route) ?? { count: 0, totalDurationMs: 0 };
    bucket.count += 1;
    bucket.totalDurationMs += durationMs;
    this.requestDurationByRoute.set(route, bucket);

    if (statusCode >= 400) {
      this.errorByRoute.set(route, (this.errorByRoute.get(route) ?? 0) + 1);
    }
  }

  // Keep output Prometheus-compatible so it can be scraped without extra adapters.
  toPrometheusText(): string {
    const lines: string[] = [];

    lines.push('# HELP http_requests_total Total number of handled HTTP requests');
    lines.push('# TYPE http_requests_total counter');
    lines.push(`http_requests_total ${this.requestCount}`);

    lines.push('# HELP http_requests_by_signature Requests grouped by method, route and status code');
    lines.push('# TYPE http_requests_by_signature counter');
    for (const [signature, count] of this.requestBySignature) {
      const [method, route, status] = signature.split(' ');
      lines.push(`http_requests_by_signature{method="${method}",route="${route}",status="${status}"} ${count}`);
    }

    lines.push('# HELP http_request_duration_ms_avg Average duration per route in milliseconds');
    lines.push('# TYPE http_request_duration_ms_avg gauge');
    for (const [route, bucket] of this.requestDurationByRoute) {
      const average = bucket.count > 0 ? bucket.totalDurationMs / bucket.count : 0;
      lines.push(`http_request_duration_ms_avg{route="${route}"} ${average.toFixed(2)}`);
    }

    lines.push('# HELP http_errors_total Number of requests with status >= 400 grouped by route');
    lines.push('# TYPE http_errors_total counter');
    for (const [route, count] of this.errorByRoute) {
      lines.push(`http_errors_total{route="${route}"} ${count}`);
    }

    return `${lines.join('\n')}\n`;
  }

  private resolveRoute(req: Request): string {
    if (req.route && typeof req.route.path === 'string') {
      return `${req.baseUrl}${req.route.path}`;
    }

    return req.path || 'unknown';
  }
}
