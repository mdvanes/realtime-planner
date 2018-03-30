import { Observable } from 'rxjs/Rx'; // TODO test build size difference between import * as Rx and import {Observable}
import { notificationTitle } from './notification';
import initWsStream from './wsStream';

initWsStream();
