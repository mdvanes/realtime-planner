export default class VTable {
  public appointments: any[];

  // TODO typing should be array of appointments
  constructor(appointments: any[]) {
    console.log('vTable constr', appointments);
    // Array with id, columns, event bindings
    this.appointments = appointments;
  }
  // Convenience function for adding
  public add(appointment) {
    console.log('vTable add', appointment);
    this.appointments.push(appointment);
  }
}
