export default class VTable {
  // TODO typing should be array of appointments
  constructor(appointments: any[]) {
    console.log('vTable constr', appointments);
    // Array with id, columns, event bindings
  }
  // Convenience function for adding
  public add(appointment) {
    console.log('vTable add', appointment);
  }
}
