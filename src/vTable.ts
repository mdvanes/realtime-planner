export default class VTable {
  public appointments: any[]; // TODO private

  // TODO typing should be array of appointments
  constructor(appointments: any[]) {
    // Array with id, columns, event bindings
    this.appointments = appointments;
  }
  // Convenience function for adding
  public add(appointment: any) {
    this.appointments.push(appointment);
  }

  public lock(aptId: string) {
    this.appointments = this.appointments.map((apt: any) => {
      apt.isLocked = apt.aptId.toString() === aptId;
      return apt;
    });
  }
}
