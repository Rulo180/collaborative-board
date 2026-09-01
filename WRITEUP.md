# Write-up

## 1. Approach and Scope

I followed the 4-hour timebox suggested in the project description. Within that constraint, I prioritized delivering a complete and functional core experience first, choosing features with a high value-to-effort ratio. I started with the interactive spatial board, then added author and color filters because they are related and efficient to implement together. Finally, I added statistics to reuse already-available frontend data.

## 2. Assumptions

The current implementation assumes a valid note shape and valid color values. Data is loaded at startup from a JSON file.
In terms of scale, a fixed dataset is acceptable for this MVP, but the architecture leaves room for pagination, caching, and database adoption.
Note count can grow quickly, so memory handling should be considered. User count can also grow, so collapsible statistics improve usability at moderate scale.

## 3. Architecture and Key Decisions

I used JSON plus in-memory storage to validate core functionality quickly without database setup overhead. Since note creation is out of MVP scope, a database had lower immediate value.

Filtering is handled by the backend using query parameters (`author` and `color`) on `GET /api/notes`. This keeps filtering logic centralized and makes the frontend thinner, because the UI only needs to manage filter state and render server results.

The current API contract returns `notes`, `count`, and `total`, which is enough for the MVP while still providing a clean path to scale. If data volume grows significantly, the same endpoint can be extended with pagination and backed by a persistent database without changing the user-facing filtering flow.

## 4. UX Decisions

I treated spatial layout as a central part of the experience to preserve the collaborative board feel. Spatial proximity helps users reason about related notes, filters enable focused exploration, and collapsible statistics provide a compact summary.

## 5. Trade-offs and Next Steps

1. Add automated tests for core behavior.
This includes backend unit tests for service and route logic, followed by frontend integration tests for filtering and statistics updates.

2. Refactor growing frontend logic.
Move App-level responsibilities into custom hooks/components, starting with data fetching and filter orchestration.

3. Add timestamp-dependent features.
Introduce schema support for timestamps to unlock timeline-related functionality and "recently added" behaviors.

4. Add pagination when dataset size requires it.
The current fixed dataset does not need it yet, but pagination is a natural next scalability step.

## 6. AI Usage

I used AI for ideation, implementation guidance, review, README drafting, and dataset generation.
I manually validated everything by running API checks, filter-combination checks, build checks, and UI behavior checks.