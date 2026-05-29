# MCP Setup

This boilerplate expects AI coding tools to have access to the Astro Docs MCP server before making substantial Astro changes.

## Astro Docs

Official remote server:

```text
https://mcp.docs.astro.build/mcp
```

Portable stdio proxy config:

```json
{
  "mcpServers": {
    "Astro docs": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.docs.astro.build/mcp"]
    }
  }
}
```

Repo files:

- `.mcp.json` provides a project-level MCP config for tools that read it.
- `mcp/astro-docs.json` is a copyable snippet for tools that need manual configuration.

Claude Code can also add the remote HTTP server directly:

```bash
claude mcp add --transport http "Astro docs" https://mcp.docs.astro.build/mcp
```

Use the Astro Docs MCP when checking Astro APIs, integrations, image handling, content collections, adapters, configuration, or upgrade behaviour.
