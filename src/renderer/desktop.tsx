import React, { useEffect, useRef, useState } from 'react';
import { IpcService, useDataState, StateType } from 'astra';
import { DataTable, ThemeToggle, useLanguage, useTheme } from 'prati';
import {
  Alert, AppBar, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Divider, List, ListItemButton, ListItemText, Paper,
  Stack, Tab, Tabs, TextField, Toolbar, Typography, MenuItem
} from '@mui/material';

declare const __APP_VERSION__: string;
interface Envelope<T> { schema_version: string; data: T; meta?: { freshness?: string } }
interface ProjectSummary { project_id: string; display_name: string; state: string; languages: string[] }
interface SearchResult { projects: ProjectSummary[]; page: { next_cursor?: string | null; has_more?: boolean } }
interface ProjectDetail { project_id: string; display_name: string; state: string; checkouts: unknown[]; profile?: unknown; identity?: unknown; review_candidates?: unknown[] }
interface ScanResult { status: string; output: string; warning: string }
interface Workspace { root: string; status: string }
interface Technology { key: string; name: string; category: string; ecosystem: string }
const ipc = new IpcService();

function DataBlock({ title, data }: { title: string; data: unknown }): React.JSX.Element {
  const { literal: t } = useLanguage();
  const renderValue = (value: unknown, depth = 0): React.ReactNode => {
    if (value === null || value === undefined) return <Typography variant="body2" color="text.secondary">{t['common.unknown']}</Typography>;
    if (Array.isArray(value)) {
      if (!value.length) return <Typography variant="body2" color="text.secondary">{t['common.unavailable']}</Typography>;
      return <Stack spacing={1}>{value.map((v, i) => <Box key={i} sx={{ pl: depth ? 1 : 0, borderLeft: depth ? 1 : 0, borderColor: 'divider' }}>{renderValue(v, depth + 1)}</Box>)}</Stack>;
    }
    if (typeof value === 'object') return <Box component="dl" sx={{ m: 0 }}>{Object.entries(value as Record<string, unknown>).map(([key, v]) =>
      <Box key={key} sx={{ py: 0.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'minmax(120px, 180px) minmax(0, 1fr)' }, gap: 1 }}>
        <Typography component="dt" variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{key.replaceAll('_', ' ')}</Typography>
        <Box component="dd" sx={{ m: 0, minWidth: 0, overflowWrap: 'anywhere' }}>{renderValue(v, depth + 1)}</Box>
      </Box>)}</Box>;
    return <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{String(value)}</Typography>;
  };
  return <Box><Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{title}</Typography>{renderValue(data)}</Box>;
}

