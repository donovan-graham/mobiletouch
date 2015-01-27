import Ember from 'ember';

export default Ember.Component.extend({

  click: function() {
    console.log("SDFSdf");
    this.sendAction('action', '123');
  }
});