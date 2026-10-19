const b=document.querySelector('.menu-btn'),m=document.getElementById('menu'),n=document.querySelector('.nav');
b.addEventListener('click',()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu');document.body.classList.toggle('lock',o)});
m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');b.setAttribute('aria-expanded',false);document.body.classList.remove('lock')}));
const s=()=>n.classList.toggle('solid',scrollY>40);addEventListener('scroll',s);s();
