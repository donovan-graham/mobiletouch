import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    openModal: function(template) {
      // Hiding overflow causes performance issues
      // Ember.$('body')[0].style.overflow = "hidden";
      template = template || 'modal';
      return this.render(template, {
        into: 'application',
        outlet: 'modal'
      });
    },

    closeModal: function() {
      // Ember.$('body')[0].removeAttribute('style');
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }

});