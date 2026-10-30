export interface ProjectScanResult {
  project_id: string;
  run_id: string;
  status: 'completed' | 'partial' | 'failed';
  checkouts: { checkout_id: number; status: 'completed' | 'failed'; reason: string | null }[];
}
export function validProjectId(id: unknown): id is string {
  return typeof id === 'string' && id.length > 0 && Array.from(id).length <= 200 && !id.includes('\0');
}
export function projectQueryArgs(name: 'project' | 'context' | 'report' | 'dependencies', id: string): string[] {
  return ['query', name, '--', id];
}
export function supportsProjectScan(stdout: string): boolean {
  try {
    const value = JSON.parse(stdout);
    return value?.schema_version === '1' && value?.data?.capabilities?.project_scan === 1;
  } catch { return false; }
}
export function parseProjectScan(stdout: string, exitCode: number, projectId: string): ProjectScanResult {
  const invalid = (): never => { throw new Error('The backend returned an invalid project scan response.'); };
  let value: any;
  try { value = JSON.parse(stdout); } catch { return invalid(); }
  const data = value?.data;
  if (value?.schema_version !== '1' || !data || data.project_id !== projectId || typeof data.run_id !== 'string' || !data.run_id || !Array.isArray(data.checkouts)) return invalid();
  let completed = 0; let failed = 0;
  for (const checkout of data.checkouts) {
    if (!Number.isSafeInteger(checkout?.checkout_id) || checkout.checkout_id <= 0) return invalid();
    if (checkout.status === 'completed' && checkout.reason === null) completed++;
    else if (checkout.status === 'failed' && typeof checkout.reason === 'string' && checkout.reason) failed++;
    else return invalid();
  }
  const expected = completed === 0 ? 'failed' : failed ? 'partial' : 'completed';
  if (data.status !== expected || exitCode !== (expected === 'completed' ? 0 : 1)) return invalid();
  return data as ProjectScanResult;
}
