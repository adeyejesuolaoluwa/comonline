document.addEventListener('DOMContentLoaded',()=>{
  // Simple slider
  const slides = Array.from(document.querySelectorAll('.product-showcase .slide'));
  const prev = document.querySelector('.product-showcase .prev');
  const next = document.querySelector('.product-showcase .next');
  let idx = 0;
  function show(i){
    slides.forEach(s=>s.classList.remove('active'));
    slides[i].classList.add('active');
  }
  prev?.addEventListener('click',()=>{ idx=(idx-1+slides.length)%slides.length; show(idx); });
  next?.addEventListener('click',()=>{ idx=(idx+1)%slides.length; show(idx); });
  // auto cycle
  setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); },5000);

  // Keyboard navigation for slider
  document.addEventListener('keydown',(e)=>{
    if(e.key==='ArrowRight') { idx=(idx+1)%slides.length; show(idx); }
    if(e.key==='ArrowLeft') { idx=(idx-1+slides.length)%slides.length; show(idx); }
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Counters
  const counters = document.querySelectorAll('.count');
  const counterObserver = new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target; const target = +el.dataset.target||0; let v=0; const step=Math.ceil(target/60);
        const t = setInterval(()=>{ v+=step; if(v>=target){ el.textContent=target; clearInterval(t); } else el.textContent=v; },20);
        obs.unobserve(el);
      }
    });
  },{threshold:0.6});
  counters.forEach(c=>counterObserver.observe(c));

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const current = localStorage.getItem('atelier_theme') || 'dark';
  if(current==='light') document.body.classList.add('theme-light');
  themeToggle?.addEventListener('click',()=>{
    const isLight = document.body.classList.toggle('theme-light');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    localStorage.setItem('atelier_theme', isLight?'light':'dark');
  });

  // Search overlay
  const searchToggle = document.getElementById('searchToggle');
  const search = document.getElementById('search');
  const searchClose = document.getElementById('searchClose');
  searchToggle?.addEventListener('click',()=>{
    const open = search.hasAttribute('hidden');
    if(open){ search.removeAttribute('hidden'); search.setAttribute('aria-hidden','false'); searchToggle.setAttribute('aria-expanded','true'); document.getElementById('searchInput')?.focus(); }
    else { search.setAttribute('hidden',''); search.setAttribute('aria-hidden','true'); searchToggle.setAttribute('aria-expanded','false'); }
  });
  searchClose?.addEventListener('click',()=>{ search.setAttribute('hidden',''); search.setAttribute('aria-hidden','true'); searchToggle.setAttribute('aria-expanded','false'); });
});
