const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
if(menu&&nav){
 const mobile=window.matchMedia('(max-width:850px)');
 function sync(){menu.hidden=!mobile.matches;nav.hidden=mobile.matches;menu.setAttribute('aria-expanded',String(!nav.hidden));}
 sync();mobile.addEventListener('change',sync);
 menu.addEventListener('click',()=>{nav.hidden=!nav.hidden;menu.setAttribute('aria-expanded',String(!nav.hidden));});
 nav.addEventListener('click',e=>{if(mobile.matches&&e.target.closest('a')){nav.hidden=true;menu.setAttribute('aria-expanded','false');}});
}

/* Beyond Work: progressive, accessible scroll storytelling. */
function initBeyondStory(){
 const page=document.querySelector('.beyond-page');
 if(!page||!('IntersectionObserver' in window))return;
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(motion.matches)return;
 const targets=[...page.querySelectorAll(':scope > .eyebrow, :scope > h1, .beyond-section > .eyebrow, .beyond-section > h2, .travel-intro, .travel-stats > div, .beyond-section > .button, .volunteer-item, .beyond-section > p:not(.eyebrow)')];
 let observer;
 const frames=new Map();
 function count(el){
  const numbers=[...el.querySelectorAll('[data-story-count]')];
  numbers.forEach(number=>{
   if(number.dataset.counted)return;
   const label=number.textContent.trim(),match=label.match(/^(\d+)(\+?)$/);
   if(!match)return;
   const total=Number(match[1]),suffix=match[2];
   if(total<1)return;
   number.dataset.counted='true';
   number.setAttribute('aria-label',label);
   const start=performance.now();
   function tick(now){
    if(motion.matches){number.textContent=label;frames.delete(number);return;}
    const t=Math.min(1,(now-start)/950);
    number.textContent=String(Math.round(total*(1-Math.pow(1-t,3))))+suffix;
    if(t<1)frames.set(number,requestAnimationFrame(tick));else{number.textContent=label;frames.delete(number);}
   }
   frames.set(number,requestAnimationFrame(tick));
  });
 }
 function reveal(el){
  el.classList.remove('story-pending');
  el.classList.add('story-revealed');
  observer.unobserve(el);
  count(el);
 }
 observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting)reveal(entry.target);});
 },{threshold:0,rootMargin:'0px 0px -32px 0px'});
 targets.forEach(el=>{
  const r=el.getBoundingClientRect();
  if(r.top>=window.innerHeight){el.classList.add('story-pending');}
  if(el.matches('.volunteer-item,.travel-stats > div')){
   const i=[...el.parentElement.children].indexOf(el);
   el.style.setProperty('--story-delay',((i%2)*90)+'ms');
  }
  observer.observe(el);
 });
 function restore(){
  observer.disconnect();
  targets.forEach(el=>el.classList.remove('story-pending','story-revealed'));
  frames.forEach((id,number)=>{cancelAnimationFrame(id);number.textContent=number.getAttribute('aria-label');});
  frames.clear();
 }
 motion.addEventListener('change',e=>{if(e.matches)restore();});
 page.addEventListener('focusin',e=>{const el=e.target.closest('.story-pending');if(el)reveal(el);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initBeyondStory);else initBeyondStory();


/* Theme preference is independent of the professional website. */
function initAmyTheme(){
 const button=document.querySelector('.theme-toggle'),root=document.documentElement;if(!button)return;
 function sync(){const dark=root.dataset.theme==='dark';const label=dark?'Switch to light mode':'Switch to dark mode';button.setAttribute('aria-label',label);button.title=label;}
 sync();
 button.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=next;try{localStorage.setItem('amy-theme',next);}catch(e){}sync();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAmyTheme);else initAmyTheme();
