import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  content: null,

  // doubleUp: function() {
  //   return this.get('content') + " " + this.get('content');
  // }.property('content'),

  isOdd: function() {
    return (this.get('content') % 2) === 0;
  }.property('content'),

});
