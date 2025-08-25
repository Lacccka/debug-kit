export function renderList({ registry }) {
    const box = document.createElement("div");

    const tools = (registry.getAll && registry.getAll()) || [];
    const grid = document.createElement("div");
    grid.className = "dk-grid dk-grid--auto";

    function draw(filter = "") {
        grid.innerHTML = "";
        tools
            .filter((t) => {
                if (!filter) return true;
                const hay = `${t.name} ${t.id}`.toLowerCase();
                return hay.includes(filter);
            })
            .forEach(({ id, name, icon, enabled }) => {
                const card = document.createElement("div");
                card.className = "dk-card";

                const head = document.createElement("div");
                head.className = "dk-card__head";
                head.innerHTML = `<span class="i">${
                    icon || "🔧"
                }</span><span class="n">${name}</span>`;

                const ctrl = document.createElement("input");
                ctrl.type = "checkbox";
                ctrl.checked = !!enabled;

                ctrl.onchange = () => {
                    if (ctrl.checked) registry.enableTool(id);
                    else registry.disableTool(id);
                };

                const row = document.createElement("div");
                row.className = "dk-card__row";
                row.appendChild(head);
                row.appendChild(ctrl);

                card.appendChild(row);
                grid.appendChild(card);
            });
    }

    draw();

    // фильтр из панели
    box.addEventListener("dk:filter", (e) => {
        draw(e.detail || "");
    });

    box.appendChild(grid);
    return box;
}
