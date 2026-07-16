# Changelog

All notable changes to the Ninja Gaming lobby are documented in this file.

## [1.1.0] - Init Launch

### Added

- Iframe-embeddable lobby designed to run inside a parent casino/settings platform under the `/lobby/` base path.
- `frame-ancestors` CSP and permissive framing headers so the lobby renders inside a cross-origin parent frame.
- Session bootstrapping from the `session_id` URL query parameter, used to fetch the player session from `GET /players/{session_token}`.
- Wallet balance display driven by the live player session (`operator`, `balance`, `currency`, `active_game`).
- Game catalog with `All`, `Slots`, and `Crash` categories, grid/list layouts, and paginated "View More" loading.
- Game launch flow: `POST /launch` returns a URL that is injected into a full-screen game iframe.
- Loading spinner shown while the launch request is in flight and while the game iframe is preparing.
- Minimize / resume / close controls for a running game, including a floating "back to game" card.
- Game → lobby `postMessage` (`NINJA_LOBBY_MINIMIZE`) so an in-game lobby button can return to the catalog; resume/close stay on lobby UI.
- "Preview not available" fallback for broken or missing game thumbnails.
- App version tag exposed via runtime config and shown in the sidebar footer.

[1.1.0]: https://github.com/ninjagaming/fe-lobby/releases/tag/v1.1.0
