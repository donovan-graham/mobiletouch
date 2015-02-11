import Ember from 'ember';

export default Ember.Controller.extend({
  items: Ember.computed.alias('model')  
});
