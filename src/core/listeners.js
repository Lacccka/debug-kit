export function setupListeners({ bus }){
  let vpt = { w: innerWidth, h: innerHeight, scale: (visualViewport && visualViewport.scale) || 1 };
  const emitViewport = () => bus.emit('viewport:change', {...vpt});
  const onV = () => { vpt = { w: innerWidth, h: innerHeight, scale: (visualViewport && visualViewport.scale) || 1 }; emitViewport(); };
  window.addEventListener('resize', onV, {passive:true});
  if (window.visualViewport) {
    visualViewport.addEventListener('resize', onV, {passive:true});
    visualViewport.addEventListener('scroll', onV, {passive:true});
  }
  emitViewport();
}
