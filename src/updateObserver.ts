import * as Rx from 'rxjs/Rx';
import updateAppointments, {
  doInitRender,
  doNextRender
} from './appointmentChanges';
import vTable from './vTable';

let appointmentsVTable: vTable = null;
let clientId: string = null;

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
        // console.log('observeWsUpdates init', result);
        appointmentsVTable = new vTable(result.appointments);
        doInitRender(appointmentsVTable, (payload: string) => {
          subject.next(payload);
        });
      } else if (result.type === 'add') {
        appointmentsVTable.add(result.appointment);
        doNextRender(appointmentsVTable);
      } else if (result.type === 'lock') {
        console.log('observeWsUpdates lock', result);
        // TODO implement
        if (result.byClientId !== clientId) {
          alert(
            `Locking ${result.forAptId} for editing by ${result.byClientId}`
          );
        }
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
  clientId = id;
}
