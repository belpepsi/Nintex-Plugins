import { pluginContractSchema } from "@nintex/form-plugin-contract";

/**
 * Central Table Grid
 * - Configurable columns via columnsJson (string)
 * - Add/delete rows
 * - Edit cells
 * - Sort by clicking headers
 *
 * Stored value shape:
 *   { rows: Array<Record<string, any>> }
 *
 * columnsJson example:
 * [
 *  {"field":"item","label":"Item","type":"text","editable":true},
 *  {"field":"qty","label":"Qty","type":"number","editable":true},
 *  {"field":"active","label":"Active","type":"boolean","editable":true}
 * ]
 */

class CentralTableGrid extends HTMLElement {
  static async getMetaConfig() {
    const contract = {
      version: "1",
      controlName: "Central Table Grid",
      fallbackDisableSubmit: false,
      description: "Editable table grid with add/delete rows and sortable columns.",
      groupName: "Central Custom Controls",
      properties: {
        value: {
          type: "object",
          title: "Grid value",
          isValueField: true,
          defaultValue: { rows: [] }
        },
        columnsJson: {
          type: "string",
          title: "Columns (JSON)",
          defaultValue:
            '[{"field":"col1","label":"Column 1","type":"text","editable":true}]',
          description:
            'JSON array like: [{"field":"item","label":"Item","type":"text","editable":true},{"field":"qty","label":"Qty","type":"number","editable":true}]'
        },
        allowAdd: { type: "boolean", title: "Allow add rows", defaultValue: true },
        allowDelete: { type: "boolean", title: "Allow delete rows", defaultValue: true },
        allowSort: { type: "boolean", title: "Allow sorting", defaultValue: true },
        minRows: { type: "integer", title: "Minimum rows", defaultValue: 0 },
        maxRows: { type: "integer", title: "Maximum rows (0 = unlimited)", defaultValue: 0 },
        readOnly: { type: "boolean", title: "Read only", defaultValue: false }
      }
    };

    // Validate contract early (helps avoid "failed to load plugin definition")
    pluginContractSchema.parse(contract);
    return contract;
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._config = {
      columns: [],
      allowAdd: true,
      allowDelete: true,
      allowSort: true,
      minRows: 0,
      maxRows: 0,
      readOnly: false
    };

    this._value = { rows: [] };
    this._columnsJson = "";
    this._sort = { field: null, dir: "asc" };

    this._onAddRow = this._onAddRow.bind(this);
  }

  connectedCallback() {
    // In case the host hasn't set props yet
    const attrCols = this.getAttribute("columnsjson") || this.getAttribute("columnsJson");
    if (attrCols && !this._columnsJson) this.columnsJson = attrCols;

    this._ensureMinRows();
    this._ensureRowShape();
    this._render();
  }

  // ---- Nintex-set properties ----
  set value(v) {
    this._value = { rows: Array.isArray(v?.rows) ? v.rows : [] };
    this._ensureMinRows();
    this._ensureRowShape();
    this._render();
  }
  get value() { return this._value; }

  set columnsJson(json) {
    this._columnsJson = typeof json === "string" ? json : "";
    this._applyColumnsFromColumnsJson(this._columnsJson);
    this._ensureRowShape();
    this._render();
  }
  get columnsJson() { return this._columnsJson; }

  set allowAdd(v) { this._config.allowAdd = !!v; this._render(); }
  set allowDelete(v) { this._config.allowDelete = !!v; this._render(); }
  set allowSort(v) { this._config.allowSort = !!v; this._render(); }
  set minRows(v) { this._config.minRows = Math.max(0, Number(v) || 0); this._ensureMinRows(); this._render(); }
  set maxRows(v) { this._config.maxRows = Math.max(0, Number(v) || 0); this._render(); }
  set readOnly(v) { this._config.readOnly = !!v; this._render(); }

  // ---- Helpers ----
  _emitValueChange() {
    this.dispatchEvent(new CustomEvent("ntx-value-change", {
      bubbles: true,
      composed: true,
      detail: this.value
    }));
  }

  _applyColumnsFromColumnsJson(json) {
    if (!json) {
      this._config.columns = [];
      return;
    }
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) return;

