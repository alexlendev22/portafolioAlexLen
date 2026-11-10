/* =========================================================================
    TEMA CLARO / OSCURO
    Objetivo: alternar entre tema claro y oscuro, y recordar la elección del
    usuario entre visitas usando localStorage.
    El cambio visual en sí (colores) lo define el CSS a partir del atributo
    data-theme en <html>; aquí solo se gestiona qué valor tiene ese atributo.
   ========================================================================= */

const btnTema = document.querySelector('#btn-tema');

// Aplica un tema dado: actualiza el atributo data-theme y los atributos
// de accesibilidad del interruptor (aria-checked / aria-label) para que
// lectores de pantalla anuncien correctamente su estado actual.
function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    btnTema.setAttribute('aria-checked', tema === 'dark' ? 'true' : 'false');
    btnTema.setAttribute('aria-label',
        tema === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
}

// Al cargar el script, sincroniza el estado del interruptor (aria-checked,
// aria-label) con el tema que ya se aplicó en el <head> (para evitar el
// parpadeo, ver el script inline de index.html). No cambia el tema en sí,
// solo pone al día los atributos de accesibilidad del botón.
aplicarTema(document.documentElement.getAttribute('data-theme') || 'light');

// Al hacer clic en el interruptor: alterna entre 'dark' y 'light',
// lo aplica y lo guarda en localStorage para que se recuerde en la próxima
// visita (el try/catch cubre el caso de que localStorage no esté disponible).
btnTema.addEventListener('click', () => {
    const nuevo = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    aplicarTema(nuevo);
    try { localStorage.setItem('tema', nuevo); } catch (e) {}
});


/* =========================================================================
    MENÚ EN MÓVIL
    Abre y cierra el panel de enlaces. Se cierra solo al elegir un enlace,
    al pulsar fuera de la píldora o con la tecla Escape.
   ========================================================================= */

const btnMenu = document.querySelector('#btn-menu');
const navEnlaces = document.querySelector('#nav-enlaces');

// Abre (true) o cierra (false) el panel y mantiene al día la accesibilidad del botón
function cambiarMenu(abrir) {
    navEnlaces.classList.toggle('abierto', abrir);
    btnMenu.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    btnMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
}

btnMenu.addEventListener('click', () => {
    cambiarMenu(!navEnlaces.classList.contains('abierto'));
});

navEnlaces.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) cambiarMenu(false);
});

document.addEventListener('click', (evento) => {
    if (!evento.target.closest('.nav-pildora')) cambiarMenu(false);
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') cambiarMenu(false);
});


/* =========================================================================
    ENLACE ACTIVO DEL MENÚ
    Marca en el menú la sección que se está viendo: la última cuyo inicio ya
    ha pasado por la mitad de la ventana. Al llegar al final de la página se
    marca siempre la última sección, que puede ser demasiado corta para
    alcanzar la mitad de la ventana.
   ========================================================================= */

const enlacesMenu = navEnlaces.querySelectorAll('a');
const secciones = [...document.querySelectorAll('main section')];

function actualizarEnlaceActivo() {
    const alFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const actual = alFinal
        ? secciones[secciones.length - 1]
        : secciones.filter((s) => s.getBoundingClientRect().top <= window.innerHeight / 2).pop() || secciones[0];

    enlacesMenu.forEach((enlace) => {
        if (enlace.getAttribute('href') === '#' + actual.id) {
            enlace.setAttribute('aria-current', 'true');
        } else {
            enlace.removeAttribute('aria-current');
        }
    });
}

window.addEventListener('scroll', actualizarEnlaceActivo, { passive: true });
window.addEventListener('resize', actualizarEnlaceActivo);
actualizarEnlaceActivo();


/* =========================================================================
    PILA DE HABILIDADES
    Conecta cada categoría de la lista con su placa del dibujo a través del
    atributo data-capa, y monta la pila una sola vez al entrar en pantalla.
   ========================================================================= */

const pila = document.querySelector('.pila');
const categorias = document.querySelectorAll('.categoria-habilidades');
const placas = document.querySelectorAll('.placa');

// Marca como activas la categoría y la placa de una capa, y desmarca las demás
function activarCapa(capa) {
    categorias.forEach((c) => c.classList.toggle('activa', c.dataset.capa === capa));
    placas.forEach((p) => p.classList.toggle('activa', p.dataset.capa === capa));
}

// mouseenter cubre el ratón y click cubre las pantallas táctiles
categorias.forEach((categoria) => {
    categoria.addEventListener('mouseenter', () => activarCapa(categoria.dataset.capa));
    categoria.addEventListener('click', () => activarCapa(categoria.dataset.capa));
});

// Montaje: si no se ha pedido reducir el movimiento, la pila empieza plegada
// (.por-montar) y se despliega la primera vez que aparece en pantalla.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pila.classList.add('por-montar');

    const observadorPila = new IntersectionObserver((entradas) => {
        if (!entradas[0].isIntersecting) return;
        observadorPila.disconnect();
        pila.classList.add('montando');
        // Doble requestAnimationFrame: da al navegador un fotograma para
        // registrar la transición antes de quitar el estado plegado
        requestAnimationFrame(() => requestAnimationFrame(() => pila.classList.remove('por-montar')));
        // Al terminar, se quita .montando para que el cambio de capa responda sin retraso
        setTimeout(() => pila.classList.remove('montando'), 1400);
    }, { threshold: 0.35 });

    observadorPila.observe(pila);
}
