# API плагинов / Plugin API

`DebugKit.registerTool(tool)` — регистрирует новый инструмент.
_English: register a new tool._

```js
DebugKit.registerTool({
    id: "my-tool",
    name: "My Tool",
    icon: "T",
    init(ctx) {
        // ...
    },
    destroy() {
        // ...
    },
});
```

_English: usage example._

## Структура объекта инструмента / Tool object structure

-   `id` — уникальный идентификатор.
    _English: unique ID._
-   `name` — отображаемое имя.
    _English: display name._
-   `icon` — символ или HTML для иконки.
    _English: icon character._
-   `init(ctx)` — запускается при включении. `ctx` содержит `bus`, `shadowRoot`, `ns`, `storage`.
    _English: init with context._
-   `destroy()` — вызывается при отключении и очищает ресурсы.
    _English: cleanup on disable._

## Шина событий / Event bus

`DebugKit.bus.on(event, fn)` — подписка, `DebugKit.bus.emit(event, data)` — отправка.
_English: listen with on(), send with emit()._

### Встроенные события / Built-in events

-   `viewport:change` — изменение размеров окна.
    _English: viewport updated._
-   `zoom:change` — изменение масштаба.
    _English: zoom changed._
-   `scrollbar:change` — появление или исчезновение скроллбаров.
    _English: scrollbar visibility._
-   `theme:change` — смена темы.
    _English: theme changed._
-   `panel:lock` — блокировка панели.
    _English: panel lock._
-   `tool:state` — включение или выключение инструмента.
    _English: tool state._
-   `registry:change` — обновление реестра инструментов.
    _English: registry updated._
