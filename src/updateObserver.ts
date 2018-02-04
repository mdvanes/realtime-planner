import * as Rx from 'rxjs/Rx';
import updateAppointments from './appointmentChanges';

export default function observeWsUpdates() {
  const subject = Rx.Observable.webSocket('ws://localhost:9001');
  subject.retry().subscribe(
    msg => {
      // const x = JSON.stringify(JSON.parse(msg));
      console.log('message received: ' + msg, msg);
      const result: any = msg;

      if (result.id) {
        // Receiving an id
        setClientId(result.id);
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
