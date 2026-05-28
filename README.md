# Rize MCP Server

[Model Context Protocol](https://modelcontextprotocol.io) server for [Rize](https://rize.io) — automatic time tracking for professionals and teams.

Connect your AI assistant (Claude, ChatGPT, Cursor, etc.) to your Rize account to manage time entries, clients, projects, contracts, profitability, and team members through natural language.

## Tools (42)

| Category | Tools | Description |
|---|---|---|
| **User** | `get_current_user` `get_help` | Authenticated user profile, org info, and tool documentation |
| **Time Entries** | `list_my_time_entries` `list_team_time_entries` `get_time_entry` `create_time_entry` `update_time_entry` `delete_time_entry` | Full CRUD for time entries with date range, client, project, task, and label filters |
| **AI Suggestions** | `generate_time_entries` `regenerate_time_entry` `approve_time_entries` `reject_time_entries` `approve_tag_suggestion` | Generate, review, and approve AI-powered time entry suggestions |
| **Time Analysis** | `get_my_time_allocation` `get_team_time_allocation` `list_my_apps_used` `list_my_events` | Hours breakdown by client/project/task/label, app usage, and tracking events |
| **Clients** | `list_clients` `create_client` `update_client` | Manage client records in your workspace |
| **Projects** | `list_projects` `create_project` `update_project` | Manage projects under clients |
| **Tasks** | `list_tasks` `create_task` `update_task` | Manage tasks under projects |
| **Labels** | `list_labels` | View workspace labels for categorization |
| **Team** | `list_team_members` `update_team_member` `invite_team_member` | Team roster, roles, rates, and invitations |
| **Contracts** | `list_contracts` `get_contract` `create_contract` `update_contract` | Billing contracts with clients (hourly, retainer, fixed fee, hybrid) |
| **Profitability** | `get_org_profitability` `get_contract_profitability` `get_profitability_trend` | Revenue, costs, margins, budget burn, and monthly trends |
| **Billing** | `create_expense` `create_revenue_entry` | Log expenses and recognized revenue against contract periods |
| **Notes** | `add_note` `dictate` | Add notes to time entries or dictate time in natural language |

## Setup

### Option 1: Remote server (Claude.ai — OAuth)

Connect directly in Claude's MCP integration settings using the server URL:

```
https://mcp.rize.io/mcp
```

Claude will handle OAuth authentication automatically — no API key needed.

### Option 2: Local server (Claude Desktop / Cursor / Claude Code — stdio)

#### 1. Get your API key

Sign up at [rize.io](https://rize.io) and generate an API key from **Settings > API**.

#### 2. Install

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

#### 3. Configure your AI client

**Claude Desktop** — add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

**Claude Code** — add to your project's `.mcp.json` or `~/.claude/mcp.json`:

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

**Cursor** — add to Cursor settings under MCP Servers:

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

## Skills

Pre-built workflows that combine multiple tools for common tasks. Use these as prompts with your connected Rize MCP server.

| Skill | Description |
|-------|-------------|
| [Weekly Time Report](skills/weekly-time-report.md) | Summarize hours by client and project for the week with daily breakdown and gap detection |
| [Profitability Check](skills/profitability-check.md) | Analyze org-wide and per-contract profitability, flag at-risk contracts and margin trends |
| [Team Utilization Review](skills/team-utilization-review.md) | Compare team members' hours against capacity, surface utilization and burnout risk |
| [Invoice Prep](skills/invoice-prep.md) | Gather billable time entries and expenses for a client and period, formatted for invoicing |
| [Productivity Insights](skills/productivity-insights.md) | Analyze app usage and focus patterns to find productivity improvements |
| [Review Time Entries](skills/review-time-entries.md) | Walk through AI-generated time entry suggestions — approve, reject, edit, or regenerate |

## Example prompts

- "What did I work on today?"
- "How much time did I spend on Project X this week?"
- "Generate time entries for yesterday"
- "Show me my team's utilization this week"
- "What's the profitability on the Acme contract?"
- "Create a new project called Q3 Marketing under client Acme"
- "Show me my app usage for the last 7 days"
- "Review my pending time entry suggestions"

## API

The server connects to the [Rize GraphQL API](https://rize.io) using Bearer token authentication. All time parameters use ISO 8601 format and respect the user's configured timezone.

## Requirements

- Node.js 20+ (for local stdio mode)
- Rize account ([rize.io](https://rize.io))

## License

MIT
