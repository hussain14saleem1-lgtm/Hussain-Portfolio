function toggleCert(id){
    const card=document.getElementById(id);
    const isOpen=card.classList.contains('open');
    document.querySelectorAll('.cert-card.open').forEach(c=>c.classList.remove('open'));
    if(!isOpen)card.classList.add('open');
  }

  function filterProjects(cat, btn){
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.project-card').forEach(card=>{
      if(cat==='all'||card.dataset.cat===cat){
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  const glow=document.getElementById('glow');
  document.addEventListener('mousemove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';});
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}});
  },{threshold:0.1});
  document.querySelectorAll('.reveal,.timeline-item').forEach(el=>observer.observe(el));
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth'});});
  });