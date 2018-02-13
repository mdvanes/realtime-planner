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

export function renderEditDialog() {
  return `<dialog class="mdl-dialog">
    <h4 class="mdl-dialog__title">Editing appointment</h4>
    <div class="mdl-dialog__content">
      <p>
        Not yet possible to edit the fields.
      </p>
    </div>
    <div class="mdl-dialog__actions">
      <button type="button" class="mdl-button close">Close</button>
    </div>
  </dialog>`;
}

function formatDate(dateMillis) {
  const date = new Date(dateMillis);
  const formattedDate = date.toLocaleString('nl-NL', {
    weekday: 'long',
    // year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = date.toLocaleString('nl-NL', {
    hour: 'numeric',
    minute: 'numeric'
  });
  return formattedTime + ' ' + formattedDate;
}

function renderRow(apt) {
  let classNames = '';
  let editCell = `<button class="mdl-button mdl-js-button" id="button-lock" data-apt-id="${
    apt.aptId
  }">
        <i class="material-icons">edit</i>
    </button>`;
  if (apt.isLocked) {
    classNames += 'is-locked';
    editCell = `<i class="material-icons" title="${apt.byClientId}">lock</i>`;
  }
  return `<tr class="${classNames}">
    <td class="mdl-data-table__cell--non-numeric">${apt.date} ${formatDate(apt.date)}</td>
    <td>${apt.firstName} ${apt.lastName}</td>
    <td>${apt.phone || ''}</td>
    <td>${apt.email}</td>
    <td>${editCell}</td>
  </tr>`;
}

export function renderButton() {
  return `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="button-add">
        <i class="material-icons">add</i>
    </button>`;
}
