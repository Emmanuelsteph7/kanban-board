# ADR-002: Backend Code Organization — Vertical Slice + Lightweight Service-Repository

**Status:** Accepted
**Date:** 2026-08-31

## Context

The server needs a code organization strategy before auth and feature endpoints are built on top of it. The .NET ecosystem commonly uses Clean Architecture (Domain/Application/Infrastructure/Presentation layers with dependency injection via interfaces). We need an equivalent decision for a TypeScript/Fastify backend of comparable — not larger — scope.

## Options Considered

1. **Full Clean Architecture** — strict layered Domain/Application/Infrastructure/Presentation, dependency inversion enforced via interfaces, typically paired with a DI container.
2. **Layered architecture, organized by technical type** — top-level `routes/`, `services/`, `repositories/` folders, each containing files for every feature.
3. **Vertical Slice Architecture** — organize by feature (`auth/`, `boards/`, `cards/`), with each slice internally following a lightweight Service-Repository pattern (routes → service → repository).

## Decision

**Vertical Slice Architecture**, with each feature slice internally split into `routes` (HTTP concerns), `service` (business logic), and `repository` (Prisma queries). Shared cross-cutting concerns (JWT helpers, password hashing) live in `lib/`. Fastify's own decorator/plugin system is used to share instances like the Prisma client across routes, rather than a separate DI container.

## Reasoning

- **Feature-based folders scale better than type-based folders** as the app grows — everything relevant to "cards" lives in one place instead of being scattered across three top-level folders you have to jump between.
- **Full Clean Architecture's extra rigor (strict dependency inversion via interfaces, a fully isolated Domain layer) is a good investment on large teams or complex domains** — the payoff is easier testing/swapping of implementations. Our domain (boards/columns/cards) is not complex enough to clearly justify that ceremony at this project's scope.
- **Fastify's built-in decorator system already provides the practical benefit of DI** (shared instances passed to handlers rather than constructed inline) without needing a separate container library — TypeScript-safe and idiomatic to the framework we chose.

## Consequences

- Faster to build and easier to navigate at current scope.
- Less enforced separation than Clean Architecture — a service could technically import Prisma directly instead of going through its repository, and nothing stops that except code review discipline (no interface/DI boundary preventing it).
- If the domain grows significantly more complex (e.g. many interdependent business rules, need to swap out Prisma for something else, or a much larger team), this should be revisited toward stricter layering.
