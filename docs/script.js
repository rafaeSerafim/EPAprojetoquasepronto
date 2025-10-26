document.addEventListener('DOMContentLoaded', () => {
    const ORBIT_PERIOD_MS = 25000;
    
    const MIN_SCALE = 0.6;
    const MAX_SCALE = 1.1;

    const orbit = document.getElementById('orbit');
    const planets = Array.from(document.querySelectorAll('.planet'));
    
    
    const topName = document.getElementById('topName');
    const topShort = document.getElementById('topShort');
    

    let width, height, cx, cy;
    let radiusX, radiusY;
    let lastTime = null;
    let rotation = 0;

    const N = planets.length;
    const angleStep = (2 * Math.PI) / N;
    const baseAngles = planets.map((_, i) => i * angleStep);

    
    function resize() {
        width = orbit.clientWidth;
        height = orbit.clientHeight;
        cx = width / 2;
        cy = height / 2;
        
        
        radiusX = Math.min(width, 1200) * 0.35; 
        radiusY = Math.min(height, 900) * 0.07;
    }
    window.addEventListener('resize', resize);
    resize();

    
    function updatePositions() {
        let frontIndex = 0;
        let frontScale = -Infinity;

        planets.forEach((el, i) => {
            const angle = baseAngles[i] + rotation;
            const x = radiusX * Math.cos(angle);
            const y = radiusY * Math.sin(angle);

            const norm = (Math.sin(angle) + 1) / 2;
            const scale = MIN_SCALE + norm * (MAX_SCALE - MIN_SCALE);

            el.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${scale})`;
            el.style.zIndex = Math.round(scale * 100);
            el.style.opacity = 0.8 + norm * 0.2;

            el.classList.toggle('front', false);
            if (scale > frontScale) {
                frontScale = scale;
                frontIndex = i;
            }
        });

       
        const frontEl = planets[frontIndex];
        frontEl.classList.add('front');
        
        
        if (topName) {
            topName.textContent = frontEl.dataset.name ? frontEl.dataset.name.toUpperCase() : 'NOME INDEFINIDO';
        }
        if (topShort) {
            topShort.textContent = frontEl.dataset.short || '';
        }
    }
   


    function animate(ts) {
        if (!lastTime) lastTime = ts;
        const dt = ts - lastTime;
        lastTime = ts;

        rotation += (2 * Math.PI) * (dt / ORBIT_PERIOD_MS);
        if (rotation > Math.PI * 2) rotation -= Math.PI * 2;

        updatePositions();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    
    planets.forEach(planet => {
        planet.addEventListener('click', () => {
            const link = planet.dataset.link;
            if (link) window.location.href = link;
        });
    });
    

    // PARTE LAURO
    const url = 'http://127.0.0.1:8000/curiosidades';
    const curiosidadesBox = document.getElementById('curiosidades-box'); 
    
    
    if (curiosidadesBox) {
        curiosidadesBox.innerHTML = ''; 
    }

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Erro na rede: Status ${response.status}`);
            return response.json();
        })
        .then(data => {
            const curiosidades = Object.values(data); 

            if (curiosidades.length === 0) {
                if (curiosidadesBox) {
                    curiosidadesBox.innerHTML = '<div class="col-12 text-center text-muted">Nenhuma curiosidade encontrada.</div>';
                }
                return;
            }

            curiosidades.forEach(item => {
                const col = document.createElement('div');
                col.classList.add('col-md-4','mb-4');

                const card = document.createElement('div');
                card.classList.add('card','h-100','shadow');

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                const cardTitle = document.createElement('h5');
                cardTitle.classList.add('card-title');
                cardTitle.textContent = item.titulo; 

                const cardText = document.createElement('p');
                cardText.classList.add('card-text');
                cardText.textContent = item.descricao; 

                const button = document.createElement('button');
                button.classList.add('btn', 'btn-info', 'mt-3', 'w-100');
                button.innerText = 'Escolha um chat para te explicar melhor';

                
                button.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
               

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardBody.appendChild(button); 
                card.appendChild(cardBody);
                col.appendChild(card);
                
                if (curiosidadesBox) {
                    curiosidadesBox.appendChild(col);
                }
            });
        })
        .catch(err => {
            console.error('Erro ao buscar dados:', err);
            if (curiosidadesBox) {
                curiosidadesBox.innerHTML = `<div class="col-12 text-center text-danger">Erro ao carregar curiosidades (Verifique o console para detalhes)</div>`;
            }
        });
});