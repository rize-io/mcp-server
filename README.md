# Rize MCP Server

[Model Context Protocol](https://modelcontextprotocol.io) server for [Rize](https://rize.io) -- automatic time tracking for professionals and teams.

Connect your AI assistant (Claude, ChatGPT, Cursor, etc.) to your Rize account to manage projects, track time, and analyze productivity through natural language.

## Tools (27)

| Category | Tools | Description |
|---|---|---|
| **User** | `get_current_user` | Authenticated user profile |
| **Projects** | `get_projects` `get_project` `create_project` `update_project` `delete_project` | Full CRUD for projects with filtering and pagination |
| **Clients** | `get_clients` `get_client` `create_client` `update_client` `delete_client` | Full CRUD for clients with filtering and pagination |
| **Tasks** | `get_tasks` `get_task` `create_task` `update_task` `delete_task` | Full CRUD for tasks with filtering and pagination |
| **Sessions** | `get_current_session` `get_sessions` `create_session` `start_session_timer` `stop_session_timer` `extend_current_session` | Timer control and session history |
| **Time Entries** | `get_project_time_entries` `get_client_time_entries` `get_task_time_entries` | Time entries grouped by project, client, or task |
| **Analytics** | `get_categories` `get_apps_and_websites` `get_summary` | Productivity breakdown by category, app usage, and summary stats |

## Setup

### 1. Get your API key

Sign up at [rize.io](https://rize.io) and generate an API key from **Settings > API**.

### 2. Install

```bash
npm install -g rize-mcp-server
```

Or clone and build from source:

```bash
git clone https://github.com/rize-io/mcp-server.git
cd mcp-server
npm install
npm run build
```

### 3. Configure your AI client

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "rize": {
      "command": "npx",
      "args": ["-y", "rize-mcp-server"],
      "env": {
        "RIZE_API_KEY": "your-api-key"
      }
    }
  }
}
```

#### Claude Code

Add to your project's `.mcp.json` or `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "rize": {
      "command": "npx",
      "args": ["-y", "rize-mcp-server"],
      "env": {
        "RIZE_API_KEY": "your-api-key"
      }
    }
  }
}
```

#### Cursor

Add to Cursor settings under MCP Servers:

```json
{
  "rize": {
    "command": "npx",
    "args": ["-y", "rize-mcp-server"],
    "env": {
      "RIZE_API_KEY": "your-api-key"
    }
  }
}
```

### 4. Environment variable

Set `RIZE_API_KEY` in your environment or pass it via the MCP server config as shown above.

## Example prompts

- "What did I work on today?"
- "Start a focus session"
- "How much time did I spend on Project X this week?"
- "Create a new project called Q3 Marketing"
- "Show me my app usage for the last 7 days"
- "What's my focus vs meeting time ratio?"

## API

The server connects to the [Rize GraphQL API](https://rize.io) (`api.rize.io/api/v1/graphql`) using Bearer token authentication. All time parameters use ISO 8601 format.

## Requirements

- Node.js 20+
- Rize account with API key

## License

MIT
