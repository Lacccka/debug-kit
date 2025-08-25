export const versioning = {
    init({ storage, ns }) {
        // точка расширения для будущих миграций ключей
        storage.setJSON(ns + "__version__", { major: 1 });
    },
};
