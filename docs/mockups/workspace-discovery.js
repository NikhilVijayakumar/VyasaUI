/* Workspace, technology and external-analysis prototype; session-only sample state. */
const workspaceNames=['Product projects','Shared libraries'];
const projectWorkspaces={vyasa:0,astra:1,prati:1,archive:0};
const projectTech={vyasa:['Python','SQLite'],astra:['TypeScript','React'],prati:['TypeScript','React'],archive:[]};
const queued=new Set();
let workspaceFilter='all',technologyFilter='all',technologySearch='';
const listHeader=document.querySelector('.list-header');
const filters=document.createElement('div');
filters.className='discovery-filters';
filters.innerHTML='<label>Workspace<select id="workspace-filter" aria-label="Filter by workspace"></select></label><label>Technology<select id="technology-filter" aria-label="Filter by technology"><option value="all">All technologies</option><option>Python</option><option>SQLite</option><option>TypeScript</option><option>React</option></select></label>';
listHeader.append(filters);
function updateWorkspaceOptions(){const select=document.getElementById('workspace-filter');select.innerHTML='<option value="all">All workspaces</option>'+workspaceNames.map((name,i)=>'<option value="'+i+'">'+escapeText(name)+'</option>').join('');select.value=workspaceFilter}
updateWorkspaceOptions();
document.getElementById('workspace-filter').addEventListener('change',e=>{workspaceFilter=e.target.value;renderList()});
document.getElementById('technology-filter').addEventListener('change',e=>{technologyFilter=e.target.value;renderList()});
renderList=function(){
 const q=$('search').value.trim().toLowerCase();
 const rows=['empty','unconfigured','unavailable'].includes(mode)?[]:samples.filter(p=>(p.name+' '+p.description+' '+(projectTech[p.id]||[]).join(' ')).toLowerCase().includes(q)&&(workspaceFilter==='all'||String(projectWorkspaces[p.id])===workspaceFilter)&&(technologyFilter==='all'||(projectTech[p.id]||[]).includes(technologyFilter)));
 $('total').textContent=['empty','unconfigured','unavailable'].includes(mode)?'—':samples.length+' indexed';
 $('results').textContent=rows.length+' matching '+(rows.length===1?'project':'projects');
 $('projects').innerHTML=rows.length?rows.map(p=>'<button class="project '+(selected===p.id?'selected':'')+'" data-id="'+p.id+'" aria-pressed="'+(selected===p.id)+'"><div class="project-name"><span>'+escapeText(p.name)+'</span>'+(queued.has(p.id)?'<span class="queue-marker">Marked</span>':'')+'</div><div class="project-desc">'+escapeText(p.description)+'</div><div class="project-meta">'+escapeText(workspaceNames[projectWorkspaces[p.id]]||'Workspace unknown')+' · '+escapeText((projectTech[p.id]||[]).join(', ')||'Technology unknown')+'</div></button>').join(''):'<div class="empty">'+(q||workspaceFilter!=='all'||technologyFilter!=='all'?'No sample projects match these filters.':'No projects to display in this preview state.')+'</div>';
 document.querySelectorAll('.project').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.id;tab='overview';render()}));
};
const originalRenderDetail=renderDetail;
renderDetail=function(){originalRenderDetail();const header=document.querySelector('.detail-top');if(!header)return;const view=document.createElement('button');view.className='button';view.textContent='Full project details';view.addEventListener('click',()=>navigate('project-detail'));header.append(view)};
const basePageRenderer=renderPage;
renderPage=function(){
 basePageRenderer();
 if(activePage==='roots'){
  mockPage.innerHTML=pageHead('Workspaces','Browse all projects or choose a named workspace.','<button class="button primary" data-custom="add-workspace">Add workspace</button>')+'<div class="mock-callout"><strong>Sample workspace configuration</strong><p>Names and locations below are illustrative and only persist for this page session.</p></div><div class="mock-card"><h2>All workspaces</h2><p class="hint">See every indexed sample project together, or choose a workspace below.</p><button class="button" data-all-workspaces>View all projects</button></div><div class="mock-card detail-section"><h2>Configured workspaces</h2><p class="hint">Select a workspace to see its projects or edit its name.</p>'+workspaceNames.map((name,i)=>'<div class="mock-row"><div><strong>'+escapeText(name)+'</strong><small>'+escapeText(roots[i]||'No root specified')+' · '+samples.filter(p=>projectWorkspaces[p.id]===i).length+' sample projects</small></div><div class="mock-actions"><button class="mock-link" data-workspace-projects="'+i+'">View projects</button><button class="mock-link" data-rename-workspace="'+i+'">Rename</button></div></div>').join('')+'</div>';
 }
 if(activePage==='technology'){
  const keys=['Python','SQLite','TypeScript','React'].filter(t=>t.toLowerCase().includes(technologySearch.toLowerCase()));
  mockPage.innerHTML=pageHead('Technologies','Find projects by observed or declared technology.')+'<div class="mock-card"><label class="mock-label" for="tech-search">Search technologies</label><input class="mock-input" id="tech-search" type="search" placeholder="Search technologies" value="'+escapeText(technologySearch)+'"><div class="hint" style="margin-top:12px">Counts and observations are sample data.</div>'+ (keys.length?keys.map(t=>{const n=samples.filter(p=>(projectTech[p.id]||[]).includes(t)).length;return '<div class="mock-row"><div><strong>'+escapeText(t)+'</strong><small>'+n+' sample '+(n===1?'project':'projects')+'</small></div><button class="mock-link" data-technology="'+escapeText(t)+'">View projects</button></div>'}).join(''):'<div class="empty">No technologies match this search.</div>')+'</div>';
  const field=document.getElementById('tech-search');field.addEventListener('input',e=>{technologySearch=e.target.value;renderPage();const next=document.getElementById('tech-search');next.focus();next.setSelectionRange(technologySearch.length,technologySearch.length)});
 }
 if(activePage==='queue'){
  const list=samples.filter(p=>queued.has(p.id));
  mockPage.innerHTML=pageHead('Analysis queue','Projects marked for deeper work with an external coding agent.')+'<div class="mock-callout"><strong>Work happens outside Vyasa UI</strong><p>Open the project with your coding agent, use the available Vyasa MCP context there, then return and run a scan. This prototype does not launch an agent or connect MCP.</p></div><div class="mock-card"><h2>Marked projects</h2><p class="hint">Marks are sample-only and are lost when the page is reloaded.</p>'+(list.length?list.map(p=>'<div class="mock-row"><div><strong>'+escapeText(p.name)+'</strong><small>'+escapeText(workspaceNames[projectWorkspaces[p.id]])+' · awaiting external analysis</small></div><div class="mock-actions"><button class="mock-link" data-open-detail="'+p.id+'">Details</button><button class="mock-link" data-unmark="'+p.id+'">Remove mark</button></div></div>').join(''):'<div class="empty">No projects marked yet. Open a project and mark it for analysis.</div>')+'</div><div class="mock-note">A rescan is explicit; marking a project does not start an analysis or change its files.</div>';
 }
 if(activePage==='project-detail'){
  const p=samples.find(x=>x.id===selected);
  mockPage.innerHTML='<button class="mock-link back-link" data-custom="back-projects">← Back to projects</button>'+pageHead(escapeText(p.name),escapeText(p.description),'<button class="button '+(queued.has(p.id)?'':'primary')+'" data-custom="mark-project">'+(queued.has(p.id)?'Remove analysis mark':'Mark for analysis')+'</button>')+
  '<div class="detail-meta"><span class="badge">'+escapeText(workspaceNames[projectWorkspaces[p.id]])+'</span><span class="badge '+(p.state==='Inaccessible'?'warn':'ok')+'">'+escapeText(p.state)+'</span><span class="badge">Observed '+escapeText(p.observed)+'</span></div>'+
  '<div class="mock-two"><section class="mock-card"><h2>Project context</h2><p class="hint">'+escapeText(p.purpose)+'</p><div class="mock-row"><div><strong>Technologies</strong><small>'+escapeText((projectTech[p.id]||[]).join(', ')||'Unknown')+'</small></div><span class="badge">Observed</span></div><div class="mock-row"><div><strong>OpenSpec</strong><small>'+escapeText(p.openspec)+' · '+escapeText(p.openspecSource)+'</small></div></div><div class="mock-row"><div><strong>Knowledge</strong><small>'+escapeText(p.knowledge)+' · '+escapeText(p.knowledgeSource)+'</small></div></div><div class="mock-row"><div><strong>Project report</strong><small>'+escapeText(p.report)+' · '+escapeText(p.reportSource)+'</small></div></div></section><section class="mock-card"><h2>Deep analysis</h2><p class="hint">Mark this project, then use a coding agent outside this app with Vyasa MCP context. Scan again after the external work is complete.</p><div class="mock-row"><div><strong>1. Mark for analysis</strong><small>'+(queued.has(p.id)?'Marked in this sample session':'Not marked')+'</small></div></div><div class="mock-row"><div><strong>2. Analyze externally</strong><small>Use your coding agent and available MCP tools</small></div></div><div class="mock-row"><div><strong>3. Rescan</strong><small>Refresh the index after project changes</small></div><button class="mock-link" data-rescan>Run sample scan</button></div></section></div><section class="mock-card detail-section"><h2>Evidence</h2><p class="hint">Source and observation time for each fact.</p>'+p.evidence.map(e=>'<div class="mock-row"><div><strong>'+escapeText(e[0])+'</strong><small>'+escapeText(e[1])+'</small></div><span class="hint">'+escapeText(e[2])+'</span></div>').join('')+'</section>';
 }
};
function workspaceDialog(index){
 const d=document.createElement('dialog');d.className='mock-dialog';document.body.append(d);
 const editing=index!==null;
 d.innerHTML='<h2>'+(editing?'Rename workspace':'Add workspace')+'</h2><p>Sample changes only. This does not change your filesystem or Vyasa configuration.</p><label class="mock-label" for="workspace-name">Canonical name</label><input class="mock-input" id="workspace-name" value="'+escapeText(editing?workspaceNames[index]:'')+'" placeholder="e.g. Shared libraries">'+(editing?'':'<label class="mock-label" for="workspace-root">Local root</label><input class="mock-input" id="workspace-root" placeholder="e.g. E:\\Workspace\\Libraries">')+'<div class="mock-actions"><button class="button" data-cancel>Cancel</button><button class="button primary" data-save>Save sample</button></div>';
 d.showModal();d.querySelector('[data-cancel]').onclick=()=>d.close();d.addEventListener('close',()=>d.remove());d.querySelector('[data-save]').onclick=()=>{const name=d.querySelector('#workspace-name');const root=d.querySelector('#workspace-root');if(!name.value.trim()||root&&!root.value.trim()){showToast('Enter a name and root');return}if(editing)workspaceNames[index]=name.value.trim();else{workspaceNames.push(name.value.trim());roots.push(root.value.trim())}updateWorkspaceOptions();d.close();renderPage();showToast('Sample workspace saved')};
}
document.addEventListener('click',e=>{const el=e.target.closest('[data-custom],[data-all-workspaces],[data-workspace-projects],[data-rename-workspace],[data-technology],[data-open-detail],[data-unmark],[data-rescan]');if(!el)return;
 if(el.hasAttribute('data-all-workspaces')){workspaceFilter='all';technologyFilter='all';updateWorkspaceOptions();document.getElementById('technology-filter').value='all';navigate('projects');render()}
 else if(el.dataset.workspaceProjects!==undefined){workspaceFilter=el.dataset.workspaceProjects;technologyFilter='all';updateWorkspaceOptions();document.getElementById('technology-filter').value='all';navigate('projects');render()}
 else if(el.dataset.renameWorkspace!==undefined)workspaceDialog(Number(el.dataset.renameWorkspace));
 else if(el.dataset.technology){technologyFilter=el.dataset.technology;workspaceFilter='all';updateWorkspaceOptions();document.getElementById('technology-filter').value=technologyFilter;navigate('projects');render()}
 else if(el.dataset.openDetail){selected=el.dataset.openDetail;navigate('project-detail')}
 else if(el.dataset.unmark){queued.delete(el.dataset.unmark);renderPage();showToast('Analysis mark removed')}
 else if(el.hasAttribute('data-rescan')){scanCount++;showToast('Sample scan completed. No files were accessed.')}
 else if(el.dataset.custom==='add-workspace')workspaceDialog(null);
 else if(el.dataset.custom==='back-projects'){navigate('projects');render()}
 else if(el.dataset.custom==='mark-project'){openAnalysisDialog(selected)}
});
render();
