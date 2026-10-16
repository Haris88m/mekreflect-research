// Progressive enhancement only. The research and case-study text is server-rendered.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
function closeMenu(){ if(!toggle || !nav)return; toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open'); }
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav?.classList.toggle('is-open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
const search=document.querySelector('#research-search');
search?.addEventListener('input',()=>{const query=search.value.trim().toLowerCase();let count=0;document.querySelectorAll('[data-search]').forEach(row=>{const show=row.dataset.search.includes(query);row.hidden=!show;if(show)count++;});document.querySelector('#research-count').textContent=`${count} research ${count===1?'theme':'themes'}`;document.querySelector('.empty-state').hidden=count!==0;});
document.querySelectorAll('.flow-tabs').forEach(list=>{
  const tabs=[...list.querySelectorAll('[role="tab"]')];
  function select(index,focus=false){tabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=!active;});if(focus)tabs[index].focus();}
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',event=>{let index;if(event.key==='ArrowRight')index=(i+1)%tabs.length;else if(event.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else return;event.preventDefault();select(index,true);});});
});
