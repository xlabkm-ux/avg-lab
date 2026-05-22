# API Principles

## API Style

- REST for product operations.
- WebSocket/WebRTC for realtime sessions.
- Typed tool interfaces for AI calls.
- OpenAPI for public API contracts.

## Error Model

All errors should include:

```json
{
  "code": "string",
  "message": "string",
  "request_id": "string",
  "details": {}
}
```

## API Rule

Never expose provider-specific raw errors to the user. Normalize them and log provider details privately.
