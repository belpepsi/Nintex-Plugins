class f extends HTMLElement {
  static async getMetaConfig() {
    return {
      version: "1",
      controlName: "Central Table Grid",
      fallbackDisableSubmit: !1,
      description: "Editable table grid with add/delete rows and sortable columns.",
      groupName: "Central Custom Controls",
      properties: {
        // ✅ Must be a primitive type. We'll store JSON string here.
        value: {
          type: "string",
          title: "Grid value",
          isValueField: !0,
          defaultValue: "[]"
        },
        // ✅ Title must pass Nintex regex (avoid parentheses/special chars)
        columnsJson: {
          type: "string",
          title: "Columns JSON",
          defaultValue: '[{"field":"col1","label":"Column 1","type":"text","editable":true}]',
          description: 'JSON array like: [{"field":"item","label":"Item","type":"text","editable":true},{"field":"qty","label":"Qty","type":"number","editable":true}]'
        },
        allowAdd: { type: "boolean", title: "Allow add rows", defaultValue: !0 },
        allowDelete: { type: "boolean", title: "Allow delete rows", defaultValue: !0 },
        allowSort: { type: "boolean", title: "Allow sorting", defaultValue: !0 },
        minRows: { type: "integer", title: "Minimum rows", defaultValue: 0 },
        // ✅ Title must pass regex; keep it simple
        maxRows: { type: "integer", title: "Maximum rows", defaultValue: 0 },
        readOnly: { type: "boolean", title: "Read only", defaultValue: !1 }
      }
    };
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this._config = {
      columns: [],
      allowAdd: !0,
      allowDelete: !0,
      allowSort: !0,
      minRows: 0,
      maxRows: 0,
      readOnly: !1
    }, this._rows = [], this._sort = { field: null, dir: "asc" }, this._onAddRow = this._onAddRow.bind(this);
  }
  connectedCallback() {
    const t = this.getAttribute("columnsjson") || this.getAttribute("columnsJson");
    t && !this._columnsJson && (this.columnsJson = t), this._ensureMinRows(), this._ensureRowShape(), this._render();
  }
  // ---------------- Nintex-set properties ----------------
  // value is a JSON string representing rows: '[{...},{...}]'
  set value(t) {
    const o = typeof t == "string" ? t : "[]";
    this._valueStr = o;
    try {
      const e = JSON.parse(o);
      this._rows = Array.isArray(e) ? e : [];
    } catch {
      this._rows = [];
    }
    this._ensureMinRows(), this._ensureRowShape(), this._render();
  }
  get value() {
    return typeof this._valueStr == "string" ? this._valueStr : "[]";
  }
  set columnsJson(t) {
    this._columnsJson = typeof t == "string" ? t : "", this._applyColumnsFromColumnsJson(this._columnsJson), this._ensureRowShape(), this._render();
  }
  get columnsJson() {
    return this._columnsJson;
  }
  set allowAdd(t) {
    this._config.allowAdd = !!t, this._render();
  }
  set allowDelete(t) {
    this._config.allowDelete = !!t, this._render();
  }
  set allowSort(t) {
    this._config.allowSort = !!t, this._render();
  }
  set minRows(t) {
    this._config.minRows = Math.max(0, Number(t) || 0), this._ensureMinRows(), this._render();
  }
  set maxRows(t) {
    this._config.maxRows = Math.max(0, Number(t) || 0), this._render();
  }
  set readOnly(t) {
    this._config.readOnly = !!t, this._render();
  }
  // ---------------- Helpers ----------------
  _emitValueChange() {
    const t = JSON.stringify(this._rows ?? []);
    this._valueStr = t, this.dispatchEvent(new CustomEvent("ntx-value-change", {
      bubbles: !0,
      composed: !0,
      detail: t
    }));
  }
  _applyColumnsFromColumnsJson(t) {
    if (!t) {
      this._config.columns = [];
      return;
    }
    try {
      const o = JSON.parse(t);
      if (!Array.isArray(o)) return;
      this._config.columns = o.filter((e) => e && typeof e.field == "string" && e.field.trim().length > 0).map((e) => ({
        field: String(e.field),
        label: e.label != null ? String(e.label) : String(e.field),
        type: e.type === "number" || e.type === "boolean" || e.type === "checkbox" ? e.type : "text",
        editable: !!e.editable
      }));
    } catch {
    }
  }
  _maxRowsLimit() {
    return this._config.maxRows > 0 ? this._config.maxRows : null;
  }
  _defaultCellValue(t) {
    return t === "number" ? 0 : t === "boolean" || t === "checkbox" ? !1 : "";
  }
  _getDefaultRow() {
    const t = {};
    for (const o of this._config.columns) t[o.field] = this._defaultCellValue(o.type);
    return t;
  }
  _ensureMinRows() {
    var t;
    for (; (((t = this._rows) == null ? void 0 : t.length) ?? 0) < (this._config.minRows || 0); )
      this._rows.push(this._getDefaultRow());
  }
  _ensureRowShape() {
    const t = this._config.columns || [];
    this._rows = (this._rows || []).map((o) => {
      const e = { ...o || {} };
      for (const r of t) r.field in e || (e[r.field] = this._defaultCellValue(r.type));
      return e;
    });
  }
  _canAdd() {
    if (this._config.readOnly || !this._config.allowAdd) return !1;
    const t = this._maxRowsLimit();
    return t == null ? !0 : this._rows.length < t;
  }
  _canDelete() {
    return this._config.readOnly || !this._config.allowDelete ? !1 : this._rows.length > (this._config.minRows || 0);
  }
  _sortRows(t) {
    if (!this._config.allowSort || !this._sort.field) return t;
    const { field: o, dir: e } = this._sort, r = this._config.columns.find((a) => a.field === o), d = (r == null ? void 0 : r.type) || "text", c = [...t].sort((a, s) => {
      const i = a == null ? void 0 : a[o], n = s == null ? void 0 : s[o];
      return d === "number" ? Number(i ?? 0) - Number(n ?? 0) : String(i ?? "").toLowerCase().localeCompare(String(n ?? "").toLowerCase());
    });
    return e === "desc" ? c.reverse() : c;
  }
  _toggleSort(t) {
    this._config.allowSort && (this._sort.field !== t ? this._sort = { field: t, dir: "asc" } : this._sort.dir = this._sort.dir === "asc" ? "desc" : "asc", this._render());
  }
  _onAddRow() {
    this._canAdd() && (this._rows = [...this._rows, this._getDefaultRow()], this._emitValueChange(), this._render());
  }
  _onDeleteRow(t) {
    if (!this._canDelete()) return;
    const e = this._sortRows(this._rows)[t], r = this._rows.indexOf(e);
    if (r < 0) return;
    const d = [...this._rows];
    d.splice(r, 1), this._rows = d, this._emitValueChange(), this._render();
  }
  _onEditCell(t, o, e) {
    if (this._config.readOnly) return;
    const d = this._sortRows(this._rows)[t], c = this._rows.indexOf(d);
    if (c < 0) return;
    const a = this._config.columns.find((l) => l.field === o), s = (a == null ? void 0 : a.type) || "text", i = [...this._rows], n = { ...i[c] || {} };
    s === "number" ? n[o] = Number.isFinite(Number(e)) ? Number(e) : null : s === "boolean" || s === "checkbox" ? n[o] = !!e : n[o] = e ?? "", i[c] = n, this._rows = i, this._emitValueChange();
  }
  _render() {
    const t = this._config.columns || [], o = this._sortRows(this._rows || []), e = `
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
    `, r = t.map((s) => {
      const i = this._config.allowSort ? "sortable" : "", l = this._sort.field === s.field ? this._sort.dir === "asc" ? "▲" : "▼" : "";
      return `<th class="${i}" data-sort="${s.field}">${s.label}<span class="sort">${l}</span></th>`;
    }).join(""), d = this._config.allowDelete ? '<th class="actions">Actions</th>' : "", c = o.length === 0 ? `<tr><td class="empty" colspan="${t.length + (this._config.allowDelete ? 1 : 0)}">
           <span class="muted">No rows. ${this._canAdd() ? "Click Add row to begin." : ""}</span>
         </td></tr>` : o.map((s, i) => {
      const n = t.map((u) => {
        const h = s == null ? void 0 : s[u.field];
        return u.editable && !this._config.readOnly ? u.type === "number" ? `<td><input type="number" data-r="${i}" data-f="${u.field}" value="${Number(h ?? 0)}" /></td>` : u.type === "boolean" || u.type === "checkbox" ? `<td><input type="checkbox" data-r="${i}" data-f="${u.field}" ${h ? "checked" : ""} /></td>` : `<td><input type="text" data-r="${i}" data-f="${u.field}" value="${String(h ?? "")}" /></td>` : `<td>${h ?? ""}</td>`;
      }).join(""), l = this._config.allowDelete ? `<td class="actions"><button type="button" data-del="${i}" ${this._canDelete() ? "" : "disabled"}>Delete</button></td>` : "";
      return `<tr>${n}${l}</tr>`;
    }).join("");
    this.shadowRoot.innerHTML = `
      <style>${e}</style>
      <div class="wrap">
        <div class="toolbar">
          ${this._config.allowAdd ? `<button type="button" id="addRow" ${this._canAdd() ? "" : "disabled"}>Add row</button>` : ""}
          <span class="muted">${o.length} row(s)</span>
        </div>
        <table>
          <thead><tr>${r}${d}</tr></thead>
          <tbody>${c}</tbody>
        </table>
      </div>
    `;
    const a = this.shadowRoot.getElementById("addRow");
    a && a.addEventListener("click", this._onAddRow), this._config.allowSort && this.shadowRoot.querySelectorAll("th[data-sort]").forEach((s) => {
      s.addEventListener("click", () => this._toggleSort(s.getAttribute("data-sort")));
    }), this.shadowRoot.querySelectorAll("input[data-r][data-f]").forEach((s) => {
      const i = Number(s.getAttribute("data-r")), n = s.getAttribute("data-f");
      s.type === "checkbox" ? s.addEventListener("change", (l) => this._onEditCell(i, n, l.target.checked)) : (s.addEventListener("blur", (l) => this._onEditCell(i, n, l.target.value)), s.addEventListener("keydown", (l) => {
        l.key === "Enter" && (l.preventDefault(), l.target.blur());
      }));
    }), this.shadowRoot.querySelectorAll("button[data-del]").forEach((s) => {
      s.addEventListener("click", () => this._onDeleteRow(Number(s.getAttribute("data-del"))));
    });
  }
}
customElements.get("central-table-grid") || customElements.define("central-table-grid", f);
