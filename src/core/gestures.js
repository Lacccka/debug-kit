export function setupGestures({ bus, togglePanel }){
  // Тогглер (кнопка) отрисует панель сам компонент panel
  // Alt+D
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyD' && !/input|textarea/i.test((document.activeElement||{}).tagName||'')) {
      e.preventDefault(); togglePanel();
    }
  }, {passive:false});
  // URL #debug
  if (location.hash.includes('debug')) togglePanel();
}
