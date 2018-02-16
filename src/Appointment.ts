// TODO significant type or declare
export default class Appointment {
  public aptId: string;
  public date: number; // in milliseconds
  public isAdded: boolean;
  public isLocked: boolean;
  public byClientId: string;
}
