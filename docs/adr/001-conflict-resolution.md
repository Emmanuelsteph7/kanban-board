# ADR-001: Conflict Resolution Strategy for Board State

**Status:** Accepted
**Date:** 2026-08-31

## Context

Multiple users can simultaneously edit the same card (title, description, column, position). We need a strategy for resolving concurrent writes to the same data.

## Options Considered

1. **Last-Write-Wins (LWW)** — simplest; most recent write overwrites prior state.
2. **Operational Transform (OT)** — transforms concurrent edits so they compose correctly; powers apps like Google Docs; complex to implement correctly from scratch.
3. **CRDTs** — data structures that merge concurrent edits deterministically without central coordination; popular in modern collaborative tools (Figma, Linear); shines on free-flowing text.

## Decision

**Per-field Last-Write-Wins, with version/timestamp metadata so clients can detect a lost race and surface it in the UI** (e.g. "updated by someone else" indicator), rather than silently overwriting with no feedback.

## Reasoning

Our data model is **structured, not free-text**: a card is a title (string), description (string), column ID, and position (number). Conflicts on structured fields are simple to resolve — one final value wins — because there's no character-level concurrent editing that requires deep merge semantics. CRDTs and OT solve a harder problem than the one we actually have; reaching for them here would be complexity without corresponding benefit.

## Consequences

- Simple to implement and reason about; ships faster.
- Small risk: a user's edit can be silently discarded if another edit arrives first — mitigated by the "updated by someone else" UI signal, not eliminated.
- Not suitable if we later add concurrent free-text editing (e.g. multiple people typing in the same description field simultaneously).

## Revisit Trigger (v2 candidate)

If we add **rich-text, multi-cursor editing** on card descriptions, this decision should be revisited — a library like **Yjs** (CRDT-based) would be the appropriate tool at that point, since character-level concurrent text editing is exactly where CRDTs earn their complexity.
