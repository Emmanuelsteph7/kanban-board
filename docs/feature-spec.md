# Feature Spec — Collaborative Kanban Board (v1)

## Summary

A Trello-style board where multiple users can create/organize cards across columns, with changes syncing live across everyone viewing the same board.

## User Roles

- **Authenticated user** — has an account, can create boards, is a "board member" on boards they're invited to or create.
- (No admin/guest tiers in v1 — everyone with board membership has equal edit rights.)

## Core Entities

- **User** — account with email + password.
- **Board** — a named workspace containing columns. Has members.
- **Column** — a named lane on a board (e.g. "To Do", "In Progress", "Done"), has an order/position.
- **Card** — belongs to a column, has a title, description, and position within the column.

## In Scope (v1)

- Signup / login (email + password)
- Create / rename / delete a board
- Invite a user to a board by email (adds them as a member)
- Create / rename / reorder / delete columns
- Create / edit / delete cards
- Drag-and-drop cards within a column and across columns
- **Real-time sync**: all board members see changes live, no refresh needed
- **Presence**: see who else is currently viewing the board

## Explicitly Out of Scope (v1)

Documented on purpose — a senior engineer scopes deliberately, not by accident.

| Feature                                       | Why deferred                                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Rich text / comments on cards                 | Adds concurrent free-text editing — see ADR-001 trigger                                                      |
| Full CRDT collaborative text editing          | Only needed once we have concurrent free-text fields                                                         |
| File attachments                              | Needs file storage (S3 etc.) — separate infra concern, not core to the real-time problem we're demonstrating |
| Granular permissions (viewer vs editor roles) | Adds complexity without teaching new real-time concepts                                                      |
| Mobile app                                    | Web-first; responsive web is enough for a portfolio piece                                                    |

## Success Criteria

- Two browser windows (or two people) can edit the same board and see each other's changes within ~1 second, without refreshing.
- If the server restarts or a client's connection drops and reconnects, the client resyncs to correct state automatically.
- A card edit conflict (two people edit the same card near-simultaneously) resolves predictably and the "losing" user sees a clear signal, not silent data loss.
