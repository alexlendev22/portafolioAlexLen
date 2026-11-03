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