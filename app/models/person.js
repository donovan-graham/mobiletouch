import DS from 'ember-data';
import ENV from 'mobiletouch/config/environment';

var Person = DS.Model.extend({
  
  firstName:            DS.attr('string'),
  lastName:             DS.attr('string'),
  email:                DS.attr('string'),
  isActive:             DS.attr('boolean', { defaultValue: false }),

  fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')

});

if (ENV.useFixtureData) {

  var fixtures = [];
  for (var i=1; i <= 30; i++) {
    fixtures.push({ id: i, email: "test" + i + "@example.com", firstName: "Test", lastName: i });
  }

  Person.reopenClass({
    FIXTURES: fixtures
  });
}


export default Person;