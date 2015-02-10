import Ember from 'ember';

export default Ember.Component.extend({
  tap: function() {
    this.sendAction('action');
  }
});