export function Desktop(): React.JSX.Element {
  const { literal: t } = useLanguage();
  const themeContext = useTheme();
  const [page, setPage] = useState<'workspaces' | 'technologies' | 'settings'>('workspaces');
  const [query, setQuery] = useState('');
  const [technology, setTechnology] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [scanWorkspace, setScanWorkspace] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState(0);
  const [items, setItems] = useState<ProjectSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const searchRequest = useRef(0);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [searchState, executeSearch] = useDataState<Envelope<SearchResult>>();
  const [detailState, executeDetail] = useDataState<Envelope<ProjectDetail>>();
  const [statusState, executeStatus] = useDataState<Envelope<Record<string, unknown>>>();
  const [versionState, executeVersion] = useDataState<Envelope<{ version: string }>>();
  const [scanState, executeScan, setScanState] = useDataState<ScanResult>();
  const [reportState, executeReport] = useDataState<Envelope<Record<string, unknown>>>();
  const [dependencyState, executeDependencies] = useDataState<Envelope<Record<string, unknown>>>();
  const [workspaceState, executeWorkspaces] = useDataState<Envelope<{ workspaces: Workspace[] }>>();
  const [technologyState, executeTechnologies] = useDataState<Envelope<{ registry_version: number; technologies: Technology[] }>>();

  const loadStatus = (): void => {
    void executeStatus(() => ipc.invoke<Envelope<Record<string, unknown>>>('vyasa:status'));
    void executeVersion(() => ipc.invoke<Envelope<{ version: string }>>('vyasa:version'));
    void executeWorkspaces(() => ipc.invoke<Envelope<{ workspaces: Workspace[] }>>('vyasa:workspaces'));
    void executeTechnologies(() => ipc.invoke<Envelope<{ registry_version: number; technologies: Technology[] }>>('vyasa:technologies'));
  };
  const search = (cursor?: string): void => {
    const request = ++searchRequest.current;
    void executeSearch(async () => {
      const result = await ipc.invoke<Envelope<SearchResult>>('vyasa:search', {
        query: query.trim() || undefined, technology: page === 'technologies' ? technology.trim() || undefined : undefined,
        workspace: page === 'workspaces' ? workspace || undefined : undefined, cursor
      });
      if (request === searchRequest.current && result.isSuccess && result.data) {
        const data = result.data.data;
        setItems((old) => {
          const all = [...(cursor ? old : []), ...data.projects];
          return Array.from(new Map(all.map((p) => [p.project_id, p])).values());
        });
        setNextCursor(data.page?.next_cursor || null);
      }
      return result;
    });
  };

  useEffect(() => { loadStatus(); }, []);
  useEffect(() => { setItems([]); setSelected(null); setNextCursor(null); search(); }, [page, workspace, technology]); // Text search is submitted explicitly.
  useEffect(() => {
    if (!selected) return;
    void executeDetail(() => ipc.invoke<Envelope<ProjectDetail>>('vyasa:project', selected));
    void executeReport(() => ipc.invoke<Envelope<Record<string, unknown>>>('vyasa:report', selected));
    void executeDependencies(() => ipc.invoke<Envelope<Record<string, unknown>>>('vyasa:dependencies', selected));
  }, [selected]);
  useEffect(() => {
    if (scanState.isSuccess && scanState.data) { setScanResult(scanState.data); loadStatus(); setItems([]); search(); }
  }, [scanState]);

  const submitSearch = (): void => { setItems([]); setSelected(null); setNextCursor(null); search(); };
  const chooseBackend = async (): Promise<void> => {
    const result = await ipc.invoke<{ canceled: boolean }>('vyasa:select');
    if (result.isSuccess && !result.data?.canceled) { setWorkspace(''); setScanWorkspace(''); setTechnology(''); loadStatus(); setItems([]); if (!workspace && !technology) search(); }
  };
  const detail = detailState.data?.data?.project_id === selected ? detailState.data.data : undefined;
  const version = versionState.data?.data.version;
  const dependencies = dependencyState.data?.data?.dependencies;
  const dependencyRows = Array.isArray(dependencies) ? dependencies.map((row: Record<string, unknown>, index: number) => ({ ...row, rowKey: String(index) })) : [];

  return <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
    <Paper square elevation={0} component="nav" sx={{ width: 220, flexShrink: 0, borderRight: 1, borderColor: 'divider', p: 2 }}>
      <Typography variant="h6" sx={{ px: 1, py: 2, fontWeight: 700 }}>{t['app.title']}</Typography>
      <List>
        {(['workspaces', 'technologies', 'settings'] as const).map((key) =>
          <ListItemButton key={key} selected={page === key} onClick={() => setPage(key)} sx={{ borderRadius: 1 }}>
            <ListItemText primary={t['nav.' + key]} />
          </ListItemButton>)}
      </List>
    </Paper>
    <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar><Typography variant="body2" color="text.secondary">{t['app.tagline']}</Typography>
          <Box sx={{ flex: 1 }} /><Chip size="small" label={statusState.data?.meta?.freshness || t['common.unknown']} /><ThemeToggle themeContext={themeContext} />
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3, maxWidth: 1500, mx: 'auto' }}>
        {page === 'settings' ? <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>{t['settings.title']}</Typography>
          <Typography color="text.secondary">{t['settings.description']}</Typography>
          <Stack direction="row" spacing={2} sx={{ my: 2 }}><Button variant="contained" onClick={chooseBackend}>{t['settings.select']}</Button><Button onClick={loadStatus}>{t['common.retry']}</Button></Stack>
          {versionState.isError && <Alert severity="error">{versionState.statusMessage}</Alert>}
          <Typography>{t['settings.version']}: {version || t['settings.pending']}</Typography>
          <Typography>{t['settings.uiVersion']}: {__APP_VERSION__}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{t['scan.unsupported']}</Typography>
        </Paper> : <>
          <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={2} sx={{ mb: 3 }}>
            <Box><Typography variant="h4" component="h1" gutterBottom>{t['projects.title']}</Typography>
              <Typography color="text.secondary">{t['projects.caption']}</Typography></Box>
            {page === 'workspaces' && <Button variant="contained" onClick={() => setScanOpen(true)}>{t['index.refresh']}</Button>}
          </Stack>
          {statusState.isError && <Alert severity="error" sx={{ mb: 2 }}>{statusState.statusMessage} <Button onClick={() => setPage('settings')}>{t['nav.settings']}</Button></Alert>}
          {scanResult && <Alert severity={scanResult.status === 'partial' ? 'warning' : 'success'} sx={{ mb: 2 }}>{scanResult.status === 'partial' ? t['index.partial'] : t['index.completed']}: {scanResult.output}</Alert>}
          <Alert severity="info" sx={{ mb: 2 }}>{page === 'workspaces' ? t['workspace.help'] : t['technology.help']}</Alert>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(260px, 330px) minmax(0,1fr)' }, gap: 2 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack component="form" spacing={1.5} onSubmit={(e: React.FormEvent) => { e.preventDefault(); submitSearch(); }}>
                {page === 'workspaces' && <TextField select size="small" label={t['workspace.select']} value={workspace} onChange={(e) => setWorkspace(e.target.value)} fullWidth>
                  <MenuItem value="">{t['workspace.all']}</MenuItem>
                  {(workspaceState.data?.data.workspaces || []).map((item) => <MenuItem key={item.root} value={item.root}>{item.root} ({item.status})</MenuItem>)}
                </TextField>}
                <TextField size="small" label={t['projects.search']} value={query} onChange={(e) => setQuery(e.target.value)} fullWidth />
                {page === 'technologies' && <TextField select size="small" label={t['projects.technology']} value={technology} onChange={(e) => setTechnology(e.target.value)} fullWidth disabled={technologyState.isError || technologyState.state === StateType.LOADING}>
                  <MenuItem value="">{t['projects.allTechnologies']}</MenuItem>
                  {(technologyState.data?.data.technologies || []).map((item) => <MenuItem key={item.key} value={item.key}>{item.name} ({item.ecosystem})</MenuItem>)}
                </TextField>}
                <Button type="submit" variant="outlined">{t['projects.apply']}</Button>
              </Stack>
              {page === 'workspaces' && workspaceState.isError && <Alert severity="error" sx={{ mt: 2 }}>{workspaceState.statusMessage}</Alert>}
              {page === 'technologies' && technologyState.isError && <Alert severity="error" sx={{ mt: 2 }}>{technologyState.statusMessage} <Button onClick={loadStatus}>{t['common.retry']}</Button></Alert>}
              {searchState.state === StateType.LOADING && <CircularProgress size={22} sx={{ mt: 2 }} aria-label={t['common.loading']} />}
              {searchState.isError && <Alert severity="error" sx={{ mt: 2 }}>{searchState.statusMessage}</Alert>}
              {!searchState.isError && searchState.isSuccess && !items.length && <Typography sx={{ mt: 2 }} color="text.secondary">{t['projects.empty']}</Typography>}
              <List>{items.map((p) => <ListItemButton key={p.project_id} selected={p.project_id === selected} onClick={() => setSelected(p.project_id)}>
                <ListItemText primary={p.display_name} secondary={[p.state, ...(p.languages || [])].join(' · ')} />
              </ListItemButton>)}</List>
              {nextCursor && <Button onClick={() => search(nextCursor)}>{t['projects.more']}</Button>}
            </Paper>
            <Paper variant="outlined" sx={{ p: 3, minWidth: 0 }}>
              {!selected && <Typography color="text.secondary">{t['project.choose']}</Typography>}
              {selected && detailState.state === StateType.LOADING && <CircularProgress size={24} aria-label={t['common.loading']} />}
              {selected && detailState.isError && <Alert severity="error">{detailState.statusMessage}</Alert>}
              {selected && detail && <Stack spacing={2}>
                <Typography variant="h5">{detail.display_name}</Typography>
                <Stack direction="row" spacing={1}><Chip label={detail.state} size="small" /><Chip label={detailState.data?.meta?.freshness || t['common.unknown']} size="small" /></Stack>
                <Typography variant="body2" color="text.secondary">{t['analysis.external']}</Typography><Divider />
                <Tabs value={detailTab} onChange={(_event, value: number) => setDetailTab(value)} variant="scrollable" allowScrollButtonsMobile aria-label={t['project.evidence']}>
                  <Tab label={t['project.overview']} /><Tab label={t['project.profile']} /><Tab label={t['project.report']} /><Tab label={t['project.dependencies']} />
                </Tabs>
                {detailTab === 0 && <DataBlock title={t['project.observations']} data={detail.checkouts} />}
                {detailTab === 1 && <DataBlock title={t['project.evidence']} data={{ profile: detail.profile, identity: detail.identity, review_candidates: detail.review_candidates }} />}
                {detailTab === 2 && reportState.isSuccess && <DataBlock title={t['project.report']} data={reportState.data?.data} />}
                {detailTab === 2 && reportState.isError && <Alert severity="warning">{reportState.statusMessage}</Alert>}
                {detailTab === 3 && dependencyState.isSuccess && <>
                  <DataBlock title={t['project.coverage']} data={dependencyState.data?.data?.coverage} />
                  <Typography variant="subtitle1" fontWeight={600}>{t['project.dependencies']}</Typography>
                  <DataTable columns={[{ id: 'name', label: t['project.name'] }, { id: 'scope', label: t['project.scope'] }, { id: 'constraint', label: t['project.constraint'] }, { id: 'source', label: t['project.source'] }, { id: 'resolution', label: t['project.resolution'] }]} data={dependencyRows} keyField="rowKey" aria-label={t['project.dependencies']} />
                </>}
                {detailTab === 3 && dependencyState.isError && <Alert severity="warning">{dependencyState.statusMessage}</Alert>}
              </Stack>}
            </Paper>
          </Box>
        </>}
      </Box>
    </Box>
    <Dialog open={scanOpen} onClose={() => setScanOpen(false)}><DialogTitle>{t['index.refresh']}</DialogTitle>
      <DialogContent><DialogContentText>{t['index.confirm']}</DialogContentText><TextField select fullWidth sx={{ mt: 2 }} label={t['workspace.select']} value={scanWorkspace} onChange={(e) => setScanWorkspace(e.target.value)}>
        <MenuItem value="">{t['workspace.all']}</MenuItem>
        {(workspaceState.data?.data.workspaces || []).map((item) => <MenuItem key={item.root} value={item.root}>{item.root} ({item.status})</MenuItem>)}
      </TextField><DialogContentText sx={{ mt: 2 }}>{t['scan.unsupported']}</DialogContentText></DialogContent>
      <DialogActions><Button onClick={() => setScanOpen(false)}>{t['index.cancel']}</Button><Button onClick={() => { setScanOpen(false); setScanResult(null); void executeScan(() => ipc.invoke<ScanResult>('vyasa:scan', scanWorkspace || undefined)); }}>{t['index.scan']}</Button></DialogActions>
    </Dialog>
    {scanState.state === StateType.LOADING && <Dialog open><DialogContent><Stack direction="row" spacing={2} alignItems="center"><CircularProgress size={24} /><Typography>{t['index.running']}</Typography></Stack></DialogContent></Dialog>}
    {scanState.isError && <Dialog open onClose={() => setScanState((s) => ({ ...s, isError: false }))}><DialogTitle>{t['common.error']}</DialogTitle><DialogContent>{scanState.statusMessage}</DialogContent><DialogActions><Button onClick={() => setScanState((s) => ({ ...s, isError: false }))}>{t['common.close']}</Button></DialogActions></Dialog>}
  </Box>;
}
