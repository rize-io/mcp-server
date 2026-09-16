import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverEntry = path.join(root, 'dist', 'index.js');
const mockApi = path.join(root, 'test', 'helpers', 'mock-rize-api.mjs');

function serverTransport(env) {
  return new StdioClientTransport({
    command: process.execPath,
    args: ['--import', mockApi, serverEntry],
    env: { ...process.env, ...env },
    stderr: 'pipe',
  });
}

test('server exits with an error when RIZE_API_KEY is missing', async () => {
  const env = { ...process.env };
  delete env.RIZE_API_KEY;
  const child = spawn(process.execPath, [serverEntry], { env, stdio: ['ignore', 'ignore', 'pipe'] });

  let stderr = '';
  child.stderr.on('data', (chunk) => (stderr += chunk));
  const code = await new Promise((resolve) => child.on('exit', resolve));

  assert.equal(code, 1);
  assert.match(stderr, /RIZE_API_KEY environment variable is required/);
});

test('MCP stdio round trip against a mocked Rize API', async (t) => {
  const client = new Client({ name: 'test-client', version: '0.0.0' });
  const transport = serverTransport({ RIZE_API_KEY: 'test-api-key' });

  await client.connect(transport);
  t.after(async () => {
    await client.close();
  });

  await t.test('lists the expected tool surface', async () => {
    const { tools } = await client.listTools();
    const names = tools.map((tool) => tool.name);

    assert.equal(names.length, 28);
    assert.equal(new Set(names).size, names.length, 'tool names must be unique');
    for (const tool of tools) {
      assert.equal(tool.inputSchema.type, 'object', `${tool.name} inputSchema must be an object`);
      assert.ok(tool.description, `${tool.name} must have a description`);
    }
    for (const required of ['get_current_user', 'get_projects', 'create_session', 'get_summary']) {
      assert.ok(names.includes(required), `missing tool ${required}`);
    }
  });

  await t.test('forwards a tool call to the GraphQL API and returns its data', async () => {
    const result = await client.callTool({
      name: 'get_projects',
      arguments: { first: 3 },
    });

    assert.notEqual(result.isError, true);
    const payload = JSON.parse(result.content[0].text);
    assert.equal(payload.mock, true);
    assert.equal(payload.operation, 'query GetProjects($query:');
    assert.deepEqual(payload.variables, { first: 3 });
  });

  await t.test('returns isError with the GraphQL message when the API reports errors', async () => {
    const result = await client.callTool({ name: 'get_project', arguments: { id: 'missing' } });

    assert.equal(result.isError, true);
    assert.equal(result.content[0].text, 'Error: GraphQL error: Record not found');
  });

  await t.test('returns isError for unknown tool names', async () => {
    const result = await client.callTool({ name: 'not_a_tool', arguments: {} });

    assert.equal(result.isError, true);
    assert.equal(result.content[0].text, 'Error: Unknown tool: not_a_tool');
  });
});
