#!/usr/bin/env node
/**
 * Rize.io MCP Server
 *
 * Exposes Rize time tracking API via Model Context Protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { RizeClient, QUERIES, MUTATIONS } from './rize-client.js';

// Get API key from environment
const RIZE_API_KEY = process.env.RIZE_API_KEY;

if (!RIZE_API_KEY) {
  console.error('Error: RIZE_API_KEY environment variable is required');
  process.exit(1);
}

const client = new RizeClient(RIZE_API_KEY);

// Tool definitions
const tools: Tool[] = [
  // User
  {
    name: 'get_current_user',
    description: 'Get the current authenticated user profile',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },

  // Projects
  {
    name: 'get_projects',
    description: 'List all projects with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        statuses: { type: 'array', items: { type: 'string' }, description: 'Filter by status' },
        first: { type: 'number', description: 'Limit results' },
        after: { type: 'string', description: 'Pagination cursor' },
      },
    },
  },
  {
    name: 'get_project',
    description: 'Get a specific project by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Project ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_project',
    description: 'Create a new project',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_project',
    description: 'Update an existing project',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Project ID' },
        name: { type: 'string', description: 'New name' },
        color: { type: 'string', description: 'Color hex code' },
        status: { type: 'string', description: 'Status (active, archived)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_project',
    description: 'Delete a project',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Project ID' },
      },
      required: ['id'],
    },
  },

  // Clients
  {
    name: 'get_clients',
    description: 'List all clients with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        statuses: { type: 'array', items: { type: 'string' }, description: 'Filter by status' },
        first: { type: 'number', description: 'Limit results' },
        after: { type: 'string', description: 'Pagination cursor' },
      },
    },
  },
  {
    name: 'get_client',
    description: 'Get a specific client by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Client ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_client',
    description: 'Create a new client',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Client name' },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_client',
    description: 'Update an existing client',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Client ID' },
        name: { type: 'string', description: 'New name' },
        color: { type: 'string', description: 'Color hex code' },
        status: { type: 'string', description: 'Status (active, archived)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_client',
    description: 'Delete a client',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Client ID' },
      },
      required: ['id'],
    },
  },

  // Tasks
  {
    name: 'get_tasks',
    description: 'List all tasks with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        statuses: { type: 'array', items: { type: 'string' }, description: 'Filter by status' },
        first: { type: 'number', description: 'Limit results' },
        after: { type: 'string', description: 'Pagination cursor' },
      },
    },
  },
  {
    name: 'get_task',
    description: 'Get a specific task by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Task ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_task',
    description: 'Create a new task',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Task name' },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_task',
    description: 'Update an existing task',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Task ID' },
        name: { type: 'string', description: 'New name' },
        color: { type: 'string', description: 'Color hex code' },
        status: { type: 'string', description: 'Status (active, archived)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_task',
    description: 'Delete a task',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Task ID' },
      },
      required: ['id'],
    },
  },

  // Sessions
  {
    name: 'get_current_session',
    description: 'Get the currently active session',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_sessions',
    description: 'Get sessions within a time range',
    inputSchema: {
      type: 'object',
      properties: {
        startTime: { type: 'string', description: 'Start time (ISO8601)' },
        endTime: { type: 'string', description: 'End time (ISO8601)' },
      },
      required: ['startTime', 'endTime'],
    },
  },
  {
    name: 'create_session',
    description: 'Create a new time session',
    inputSchema: {
      type: 'object',
      properties: {
        startTime: { type: 'string', description: 'Start time (ISO8601)' },
        endTime: { type: 'string', description: 'End time (ISO8601)' },
        sessionType: { type: 'string', enum: ['focus', 'break', 'meeting'], description: 'Session type' },
      },
      required: ['startTime', 'endTime', 'sessionType'],
    },
  },
  {
    name: 'start_session_timer',
    description: 'Start a new focus session timer',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'stop_session_timer',
    description: 'Stop the current session timer',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'extend_current_session',
    description: 'Extend the current session by specified minutes',
    inputSchema: {
      type: 'object',
      properties: {
        minutes: { type: 'number', description: 'Minutes to extend' },
      },
      required: ['minutes'],
    },
  },

  // Time Entries
  {
    name: 'get_project_time_entries',
    description: 'Get time entries by project within a time range',
    inputSchema: {
      type: 'object',
      properties: {
        startTime: { type: 'string', description: 'Start time (ISO8601)' },
        endTime: { type: 'string', description: 'End time (ISO8601)' },
      },
      required: ['startTime', 'endTime'],
    },
  },
  {
    name: 'get_client_time_entries',
    description: 'Get time entries by client within a time range',
    inputSchema: {
      type: 'object',
      properties: {
        startTime: { type: 'string', description: 'Start time (ISO8601)' },
        endTime: { type: 'string', description: 'End time (ISO8601)' },
      },
      required: ['startTime', 'endTime'],
    },
  },
  {
    name: 'get_task_time_entries',
    description: 'Get time entries by task within a time range',
    inputSchema: {
      type: 'object',
      properties: {
        startTime: { type: 'string', description: 'Start time (ISO8601)' },
        endTime: { type: 'string', description: 'End time (ISO8601)' },
      },
      required: ['startTime', 'endTime'],
    },
  },

  // Analytics
  {
    name: 'get_categories',
    description: 'Get time spent by category within a time range',
    inputSchema: {
      type: 'object',
      properties: {
        startTime: { type: 'string', description: 'Start time (ISO8601)' },
        endTime: { type: 'string', description: 'End time (ISO8601)' },
      },
      required: ['startTime', 'endTime'],
    },
  },
  {
    name: 'get_apps_and_websites',
    description: 'Get apps and websites usage within a time range',
    inputSchema: {
      type: 'object',
      properties: {
        startTime: { type: 'string', description: 'Start time (ISO8601)' },
        endTime: { type: 'string', description: 'End time (ISO8601)' },
      },
      required: ['startTime', 'endTime'],
    },
  },
  {
    name: 'get_summary',
    description: 'Get productivity summary (total, focus, meeting, break time) within a time range',
    inputSchema: {
      type: 'object',
      properties: {
        startTime: { type: 'string', description: 'Start time (ISO8601)' },
        endTime: { type: 'string', description: 'End time (ISO8601)' },
      },
      required: ['startTime', 'endTime'],
    },
  },
];

// Tool handlers
type ToolArgs = Record<string, unknown>;

async function handleTool(name: string, args: ToolArgs): Promise<unknown> {
  switch (name) {
    // User
    case 'get_current_user':
      return client.query(QUERIES.GET_CURRENT_USER);

    // Projects
    case 'get_projects':
      return client.query(QUERIES.GET_PROJECTS, args);
    case 'get_project':
      return client.query(QUERIES.GET_PROJECT, args);
    case 'create_project':
      return client.query(MUTATIONS.CREATE_PROJECT, args);
    case 'update_project':
      return client.query(MUTATIONS.UPDATE_PROJECT, args);
    case 'delete_project':
      return client.query(MUTATIONS.DELETE_PROJECT, args);

    // Clients
    case 'get_clients':
      return client.query(QUERIES.GET_CLIENTS, args);
    case 'get_client':
      return client.query(QUERIES.GET_CLIENT, args);
    case 'create_client':
      return client.query(MUTATIONS.CREATE_CLIENT, args);
    case 'update_client':
      return client.query(MUTATIONS.UPDATE_CLIENT, args);
    case 'delete_client':
      return client.query(MUTATIONS.DELETE_CLIENT, args);

    // Tasks
    case 'get_tasks':
      return client.query(QUERIES.GET_TASKS, args);
    case 'get_task':
      return client.query(QUERIES.GET_TASK, args);
    case 'create_task':
      return client.query(MUTATIONS.CREATE_TASK, args);
    case 'update_task':
      return client.query(MUTATIONS.UPDATE_TASK, args);
    case 'delete_task':
      return client.query(MUTATIONS.DELETE_TASK, args);

    // Sessions
    case 'get_current_session':
      return client.query(QUERIES.GET_CURRENT_SESSION);
    case 'get_sessions':
      return client.query(QUERIES.GET_SESSIONS, args);
    case 'create_session':
      return client.query(MUTATIONS.CREATE_SESSION, args);
    case 'start_session_timer':
      return client.query(MUTATIONS.START_SESSION_TIMER);
    case 'stop_session_timer':
      return client.query(MUTATIONS.STOP_SESSION_TIMER);
    case 'extend_current_session':
      return client.query(MUTATIONS.EXTEND_CURRENT_SESSION, args);

    // Time Entries
    case 'get_project_time_entries':
      return client.query(QUERIES.GET_PROJECT_TIME_ENTRIES, args);
    case 'get_client_time_entries':
      return client.query(QUERIES.GET_CLIENT_TIME_ENTRIES, args);
    case 'get_task_time_entries':
      return client.query(QUERIES.GET_TASK_TIME_ENTRIES, args);

    // Analytics
    case 'get_categories':
      return client.query(QUERIES.GET_CATEGORIES, args);
    case 'get_apps_and_websites':
      return client.query(QUERIES.GET_APPS_AND_WEBSITES, args);
    case 'get_summary':
      return client.query(QUERIES.GET_SUMMARY, args);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Create and run server
const server = new Server(
  {
    name: 'rize-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleTool(name, (args ?? {}) as ToolArgs);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

// Run server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Rize MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
