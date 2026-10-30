/* Keyboard behavior for the mockup's dynamically recreated project tabs. */
document.addEventListener('keydown',event=>{
 const current=event.target.closest('[role="tab"]');
 const list=current?.closest('[role="tablist"]');
 if(!list||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
 const tabs=Array.from(list.querySelectorAll('[role="tab"]:not([disabled])'));
 const index=tabs.indexOf(current);
 if(index<0||!tabs.length)return;
 const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:
  (index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
 event.preventDefault();
 tabs[next].click();
 const fresh=list.isConnected?list:document.querySelector('[role="tablist"]');
 fresh?.querySelectorAll('[role="tab"]')[next]?.focus();
});
