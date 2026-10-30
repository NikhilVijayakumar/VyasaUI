const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, filename);
const { supportsProjectScan, parseProjectScan, validProjectId, projectQueryArgs } = require('../src/main/project-scan.ts');
for (const id of ['-opaque', 'プロジェクト', 'x'.repeat(200), '😀'.repeat(200)]) { assert.equal(validProjectId(id), true); assert.deepEqual(projectQueryArgs('project', id), ['query', 'project', '--', id]); }
for (const id of ['', 'x'.repeat(201), 'bad\0id', null]) assert.equal(validProjectId(id), false);
assert.equal(supportsProjectScan('{"schema_version":"1","data":{"capabilities":{"project_scan":1}}}'), true);
for (const value of ['{}', '{', '{"schema_version":"2","data":{"capabilities":{"project_scan":1}}}', '{"schema_version":"1","data":{"capabilities":{"project_scan":"1"}}}']) assert.equal(supportsProjectScan(value), false);
const result = (status, checkouts) => JSON.stringify({ schema_version: '1', data: { project_id: 'project', run_id: 'run', status, checkouts } });
const ok = { checkout_id: 1, status: 'completed', reason: null };
const bad = { checkout_id: 2, status: 'failed', reason: 'MISSING' };
assert.equal(parseProjectScan(result('partial', [ok, bad]), 1, 'project').status, 'partial');
assert.equal(parseProjectScan(result('failed', []), 1, 'project').status, 'failed');
assert.equal(parseProjectScan(result('completed', [ok]), 0, 'project').status, 'completed');
for (const [out, code, id] of [[result('completed', [ok]), 1, 'project'], [result('partial', [ok]), 1, 'project'], [result('failed', [bad]), 1, 'other'], ['{}', 0, 'project']]) assert.throws(() => parseProjectScan(out, code, id));
console.log('project scan contract fixtures passed');
