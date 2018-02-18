const template = document.createElement('template');
template.innerHTML = `
<style>
  .test-tr {
    background-color: #ff5722;
  }
</style>
<table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
  <tr id="1"><td>Row 1</td></tr>
  <tr id="2"><td>Row 2</td></tr>
</table>
`;

// Could get this to work by making a global "store" in wsStream and responding to it here, but it is basically
// reimplementing Redux.
class AppointmentTable extends HTMLElement {
  private rows: NodeListOf<HTMLTableRowElement>;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.rows = this.shadowRoot.querySelectorAll('tr');
    // populating rows from property would require iterating the shadowRoot DOM tree
    this.setRowHighlight('1');
  }

  static get observedAttributes() {
    return ['appts'];
  }

  public attributeChangedCallback(name, oldValue, newValue) {
    // console.log('attributeChangedCallback', name, oldValue, newValue);
    this.setRowHighlight(newValue);
  }

  private setRowHighlight(rowId) {
    // Purely relies on side-effects, so not pure anyway
    // Array.from(this.rows).map(x => {
    //   if (x.getAttribute('id') === '1') {
    //     console.log('id is 1', x);
    //     x.classList.add('test-tr');
    //   }
    // });
    this.rows.forEach(row => {
      if (row.getAttribute('id') === rowId) {
        row.classList.add('test-tr');
      } else {
        row.classList.remove('test-tr');
      }
    });
  }
}

customElements.define('appointment-table', AppointmentTable);