      this._config.columns = parsed
        .filter(c => c && typeof c.field === "string" && c.field.trim().length > 0)
        .map(c => ({
          field: String(c.field),
          label: c.label != null ? String(c.label) : String(c.field),
          type: (c.type === "number" || c.type === "boolean" || c.type === "checkbox") ? c.type : "text",
          editable: !!c.editable
        }));
    } catch {
      // Keep last-good columns; don't crash on invalid JSON.
    }
  }

  _maxRowsLimit() {
    return this._config.maxRows > 0 ? this._config.maxRows : null;
  }

  _defaultCellValue(type) {
    if (type === "number") return 0;
    if (type === "boolean" || type === "checkbox") return false;
    return "";
  }

  _getDefaultRow() {
    const row = {};
    for (const col of this._config.columns) row[col.field] = this._defaultCellValue(col.type);
    return row;
  }

  _ensureMinRows() {
    while (this._value.rows.length < (this._config.minRows || 0)) {
      this._value.rows.push(this._getDefaultRow());
    }
  }

  _ensureRowShape() {
    const cols = this._config.columns || [];
    this._value.rows = (this._value.rows || []).map(r => {
      const row = { ...(r || {}) };
      for (const c of cols) {
        if (!(c.field in row)) row[c.field] = this._defaultCellValue(c.type);
      }
      return row;
    });
  }

  _canAdd() {
    if (this._config.readOnly || !this._config.allowAdd) return false;
    const max = this._maxRowsLimit();
    return max == null ? true : this._value.rows.length < max;
  }

  _canDelete() {
    if (this._config.readOnly || !this._config.allowDelete) return false;
    return this._value.rows.length > (this._config.minRows || 0);
  }

  _sortRows(rows) {
    if (!this._config.allowSort || !this._sort.field) return rows;

    const { field, dir } = this._sort;
    const col = this._config.columns.find(c => c.field === field);
    const type = col?.type || "text";

    const sorted = [...rows].sort((a, b) => {
      const av = a?.[field];
      const bv = b?.[field];
      if (type === "number") return Number(av ?? 0) - Number(bv ?? 0);
      return String(av ?? "").toLowerCase().localeCompare(String(bv ?? "").toLowerCase());
    });

    return dir === "desc" ? sorted.reverse() : sorted;
  }

  _toggleSort(field) {
    if (!this._config.allowSort) return;
    if (this._sort.field !== field) this._sort = { field, dir: "asc" };
    else this._sort.dir = this._sort.dir === "asc" ? "desc" : "asc";
    this._render();
  }

  _onAddRow() {
    if (!this._canAdd()) return;
    this._value.rows = [...this._value.rows, this._getDefaultRow()];
    this._emitValueChange();
    this._render();
  }

  _onDeleteRow(renderedIndex) {
    if (!this._canDelete()) return;

    const rendered = this._sortRows(this._value.rows);
    const rowToDelete = rendered[renderedIndex];
    const idx = this._value.rows.indexOf(rowToDelete);
    if (idx < 0) return;

    const next = [...this._value.rows];
    next.splice(idx, 1);
    this._value.rows = next;

    this._emitValueChange();
    this._render();
  }

  _onEditCell(renderedIndex, field, rawValue) {
    if (this._config.readOnly) return;

    const rendered = this._sortRows(this._value.rows);
    const rowRef = rendered[renderedIndex];
    const idx = this._value.rows.indexOf(rowRef);
    if (idx < 0) return;

    const col = this._config.columns.find(c => c.field === field);
    const type = col?.type || "text";

    const nextRows = [...this._value.rows];
    const nextRow = { ...(nextRows[idx] || {}) };

    if (type === "number") nextRow[field] = Number.isFinite(Number(rawValue)) ? Number(rawValue) : null;
    else if (type === "boolean" || type === "checkbox") nextRow[field] = !!rawValue;
    else nextRow[field] = rawValue ?? "";

    nextRows[idx] = nextRow;
    this._value.rows = nextRows;

    this._emitValueChange();
  }

  _render() {
    const cols = this._config.columns || [];
    const rows = this._sortRows(this._value.rows || []);

    const style = `
      :host { display:block; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
      .wrap { border:1px solid #ddd; border-radius:8px; overflow:hidden; }
      .toolbar { display:flex; gap:8px; align-items:center; padding:10px; border-bottom:1px solid #eee; background:#fafafa; }
      button { padding:6px 10px; border:1px solid #ccc; background:white; border-radius:6px; cursor:pointer; }
      button:disabled { opacity:0.5; cursor:not-allowed; }
      table { width:100%; border-collapse:collapse; }
      th, td { padding:8px 10px; border-bottom:1px solid #eee; vertical-align:top; }
      th { text-align:left; font-weight:600; background:#fcfcfc; user-select:none; }
      th.sortable { cursor:pointer; }
      th .sort { font-size:12px; margin-left:6px; opacity:0.7; }
      input[type="text"], input[type="number"] { width:100%; box-sizing:border-box; padding:6px 8px; border:1px solid #ccc; border-radius:6px; }
      .actions { width:1%; white-space:nowrap; }
      .muted { color:#666; font-size:12px; }
      .empty { padding:12px 10px; }
    `;

    const headerCells = cols.map(c => {
      const sortable = this._config.allowSort ? "sortable" : "";
      const isSorted = this._sort.field === c.field;
      const glyph = isSorted ? (this._sort.dir === "asc" ? "▲" : "▼") : "";
      return `<th class="${sortable}" data-sort="${c.field}">${c.label}<span class="sort">${glyph}</span></th>`;
    }).join("");

    const actionHeader = this._config.allowDelete ? `<th class="actions">Actions</th>` : "";

    const bodyRows = rows.length === 0
      ? `<tr><td class="empty" colspan="${cols.length + (this._config.allowDelete ? 1 : 0)}">
           <span class="muted">No rows. ${this._canAdd() ? "Click “Add row” to begin." : ""}</span>
         </td></tr>`
      : rows.map((row, rIdx) => {
          const tds = cols.map(c => {
            const val = row?.[c.field];
            const editable = c.editable && !this._config.readOnly;

            if (!editable) return `<td>${val ?? ""}</td>`;

            if (c.type === "number") {
              return `<td><input type="number" data-r="${rIdx}" data-f="${c.field}" value="${Number(val ?? 0)}" /></td>`;
            }
            if (c.type === "boolean" || c.type === "checkbox") {
              return `<td><input type="checkbox" data-r="${rIdx}" data-f="${c.field}" ${val ? "checked" : ""} /></td>`;
            }
            return `<td><input type="text" data-r="${rIdx}" data-f="${c.field}" value="${String(val ?? "")}" /></td>`;
          }).join("");

          const actions = this._config.allowDelete
            ? `<td class="actions"><button type="button" data-del="${rIdx}" ${this._canDelete() ? "" : "disabled"}>Delete</button></td>`
            : "";

          return `<tr>${tds}${actions}</tr>`;
        }).join("");

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <div class="wrap">
        <div class="toolbar">
          ${this._config.allowAdd ? `<button type="button" id="addRow" ${this._canAdd() ? "" : "disabled"}>Add row</button>` : ""}
          <span class="muted">${rows.length} row(s)</span>
        </div>
        <table>
          <thead><tr>${headerCells}${actionHeader}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    `;

    const addBtn = this.shadowRoot.getElementById("addRow");
    if (addBtn) addBtn.addEventListener("click", this._onAddRow);

    if (this._config.allowSort) {
      this.shadowRoot.querySelectorAll("th[data-sort]").forEach(th => {
        th.addEventListener("click", () => this._toggleSort(th.getAttribute("data-sort")));
      });
    }

    this.shadowRoot.querySelectorAll("input[data-r][data-f]").forEach(input => {
      const r = Number(input.getAttribute("data-r"));
      const f = input.getAttribute("data-f");

      if (input.type === "checkbox") {
        input.addEventListener("change", e => this._onEditCell(r, f, e.target.checked));
      } else {
        input.addEventListener("blur", e => this._onEditCell(r, f, e.target.value));
        input.addEventListener("keydown", e => {
          if (e.key === "Enter") { e.preventDefault(); e.target.blur(); }
        });
      }
    });

    this.shadowRoot.querySelectorAll("button[data-del]").forEach(btn => {
      btn.addEventListener("click", () => this._onDeleteRow(Number(btn.getAttribute("data-del"))));
    });
  }
}

customElements.define("central-table-grid", CentralTableGrid);
