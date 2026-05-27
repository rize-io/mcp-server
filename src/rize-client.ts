/**
 * Rize.io GraphQL API Client
 */

const RIZE_API_URL = 'https://api.rize.io/api/v1/graphql';

export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{ message: string; locations?: unknown[]; path?: unknown[] }>;
}

export class RizeClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(RIZE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Rize API error: ${response.status} ${response.statusText}`);
    }

    const result = (await response.json()) as GraphQLResponse<T>;

    if (result.errors?.length) {
      throw new Error(`GraphQL error: ${result.errors.map(e => e.message).join(', ')}`);
    }

    return result.data as T;
  }
}

// GraphQL Queries
export const QUERIES = {
  GET_CURRENT_USER: `
    query GetCurrentUser {
      currentUser {
        email
        name
        createdAt
        updatedAt
      }
    }
  `,

  GET_PROJECTS: `
    query GetProjects($query: String, $statuses: [String!], $first: Int, $after: String) {
      projects(query: $query, statuses: $statuses, first: $first, after: $after) {
        edges {
          node {
            id
            name
            color
            emoji
            status
            hourlyRate
            timeBudget
            timeBudgetInterval
            totalTimeSpent
            lastUsedAt
            createdAt
            updatedAt
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `,

  GET_PROJECT: `
    query GetProject($id: ID!) {
      project(id: $id) {
        id
        name
        color
        emoji
        status
        hourlyRate
        timeBudget
        timeBudgetInterval
        totalTimeSpent
        lastUsedAt
        createdAt
        updatedAt
      }
    }
  `,

  GET_CLIENTS: `
    query GetClients($query: String, $statuses: [String!], $first: Int, $after: String) {
      clients(query: $query, statuses: $statuses, first: $first, after: $after) {
        edges {
          node {
            id
            name
            color
            emoji
            status
            hourlyRate
            timeBudget
            timeBudgetInterval
            totalTimeSpent
            lastUsedAt
            createdAt
            updatedAt
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `,

  GET_CLIENT: `
    query GetClient($id: ID!) {
      client(id: $id) {
        id
        name
        color
        emoji
        status
        hourlyRate
        timeBudget
        timeBudgetInterval
        totalTimeSpent
        lastUsedAt
        createdAt
        updatedAt
      }
    }
  `,

  GET_TASKS: `
    query GetTasks($query: String, $statuses: [String!], $first: Int, $after: String) {
      tasks(query: $query, statuses: $statuses, first: $first, after: $after) {
        edges {
          node {
            id
            name
            color
            emoji
            status
            totalTimeSpent
            lastUsedAt
            createdAt
            updatedAt
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `,

  GET_TASK: `
    query GetTask($id: ID!) {
      task(id: $id) {
        id
        name
        color
        emoji
        status
        totalTimeSpent
        lastUsedAt
        createdAt
        updatedAt
      }
    }
  `,

  GET_CURRENT_SESSION: `
    query GetCurrentSession {
      currentSession {
        id
        startTime
        endTime
        sessionType
        createdAt
        updatedAt
      }
    }
  `,

  GET_SESSIONS: `
    query GetSessions($startTime: ISO8601DateTime!, $endTime: ISO8601DateTime!) {
      sessions(startTime: $startTime, endTime: $endTime) {
        id
        startTime
        endTime
        sessionType
        createdAt
        updatedAt
      }
    }
  `,

  GET_PROJECT_TIME_ENTRIES: `
    query GetProjectTimeEntries($startTime: ISO8601DateTime!, $endTime: ISO8601DateTime!) {
      projectTimeEntries(startTime: $startTime, endTime: $endTime) {
        id
        startTime
        endTime
        description
        status
        createdAt
        updatedAt
      }
    }
  `,

  GET_CLIENT_TIME_ENTRIES: `
    query GetClientTimeEntries($startTime: ISO8601DateTime!, $endTime: ISO8601DateTime!) {
      clientTimeEntries(startTime: $startTime, endTime: $endTime) {
        id
        startTime
        endTime
        description
        status
        createdAt
        updatedAt
      }
    }
  `,

  GET_TASK_TIME_ENTRIES: `
    query GetTaskTimeEntries($startTime: ISO8601DateTime!, $endTime: ISO8601DateTime!) {
      taskTimeEntries(startTime: $startTime, endTime: $endTime) {
        id
        startTime
        endTime
        description
        status
        createdAt
        updatedAt
      }
    }
  `,

  GET_CATEGORIES: `
    query GetCategories($startTime: ISO8601DateTime!, $endTime: ISO8601DateTime!) {
      categories(startTime: $startTime, endTime: $endTime) {
        category {
          key
          name
          focus
          work
          idle
        }
        timeSpent
      }
    }
  `,

  GET_APPS_AND_WEBSITES: `
    query GetAppsAndWebsites($startTime: ISO8601DateTime!, $endTime: ISO8601DateTime!) {
      appsAndWebsites(startTime: $startTime, endTime: $endTime) {
        id
        appName
        title
        url
        urlHost
        source
        type
        timeSpent
        timeCategory {
          key
          name
        }
      }
    }
  `,

  GET_SUMMARY: `
    query GetSummary($startTime: ISO8601DateTime!, $endTime: ISO8601DateTime!) {
      summary(startTime: $startTime, endTime: $endTime) {
        totalTime
        focusTime
        meetingTime
        breakTime
      }
    }
  `,
};

// GraphQL Mutations
export const MUTATIONS = {
  CREATE_PROJECT: `
    mutation CreateProject($name: String!) {
      createProject(input: { args: { name: $name } }) {
        project {
          id
          name
          createdAt
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  UPDATE_PROJECT: `
    mutation UpdateProject($id: ID!, $name: String, $color: String, $status: String) {
      updateProject(input: { id: $id, args: { name: $name, color: $color, status: $status } }) {
        project {
          id
          name
          color
          status
          updatedAt
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  DELETE_PROJECT: `
    mutation DeleteProject($id: ID!) {
      deleteProject(input: { id: $id }) {
        project {
          id
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  CREATE_CLIENT: `
    mutation CreateClient($name: String!) {
      createClient(input: { args: { name: $name } }) {
        client {
          id
          name
          createdAt
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  UPDATE_CLIENT: `
    mutation UpdateClient($id: ID!, $name: String, $color: String, $status: String) {
      updateClient(input: { id: $id, args: { name: $name, color: $color, status: $status } }) {
        client {
          id
          name
          color
          status
          updatedAt
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  DELETE_CLIENT: `
    mutation DeleteClient($id: ID!) {
      deleteClient(input: { id: $id }) {
        client {
          id
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  CREATE_TASK: `
    mutation CreateTask($name: String!) {
      createTask(input: { args: { name: $name } }) {
        task {
          id
          name
          createdAt
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  UPDATE_TASK: `
    mutation UpdateTask($id: ID!, $name: String, $color: String, $status: String) {
      updateTask(input: { id: $id, args: { name: $name, color: $color, status: $status } }) {
        task {
          id
          name
          color
          status
          updatedAt
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  DELETE_TASK: `
    mutation DeleteTask($id: ID!) {
      deleteTask(input: { id: $id }) {
        task {
          id
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  CREATE_SESSION: `
    mutation CreateSession($startTime: ISO8601DateTime!, $endTime: ISO8601DateTime!, $sessionType: SessionTypeEnum!) {
      createSession(input: { args: { startTime: $startTime, endTime: $endTime, sessionType: $sessionType } }) {
        session {
          id
          startTime
          endTime
          sessionType
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  START_SESSION_TIMER: `
    mutation StartSessionTimer {
      startSessionTimer(input: {}) {
        session {
          id
          startTime
          sessionType
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  STOP_SESSION_TIMER: `
    mutation StopSessionTimer {
      stopSessionTimer(input: {}) {
        session {
          id
          startTime
          endTime
          sessionType
        }
        errors {
          attribute
          message
        }
      }
    }
  `,

  EXTEND_CURRENT_SESSION: `
    mutation ExtendCurrentSession($minutes: Int!) {
      extendCurrentSession(input: { args: { minutes: $minutes } }) {
        session {
          id
          endTime
        }
        errors {
          attribute
          message
        }
      }
    }
  `,
};
