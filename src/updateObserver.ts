import * as Rx from 'rxjs/Rx';
import updateAppointments, { initialRender } from './appointmentChanges';
import vTable from './vTable';

let appointmentsVTable = null;

export default function observeWsUpdates() {
  const subject = Rx.Observable.webSocket('ws://localhost:9001');
  subject.retry().subscribe(
    msg => {
      // const x = JSON.stringify(JSON.parse(msg));
      console.log('message received: ' + msg, msg);
      const result: any = msg;

      // TODO better dates, and sorting by date/time

      if (result.type === 'init') {
        // Receiving the initial state, including the ID
        setClientId(result.id);
        //console.log('observeWsUpdates init', result);
        appointmentsVTable = new vTable(result.appointments);
        initialRender(appointmentsVTable);
      } else if (result.type === 'add') {
        //console.log('observeWsUpdates add', result);
        // TODO implement
        appointmentsVTable.add(result.appointment);
      } else if (result.type === 'lock') {
        console.log('observeWsUpdates lock', result);
        // TODO implement
      } else if (result.type === 'delete') {
        console.log('observeWsUpdates delete', result);
        // TODO implement
      } else {
        // Update of state
        updateAppointments(result, (payload: string) => {
          subject.next(payload);
        });
      }
    },
    err => console.log(err),
    () => console.log('complete')
  );
  // subject.next(JSON.stringify({ message: 'Msg from browser' }));

  /* TODO automatically re-connect web socket if server restarts and get state -
   https://gearheart.io/blog/auto-websocket-reconnection-with-rxjs/
   */
}

function setClientId(id) {
  document.getElementById('clientId').innerHTML = id;
}
