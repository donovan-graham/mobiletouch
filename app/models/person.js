import DS from 'ember-data';
import ENV from '../config/environment';

var Person = DS.Model.extend({
  
  firstName:            DS.attr('string'),
  lastName:             DS.attr('string'),
  email:                DS.attr('string'),
  isAdmin:              DS.attr('boolean', { defaultValue: false }),

  fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')

});

if (ENV.useFixtureData) {
  Person.reopenClass({
    FIXTURES: [
      { id: 1, email: "holly@example.com", firstName: "Holly", lastName: "Day" }, 
      { id: 2, email: "marc@example.com", firstName: "Marc", lastName: "Houston" }, 
      { id: 3, email: "jennifer@example.com", firstName: "Jennifer", lastName: "Hardy" }, 
      { id: 4, email: "george@example.com", firstName: "George", lastName: "Roberts" }, 
      { id: 5, email: "justin@example.com", firstName: "Justin", lastName: "Ross" }, 
      { id: 6, email: "scott@example.com", firstName: "Scott", lastName: "Lane" }, 
      { id: 7, email: "verna@example.com", firstName: "Verna", lastName: "Patton" }, 
      { id: 8, email: "claire@example.com", firstName: "Claire", lastName: "Patterson" }, 
      { id: 9, email: "patricia@example.com", firstName: "Patricia", lastName: "Cox" }, 
      { id: 10, email: "howard@example.com", firstName: "Howard", lastName: "Bell" }, 
      { id: 11, email: "jimmy@example.com", firstName: "Jimmy", lastName: "King" }, 
      { id: 12, email: "james@example.com", firstName: "James", lastName: "Taylor" }, 
      { id: 13, email: "vicky@example.com", firstName: "Vicky", lastName: "Myer" }
    ]
  });
}


export default Person;