export function renderToggle(isAuto: boolean) {
  // return `<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-1">
  //   <input type="checkbox" id="switch-1" class="mdl-switch__input" checked>
  //   <span class="mdl-switch__label"></span>
  // </label>`;
  let classNames = 'mdl-button mdl-js-button mdl-button--raised';
  if (isAuto) {
    classNames += ' mdl-button--accent';
  }
  return `<button class="${classNames}" id="button-auto">
        auto ${isAuto}
    </button>`;
}

export function renderTable(apts) {
  return `<table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
${apts.map(renderRow).join('')}
</table>`;
}

function renderRow(apt) {
  return `<tr>
    <td>${apt.date}</td>
    <td>${apt.firstName} ${apt.lastName}</td>
    <td>${apt.phone || ''}</td>
    <td>${apt.email}</td>
  </tr>`;
}

export function renderButton() {
  return `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="button-add">
        <i class="material-icons">add</i>
    </button>`;
}