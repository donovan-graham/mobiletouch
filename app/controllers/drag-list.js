import Ember from 'ember';

export default Ember.ArrayController.extend({
  items: Ember.computed.alias('model')

});
