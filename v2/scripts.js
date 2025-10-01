// v2 interactions
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

// Simple noise background on canvas
const canvas = document.getElementById('noise');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight * .8; draw(); };
  const draw = () => {
    const img = ctx.createImageData(canvas.width, canvas.height);
    for (let i=0;i<img.data.length;i+=4){
      const n = Math.random()*255|0;
      img.data[i]=n; img.data[i+1]=n; img.data[i+2]=n; img.data[i+3]=20;
    }
    ctx.putImageData(img,0,0);
  };
  addEventListener('resize', resize); resize();
}

// Mobile burger
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
burger?.addEventListener('click', ()=>{
  const open = menu?.style.display !== 'flex';
  if (menu) menu.style.display = open ? 'flex' : 'none';
});


