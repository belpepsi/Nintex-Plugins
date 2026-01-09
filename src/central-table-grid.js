import { pluginContractSchema } from "@nintex/form-plugin-contract";

class CentralTableGrid extends HTMLElement {
  static async getMetaConfig() {
    const contract = {
      version: "1",
      controlName: "Central Table Grid",
      fallbackDisableSubmit: false,
      properties: {
        value: {
          type: "object",
          title: "Value",
          isValueField: true,
          defaultValue: {}
        }
      }
    };

    pluginContractSchema.parse(contract);
    return contract;
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <div style="padding:8px;border:1px solid #ddd;border-radius:6px;">
        Central Table Grid Loaded ✅
      </div>
    `;
  }
}

customElements.define("central-table-grid", CentralTableGrid);
