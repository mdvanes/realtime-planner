function randomizeFirstName() {
  const names = [
    'Peter',
    'Carol',
    'Bruce',
    'Donald',
    'Tony',
    'Luke',
    'Natasha',
    'Matt',
    'Steve',
    'James',
    'Warren',
    'Steven',
    'Hank',
    'Bobby',
    'Clint',
    'Jennifer',
    'Jessica'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function randomizeLastName() {
  const names = [
    'Parker',
    'Danvers',
    'Banner',
    'Blake',
    'Stark',
    'Cage',
    'Romanova',
    'Murdock',
    'Rogers',
    'Howlett',
    'Worthington',
    'Strange',
    'Pym',
    'Drake',
    'Barton',
    'Walters',
    'Jones'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function maybeGetPhonenumber() {
  if (Math.random() > 0.5) {
    return `06${Math.random()
      .toString()
      .slice(2, 10)}`;
  }
  return null;
}

function guessEmail(firstName, lastName) {
  return (
    firstName.slice(0, 1) +
    '.' +
    lastName +
    '@example.com'
  ).toLowerCase();
}

/*
random date

const date = new Date();
date.setHours(0);
// Random day 3 to 300 days in the future
const futureOffset = Math.floor(Math.random() * 297) + 3;
date.setDate( date.getDate() + futureOffset);
const newMonth = (date.getMonth() + 1).toString().padStart(2, '0');
const newDay = date.getDate().toString().padStart(2, '0');
this.dispatch(ING.ACTIONS.APPOINTMENT.DATE_CHANGED(`${date.getFullYear()}-${newMonth}-${newDay}`));
const times = ['1000', '1100', '1300', '1400'];
const randomTime = times[Math.floor(Math.random() * times.length)];
 */

function randomizeDate() {
  const oneWeekMs = 1000 * 60 * 60 * 24 * 7;
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0);
  const maxDayOffset = 200;
  const nrOfDays = Math.floor(Math.random() * maxDayOffset);
  const dayOffsetMs = 1000 * 60 * 60 * 24 * nrOfDays;
  const timeslots = [9, 10, 13, 14];
  const timeslot = timeslots[Math.floor(Math.random() * timeslots.length)];
  const timeOffsetMs = 1000 * 60 * 60 * timeslot;
  console.log('baseDate', baseDate, timeslot);
  const result = baseDate.getTime() + oneWeekMs + dayOffsetMs + timeOffsetMs;
  return result;
  // return new Date(result);
  // return (new Date()).getTime();
}

module.exports = class Appointment {
  constructor(firstName, lastName, phone, email, date) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
    this.date = date;
    this.aptId = new Date().getTime();
  }

  static createRandom() {
    console.log('a random appointment');
    const firstName = randomizeFirstName();
    const lastName = randomizeLastName();
    return new Appointment(
      firstName,
      lastName,
      maybeGetPhonenumber(),
      guessEmail(firstName, lastName),
      randomizeDate()
    );
  }
};
