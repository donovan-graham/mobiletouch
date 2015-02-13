import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.store.find('person');
  },
  
  // setupController: function(controller, model) {

  //   this._super(controller, model);

  //   this.controller.setProperties({
  //     iPage: 0
  //   });
  // }



});
