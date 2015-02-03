import Ember from 'ember';

export default Ember.ArrayController.extend({
  items: Ember.computed.alias('model'),

  actions: {
    toggleEditMode: function() {
      Ember.$('.list-container')[0].classList.toggle('is-checking');
      return;
    }

  }

});
