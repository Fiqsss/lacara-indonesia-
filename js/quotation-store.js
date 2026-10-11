(function (global) {
  const STORAGE_KEY = "lacara-quotation-items";
  const listeners = new Set();
  let items = [];

  function notify() {
    const snapshot = items.map(function (item) { return Object.assign({}, item); });
    listeners.forEach(function (listener) {
      listener(snapshot);
    });
  }

  function save() {
    try {
      global.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Unable to save the quotation list.", error);
    }
  }

  try {
    const storedItems = global.sessionStorage.getItem(STORAGE_KEY);
    if (storedItems) {
      const parsedItems = JSON.parse(storedItems);
      if (Array.isArray(parsedItems)) {
        items = parsedItems.filter(function (item) {
          return item && item.id !== undefined && String(item.name || "").trim();
        }).map(function (item) {
          const quantity = Number(item.qty);
          return {
            id: String(item.id),
            name: String(item.name).trim(),
            scientificName: String(item.scientificName || "").trim(),
            qty: Number.isInteger(quantity) && quantity > 0 ? quantity : 1
          };
        });
      }
    }
  } catch (error) {
    console.error("Unable to restore the quotation list.", error);
  }

  function add(product) {
    if (!product || product.id === undefined || !String(product.name || "").trim()) {
      return false;
    }
    const id = String(product.id);
    const existing = items.find(function (item) { return item.id === id; });
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: id,
        name: String(product.name).trim(),
        scientificName: String(product.scientificName || "").trim(),
        qty: 1
      });
    }
    save();
    notify();
    return items.find(function (item) { return item.id === id; }).qty;
  }

  function setQty(id, quantity) {
    const existing = items.find(function (item) { return item.id === String(id); });
    const nextQuantity = Number(quantity);
    if (!existing || !Number.isInteger(nextQuantity) || nextQuantity < 1) return false;
    if (existing.qty === nextQuantity) return true;
    existing.qty = nextQuantity;
    save();
    notify();
    return true;
  }

  function remove(id) {
    const nextItems = items.filter(function (item) { return item.id !== String(id); });
    if (nextItems.length === items.length) return false;
    items = nextItems;
    save();
    notify();
    return true;
  }

  function clear() {
    if (!items.length) return;
    items = [];
    save();
    notify();
  }

  global.quoteListStore = Object.freeze({
    get items() {
      return items.map(function (item) { return Object.assign({}, item); });
    },
    add: add,
    setQty: setQty,
    remove: remove,
    clear: clear,
    subscribe: function (listener) {
      listeners.add(listener);
      listener(global.quoteListStore.items);
      return function () { listeners.delete(listener); };
    }
  });
})(window);
