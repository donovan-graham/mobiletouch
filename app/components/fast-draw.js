import Ember from 'ember';

export default Ember.Component.extend({

  attributeBindings: ['style'],
  bgcolor: 'pink',

  style: function() {
    return 'margin:20px; display: block; border: 2px solid red; background-color: ' + this.get('bgcolor') + '; color: white; text-align: center;';
  }.property('bgcolor'),


});
