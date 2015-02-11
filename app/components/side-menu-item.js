import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['isActive:active'],
  tagName: 'li',

  action: null,
  pattern: null,
  routeName: null,

  regex: function() {
    return (this.get('pattern')) ? new RegExp(this.get('pattern')) : null;
  }.property('pattern'),

  isActive: function() {
    if (this.get('regex') && this.get('routeName')) {
      return this.get('regex').test(this.get('routeName'));  
    }
  }.property('routeName', 'regex'),

  tap: function() {
    this.sendAction();
  }

});
