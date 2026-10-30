/* Navigation and backend connection are a design preview; no process or database is accessed. */
let projectOrigin='roots';
const originalNavigation=navigate;
navigate=function(page){
 if(page==='workspace-view'||page==='technology-view'){
  projectOrigin=page==='workspace-view'?'roots':'technology';
  workspaceFilter='all';technologyFilter='all';
  updateWorkspaceOptions();
  document.getElementById('technology-filter').value='all';
  document.getElementById('search').value='';
  originalNavigation('projects');
  setBrowseMode();
  render();
  return;
 }
 originalNavigation(page);
 if(page==='projects'||page==='project-detail'){
  setBrowseMode();
  crumb.innerHTML=(projectOrigin==='technology'?'Technologies':'Workspaces')+' <span aria-hidden="true"> / </span> <strong>'+(page==='projects'?'Projects':'Project detail')+'</strong>';
 }
};
function setBrowseMode(){
 const technology=projectOrigin==='technology';
 document.querySelectorAll('[data-page]').forEach(b=>{const chosen=b.dataset.page===(technology?'technology-view':'workspace-view');b.classList.toggle('active',chosen);if(chosen)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 document.getElementById('workspace-filter').parentElement.hidden=technology;
 document.getElementById('technology-filter').parentElement.hidden=!technology;
 document.querySelector('.heading-actions').hidden=technology;
 document.querySelector('.heading h1').textContent=technology?'Projects by technology':'Projects by workspace';
 document.querySelector('.heading p').textContent=technology?'Choose a technology to find related projects.':'Choose a workspace to explore its projects.';
 document.getElementById('search').placeholder='Search projects';
 crumb.innerHTML=(technology?'Technologies':'Workspaces')+' <span aria-hidden="true"> / </span> <strong>Projects</strong>';
}
document.addEventListener('click',e=>{if(e.target.closest('[data-technology]'))projectOrigin='technology';else if(e.target.closest('[data-all-workspaces],[data-workspace-projects]'))projectOrigin='roots'},true);
const baseConnectionRenderer=renderPage;
renderPage=function(){
 baseConnectionRenderer();
 if(activePage==='project-detail'){
  const warning=document.createElement('div');warning.className='mock-callout example-notice';warning.innerHTML='<strong>Fictional example, not a scan of this project</strong><p>The same example assessment is used on accessible sample projects so you can review the intended layout. Findings, status and paths below are sample data.</p><button class="mock-link" data-capture-guide>How would this data be captured?</button>';const tabs=mockPage.querySelector('.review-tabs');tabs.before(warning);
 }
 if(activePage==='settings'){
  const section=document.createElement('section');section.className='mock-card detail-section';section.innerHTML='<div class="section-top"><div><h2>Vyasa backend and command-line tool</h2><p class="hint">Connection and version information is not available in this prototype.</p></div><span class="badge">Not connected</span></div><div class="mock-row"><div><strong>Vyasa UI version</strong><small>Version declared in this UI project’s package manifest</small></div><span class="badge">0.1.0 · sample display</span></div><div class="mock-row"><div><strong>Vyasa backend version</strong><small>To be obtained from a supported CLI or backend version contract</small></div><span class="badge">Unknown</span></div><div class="mock-row"><div><strong>CLI installation</strong><small>Not detected in this preview; no installation check was run</small></div><span class="badge">Not checked</span></div><div class="mock-row"><div><strong>Local project index</strong><small>Database location and schema compatibility require a defined backend interface</small></div><span class="badge">Not connected</span></div><div class="mock-detail">The proposed desktop integration uses a documented Vyasa CLI or another supported backend interface for deterministic scanning and indexed queries. The command syntax, version detection, process lifecycle, data format, error handling and safe database access are still to be specified and verified. No command is run from this mockup.</div>';mockPage.append(section);
 }
};
document.addEventListener('click',e=>{if(!e.target.closest('[data-capture-guide]'))return;const d=document.createElement('dialog');d.className='mock-dialog';document.body.append(d);d.innerHTML='<h2>How data would reach this view</h2><p><strong>Deterministic scan:</strong> the Vyasa CLI inspects supported project files, then the app reads indexed results through a defined backend interface. Sources, time and coverage accompany the facts.</p><p><strong>External analysis:</strong> a coding agent works outside the app and writes an allowed project report; a later explicit scan indexes it. The UI distinguishes the report’s assessment from scan observations.</p><p><strong>Your review:</strong> statuses and feedback need an agreed owner and storage contract. They currently exist only in this sample page.</p><div class="mock-actions"><button class="button primary" data-close-guide>Close</button></div>';d.showModal();d.addEventListener('close',()=>d.remove());d.querySelector('[data-close-guide]').onclick=()=>d.close()});
navigate('workspace-view');
