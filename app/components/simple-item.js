import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  content: null,

  // doubleUp: function() {
  //   return this.get('content') + " " + this.get('content');
  // }.property('content'),

  isEven: function() {
    return (parseInt(this.get('content')) % 2) === 0;
  }.property('content'),

});
