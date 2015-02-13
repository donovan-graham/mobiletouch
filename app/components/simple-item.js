import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  content: null,

  // doubleUp: function() {
  //   return this.get('content') + " " + this.get('content');
  // }.property('content'),

  title: function() {
    return this.get('content.fullName') || this.get('content');
  }.property(),

  isEven: function() {
    return (parseInt(this.get('content.id') || this.get('content')) % 2) === 0;
  }.property('content'),

});
