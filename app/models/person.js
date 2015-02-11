import DS from 'ember-data';

export default DS.Model.extend({
  
  firstName:            DS.attr('string'),
  lastName:             DS.attr('string'),
  email:                DS.attr('string'),
  isAdmin:              DS.attr('boolean', { defaultValue: false }),

  fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')

});
