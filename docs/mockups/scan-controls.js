/* Scan actions are simulated; no filesystem or backend is accessed. */
const originalScanPage=renderPage;
renderPage=function(){
 originalScanPage();
 if(activePage==='project-detail'){
  mockPage.querySelectorAll('[data-custom="mark-project"],[data-complete-analysis],[data-rescan-after-analysis]').forEach(button=>button.remove());
  const head=mockPage.querySelector('.mock-head');
  if(head){const button=document.createElement('button');button.className='button primary';button.type='button';button.textContent='Scan project';button.dataset.scanProject=selected;head.append(button)}
  mockPage.querySelectorAll('.mock-detail').forEach(el=>{if(el.textContent.includes('Your sample request:'))el.remove()});
  if(projectSection==='analysis'){
   const heading=mockPage.querySelector('.review-content .section-top .hint');if(heading)heading.textContent='Report content is created outside the app and displayed after a scan.';
   mockPage.querySelectorAll('.mock-detail').forEach(el=>{if(el.textContent.includes('No external analysis has been requested'))el.textContent='No external analysis report is available in this sample.'});
  }
 }
};
function scanDialog(projectId){
 const dialog=document.createElement('dialog');dialog.className='mock-dialog';document.body.append(dialog);
 const project=projectId?samples.find(p=>p.id===projectId):null;
 dialog.innerHTML='<h2>'+(project?'Scan project':'Choose scan scope')+'</h2><p>'+(project?'Scan only '+escapeText(project.name)+'.':'Choose all workspaces or one named workspace.')+' This is a sample action and does not access files.</p>'+(project?'':'<label class="mock-label" for="scan-scope">Scan scope</label><select id="scan-scope" class="mock-input"><option value="all">All workspaces</option>'+workspaceNames.map((name,i)=>'<option value="'+i+'">'+escapeText(name)+'</option>').join('')+'</select>')+'<div class="mock-actions"><button class="button" data-cancel-scan>Cancel</button><button class="button primary" data-confirm-scan>Run sample scan</button></div>';
 if(!project&&workspaceFilter!=='all')dialog.querySelector('#scan-scope').value=workspaceFilter;
 dialog.showModal();dialog.addEventListener('close',()=>dialog.remove());dialog.querySelector('[data-cancel-scan]').onclick=()=>dialog.close();
 dialog.querySelector('[data-confirm-scan]').onclick=()=>{const scope=project?project.name:(dialog.querySelector('#scan-scope').value==='all'?'All workspaces':workspaceNames[Number(dialog.querySelector('#scan-scope').value)]);scanCount++;dialog.close();if(activePage==='scans')renderPage();showToast('Sample scan: '+scope+'. No files were accessed.')};
}
document.addEventListener('click',event=>{
 const control=event.target.closest('[data-action="quick-scan"],[data-action="scan"],[data-rescan],[data-scan-project]');
 if(!control)return;
 event.preventDefault();event.stopImmediatePropagation();
 scanDialog(control.dataset.scanProject||null);
},true);
