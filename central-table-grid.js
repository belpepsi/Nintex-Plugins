/**
 * central-table-grid.js
 *
 * A lightweight table/grid web component for Nintex NAC Form Plugins.
 * Features:
 *  - Define columns via config (labels, field names, types, editable)
 *  - Add / delete rows
 *  - Inline edit cells
 *  - Sort by clicking column headers (asc/desc)
 *  - Emits `ntx-value-change` with the updated value payload
 *
 * Expected value shape:
 *  { rows: Array<Record<string, any>> }
 *
 * Configuration shape:
 *  {
 *    columns: [
 *      { field: "item", label: "Item", type: "text", editable: true },
 *      { field: "qty", label: "Qty", type: "number", editable: true },
 *      { field: "price", label: "Price", type: "number", editable: true },
 *    ],
 *    allowAdd: true,
 *    allowDelete: true,
 *    allowSort: true,
 *    minRows: 0,
 *    maxRows: null,
 *    readOnly: false
 *  }
 */

class CentralTableGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    /** @type {any} */
    this._config = {
      columns: [],
      allowAdd: true,
      allowDelete: true,
      allowSort: true,
      minRows: 0,
      maxRows: null,
      readOnly: false,
    };

    /** @type {{ rows: Array<Record<string, any>> }} */
    this._value = { rows: [] };

    this._sort = { field: null, dir: "asc" }; // dir: "asc" | "desc"
    this._onAddRow = this._onAddRow.bind(this);
  }

  /**
   * Optional: observe attributes if your plugin wrapper passes JSON via attributes.
   * You can set:
   *  - config='{"columns":[...]}'
   *  - value='{"rows":[...]}'
   */
  static get observedAttributes() {
    return ["config", "value", "readonly"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    try {
      if (name === "config" && newValue) {
        this.config = JSON.parse(newValue);
      }
      if (name === "value" && newValue) {
        this.value = JSON.parse(newValue);
      }
      if (name === "readonly") {
        this._config.readOnly = newValue === "true" || newValue === "" || newValue === "1";
        this._render();
      }
    } catch (e) {
      console.warn("[central-table-grid] Failed to parse attribute:", name, e);
    }
  }

  /** NAC / host can set config as a property */
  set config(cfg) {
    this._config = {
      ...this._config,
      ...(cfg || {}),
      columns: Array.isArray(cfg?.columns) ? cfg.columns : this._config.columns,
    };
    this._render();
  }
  get config() {
    return this._config;
  }

  /** NAC / host can set value as a property */
  set value(val) {
    const rows = Array.isArray(val?.rows) ? val.rows : [];
    this._value = { rows };
    this._render();
  }
  get value() {
    return this._value;
  }

  connectedCallback() {
    this._render();
  }

  /** Emit change so Nintex stores the plugin value */
  _emitValueChange() {
    const payload = this.value; // { rows: [...] }

    this.dispatchEvent(
      new CustomEvent("ntx-value-change", {
        bubbles: true,
        composed: true,
        detail: payload,
      })
    );
  }

  _coerceType(type, raw) {
    if (type === "number") {
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    }
    if (type === "checkbox" || type === "boolean") {
      return !!raw;
    }
    // default: string
    return raw ?? "";
  }

  _getDefaultRow() {
    const row = {};
    for (const col of this._config.columns) {
      if (!col?.field) continue;
      if (col.type === "number") row[col.field] = 0;
      else if (col.type === "checkbox" || col.type === "boolean") row[col.field] = false;
      else row[col.field] = "";
    }
    return row;
  }

  _canAdd() {
    if (this._config.readOnly) return false;
    if (!this._config.allowAdd) return false;
    const max = this._config.maxRows;
    return max == null ? true : this._value.rows.length < max;
  }

  _canDelete() {
    if (this._config.readOnly) return false;
    if (!this._config.allowDelete) return false;
    return this._value.rows.length > (this._config.minRows ?? 0);
  }

  _sortRows(rows) {
    if (!this._config.allowSort) return rows;
    const { field, dir } = this._sort;
    if (!field) return rows;

    const col = this._config.columns.find((c) => c.field === field);
    const type = col?.type || "text";

    const sorted = [...rows].sort((a, b) => {
      const av = a?.[field];
      const bv = b?.[field];

      if (type === "number") {
        const an = Number(av ?? 0);
        const bn = Number(bv ?? 0);
        return an - bn;
      }
      // string compare
      const as = String(av ?? "").toLowerCase();
      const bs = String(bv ?? "").toLowerCase();
      return as.localeCompare(bs);
    });

    return dir === "desc" ? sorted.reverse() : sorted;
  }

  _toggleSort(field) {
    if (!this._config.allowSort) return;
    if (this._sort.field !== field) {
      this._sort = { field, dir: "asc" };
    } else {
      this._sort.dir = this._sort.dir === "asc" ? "desc" : "asc";
    }
    this._render();
  }

  _onAddRow() {
    if (!this._canAdd()) return;
    this._value.rows = [...this._value.rows, this._getDefaultRow()];
    this._emitValueChange();
    this._render();
  }

  _onDeleteRow(indexInRendered) {
    if (!this._canDelete()) return;

    // rendered rows may be sorted; we need to delete the correct underlying row object
    const renderedRows = this._sortRows(this._value.rows);
    const rowToDelete = renderedRows[indexInRendered];
    const idx = this._value.rows.indexOf(rowToDelete);
    if (idx < 0) return;

    const next = [...this._value.rows];
    next.splice(idx, 1);
    this._value.rows = next;

    this._emitValueChange();
    this._render();
  }

  _onEditCell(renderedRowIndex, field, rawValue) {
    if (this._config.readOnly) return;

    const renderedRows = this._sortRows(this._value.rows);
    const rowRef = renderedRows[renderedRowIndex];
    const idx = this._value.rows.indexOf(rowRef);
    if (idx < 0) return;

    const col = this._config.columns.find((c) => c.field === field);
    const type = col?.type || "text";

    const nextRows = [...this._value.rows];
    const nextRow = { ...(nextRows[idx] || {}) };
    nextRow[field] = this._coerceType(type, rawValue);
    nextRows[idx] = nextRow;

    this._value.rows = nextRows;
    this._emitValueChange();
  }

  _render() {
    const cols = Array.isArray(this._config.columns) ? this._config.columns : [];
    const rows = this._sortRows(this._value.rows);

    const style = `
      :host { display: block; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
      .wrap { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
      .toolbar { display: flex; gap: 8px; align-items: center; padding: 10px; border-bottom: 1px solid #eee; background: #fafafa; }
      button { padding: 6px 10px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; }
      button:disabled { opacity: 0.5; cursor: not-allowed; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 8px 10px; border-bottom: 1px solid #eee; vertical-align: top; }
      th { text-align: left; font-weight: 600; background: #fcfcfc; user-select: none; }
      th.sortable { cursor: pointer; }
      th .sort { font-size: 12px; margin-left: 6px; opacity: 0.7; }
      tr:last-child td { border-bottom: none; }
      input[type="text"], input[type="number"] { width: 100%; box-sizing: border-box; padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; }
      .actions { width: 1%; white-space: nowrap; }
      .muted { color: #666; font-size: 12px; }
      .empty { padding: 12px 10px; }
    `;

    const headerCells = cols
      .map((c) => {
        const sortable = this._config.allowSort ? "sortable" : "";
        const isSorted = this._sort.field === c.field;
        const sortGlyph = isSorted ? (this._sort.dir === "asc" ? "▲" : "▼") : "";
        return `
          <th class="${sortable}" data-sort="${c.field}">
            ${c.label ?? c.field}
            <span class="sort">${sortGlyph}</span>
          </th>
        `;
      })
      .join("");

    const actionHeader = this._config.allowDelete ? `<th class="actions">Actions</th>` : "";

    const bodyRows =
      rows.length === 0
        ? `<tr><td class="empty" colspan="${cols.length + (this._config.allowDelete ? 1 : 0)}">
             <span class="muted">No rows. ${this._canAdd() ? "Click “Add row” to begin." : ""}</span>
           </td></tr>`
        : rows
            .map((row, rIdx) => {
              const tds = cols
                .map((c) => {
                  const val = row?.[c.field];
                  const editable = !!c.editable && !this._config.readOnly;
                  const type = c.type || "text";

                  if (!editable) {
                    return `<td>${val ?? ""}</td>`;
                  }

                  if (type === "number") {
                    return `<td>
                      <input type="number" data-r="${rIdx}" data-f="${c.field}" value="${Number(val ?? 0)}" />
                    </td>`;
                  }

                  if (type === "checkbox" || type === "boolean") {
                    const checked = val ? "checked" : "";
                    return `<td>
                      <input type="checkbox" data-r="${rIdx}" data-f="${c.field}" ${checked} />
                    </td>`;
                  }

                  // text
                  return `<td>
                    <input type="text" data-r="${rIdx}" data-f="${c.field}" value="${String(val ?? "")}" />
                  </td>`;
                })
                .join("");

              const actions = this._config.allowDelete
                ? `<td class="actions">
                     <button type="button" data-del="${rIdx}" ${this._canDelete() ? "" : "disabled"}>Delete</button>
                   </td>`
                : "";

              return `<tr>${tds}${actions}</tr>`;
            })
            .join("");

    const addButton = `
      <button type="button" id="addRow" ${this._canAdd() ? "" : "disabled"}>Add row</button>
      <span class="muted">${rows.length} row(s)</span>
    `;

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <div class="wrap">
        <div class="toolbar">
          ${this._config.allowAdd ? addButton : `<span class="muted">${rows.length} row(s)</span>`}
        </div>

        <table>
          <thead>
            <tr>
              ${headerCells}
              ${actionHeader}
            </tr>
          </thead>
          <tbody>
            ${bodyRows}
          </tbody>
        </table>
      </div>
    `;

    // Wire events
    const addBtn = this.shadowRoot.getElementById("addRow");
    if (addBtn) addBtn.addEventListener("click", this._onAddRow);

    // Sorting headers
    if (this._config.allowSort) {
      this.shadowRoot.querySelectorAll("th[data-sort]").forEach((th) => {
        th.addEventListener("click", () => this._toggleSort(th.getAttribute("data-sort")));
      });
    }

    // Cell edits
    this.shadowRoot.querySelectorAll("input[data-r][data-f]").forEach((input) => {
      const r = Number(input.getAttribute("data-r"));
      const f = input.getAttribute("data-f");

      if (input.type === "checkbox") {
        input.addEventListener("change", (e) => {
          this._onEditCell(r, f, e.target.checked);
        });
      } else {
        // Commit on blur (more performant than every keystroke)
        input.addEventListener("blur", (e) => {
          this._onEditCell(r, f, e.target.value);
        });
        // Also commit on Enter
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
          }
        });
      }
    });

    // Delete buttons
    this.shadowRoot.querySelectorAll("button[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const rIdx = Number(btn.getAttribute("data-del"));
        this._onDeleteRow(rIdx);
      });
    });
  }
}

customElements.define("central-table-grid", CentralTableGrid);
