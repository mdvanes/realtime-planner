import Appointment from './Appointment';

function sort(apt: Appointment, otherApt: Appointment) {
  return apt.date - otherApt.date;
}

export default class VTable {
  private appointments: Appointment[];

  constructor(appointments: Appointment[]) {
    // Array with id, columns, event bindings
    this.appointments = appointments.sort(sort);
  }

  // Convenience function for adding
  public add(newApt: Appointment) {
    this.appointments.map((apt: Appointment) => {
      delete apt.isAdded;
      return apt;
    });
    newApt.isAdded = true;
    this.appointments.push(newApt);
    this.appointments.sort(sort); // TODO replace appointments:Appointment[] with Set
  }

  public lock(aptId: string, byClientId: string) {
    // TODO instead of check in map, do filter first. Would require new rendering solution.
    this.appointments = this.appointments.map((apt: Appointment) => {
      apt.isLocked = apt.aptId.toString() === aptId;
      apt.byClientId = byClientId;
      return apt;
    });
  }

  public getAppointments(): Appointment[] {
    return this.appointments;
  }
}
