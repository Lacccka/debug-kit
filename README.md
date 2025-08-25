# Debug-Kit

[![CI](https://github.com/Lacccka/debug-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/Lacccka/debug-kit/actions/workflows/ci.yml)

Универсальный инструмент для фронтенд-разработки и отладки.\
Можно быстро подключить к любому сайту (свой, чужой, тестовый).

## 🛠 Установка

Из npm:

```bash
npm install debug-kit
```

Для разработки:

```bash
git clone https://github.com/your-org/debug-kit.git
cd debug-kit
npm install
```

## 🔧 Сборка и тесты

```bash
npm run build
npm test
npm run size
```

## 🔌 Подключение на страницу

Бандлы:

-   `dist/debugkit.iife.js` — для подключения через `<script>` (глобальная переменная `DebugKit`).
-   `dist/debugkit.esm.js` — для прямого `import`.

### ESM

```js
import DebugKit from "debug-kit";

DebugKit.enableTool("guard");
```

### Script

```html
<script src="node_modules/debug-kit/dist/debugkit.iife.js"></script>
<script>
    DebugKit.enableTool("guard");
</script>
```

## 🚨 Lighthouse endpoint

Инструмент Lighthouse отправляет запрос на `/lighthouse` в текущем
origin.\
Запустите небольшой Node-бэкенд с Lighthouse CLI, чтобы предоставить
этот эндпоинт локально:

```js
import express from "express";
import { execFile } from "child_process";

const app = express();

app.get("/lighthouse", (req, res) => {
    const { url, strategy = "mobile" } = req.query;
    execFile(
        "npx",
        ["lighthouse", url, "--output=json", `--preset=${strategy}`],
        { maxBuffer: 1024 * 1024 },
        (err, stdout) => {
            if (err) {
                res.status(500).json({ error: "Lighthouse failed" });
                return;
            }
            res.json(JSON.parse(stdout));
        }
    );
});

app.listen(3000);
```

Установите зависимости и запустите сервер:

```bash
npm install express
npx lighthouse --help # убедитесь, что Lighthouse CLI доступен
node server.js
```

При использовании Debug‑Kit на удалённом сайте политика CORS браузера
может блокировать запросы к `/lighthouse`.\
Разместите эндпоинт на том же origin или настройте CORS.

---

## ✨ Возможности

-   Работает одинаково на **desktop** и **mobile**.
-   Панель запуска инструментов (Alt+D или плавающий тогглер).
-   Единый шаблон HUD: drag, snap к краям, сворачивание в «пилюлю»,
    сохранение позиции.
-   Лёгкое расширение новыми модулями.
-   Shadow DOM --- изоляция стилей.
-   Настройки и состояния сохраняются в `localStorage`.

---

## 📦 Архитектура

### Ядро

-   Контейнер в Shadow DOM (`#debugkit-host`).
-   Управление:
    -   реестр инструментов,
    -   включение/выключение,
    -   хранение состояния,
    -   глобальные слушатели (`resize`, `scroll`, `visualViewport`).
-   API:
    `js     DebugKit.registerTool({id, name, icon, init, destroy, ...});     DebugKit.enableTool(id);     DebugKit.disableTool(id);     DebugKit.toggleTool(id);     DebugKit.getState(id);     DebugKit.loadPlugin("https://cdn.example.com/my-tool.js");     DebugKit.bus.emit(event, data);     DebugKit.bus.on(event, fn);`

### Панель (Launcher)

-   Выезжающее окно с инструментами.
-   Шапка: заголовок + поиск.
-   Сетка карточек с тумблерами on/off.
-   Глобальные настройки (сброс, тема light/dark/auto, блокировка
    панели, экспорт/импорт).

### HUD

-   Карточка 240--320 px.
-   Шапка: иконка, название, drag-handle, кнопки
    (minimize/pin/settings/close).
-   Поведение:
    -   draggable мышью/тачем,
    -   snap к краям,
    -   запоминание позиции,
    -   свернуть в «пилюлю»,
    -   ограничение размера на мобиле ≤⅓ экрана.

### Event bus

-   Централизованные события:
    -   `viewport:change` -- изменение размеров окна или масштаба.
    -   `zoom:change` -- изменение `visualViewport.scale`.
    -   `scrollbar:change` -- появление или исчезновение скроллбаров.
    -   `theme:change` -- смена темы (системная или из панели).
    -   `panel:lock` -- состояние блокировки панели.
    -   `tool:state`
    -   `registry:change`

---

## 🛠 Инструменты (MVP)

-   **Guard** (готово)
    -   HUD: `viewport`, `scale`.
    -   Кнопка «Overflow scan» (подсветка переполненных элементов).
-   **Layout Debug**
    -   CLS, количество сдвигов, подсветка shift/overflow.
-   **Grid Overlay**
    -   Сетка: колонки, gutter, baseline.
-   **Perf HUD**
    -   FPS, long tasks, JS heap.
-   **Logger**
    -   Ошибки (`onerror`, `unhandledrejection`).
    -   Сеть (fetch/xhr).
-   **Text Tool**
    -   Изменение текста и адаптивный размер (min/max). Выбор элемента кликом. (Edit text with responsive font size; pick target by clicking.)

---

## ⚙️ Нефункциональные требования

-   Чистый JS + CSS, без зависимостей.
-   Fail-safe: ошибка модуля не ломает панель.
-   Минимальное влияние на перфоманс (throttling).
-   Современные браузеры (Chrome, Edge, Safari, Firefox).
-   Размер ядра + базовых модулей `< 50 KB gz`.

---

## 💾 Хранение состояния

В `localStorage` (с ключами `debugkit:v1:*`):

-   включённые инструменты,
-   позиции HUD,
-   настройки каждого модуля,
-   тема панели.

Версионирование ключей позволяет легко сбрасывать настройки при
обновлениях.

При изменении формата данных увеличивайте номер major: обновите префикс
`ns` в `src/index.js` и значение `major` в `src/core/versioning.js`.

---

## 🎨 UI/UX

-   Shadow DOM --- стили не пересекаются с сайтом.
-   Автотема (light/dark) + ручной переключатель.
-   Плавные анимации.
-   Минимизация HUD в «пилюлю».
-   Tooltip при наведении на кнопки.

---

## ⌨️ Горячие клавиши / жесты

-   Desktop: **Alt+D**.
-   Mobile:
    -   triple-tap (правый нижний угол),
    -   long-tap hotspot (8×8 px, левый верхний угол),
    -   `#debug` в URL.

---

## 🔮 Будущее расширение

-   Экспорт/импорт настроек (JSON).
-   Плагины (подключаемые из CDN).
-   Inspector (подсветка DOM под курсором).
-   Интеграция с локальным Lighthouse.

---

## ✅ Тестирование

Тестировать на:

-   Desktop: Chrome, Firefox, Safari.
-   Mobile: Chrome/Android, Safari/iOS.

Проверка:

-   корректность хоткеев/жестов,
-   включение/выключение каждого модуля,
-   сохранение позиций HUD,
-   работа при ошибках модуля,
-   кликабельность панели и HUD.

---

## 🤝 Вклад

Открывайте issue и отправляйте pull request. Перед коммитом запускайте `npm test`, `npm run build` и `npm run size`. Пишите сообщения коммитов на английском в повелительном наклонении.

---
