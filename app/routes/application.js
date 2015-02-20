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
    },
   
    toggleHeaderMenu: function() {
      document.getElementById('app-header-menu').classList.toggle('active');
    },

    toggleSubHeaderMenu: function() {
      document.getElementById('app-sub-header-menu').classList.toggle('active');
    },

    addItem: function() {
      this.controller.set('appSubMenuItems', this.controller.get('appSubMenuItems').addObject(Math.random()));
    },

    removeItem: function() {
      this.controller.set('appSubMenuItems', this.controller.get('appSubMenuItems').slice(0,-1));
    },

    navToRoute: function(routeName) {      
      this.transitionTo(routeName);    
    },

    gotoDefaultList: function() {
      this.transitionTo('list');
    },

    gotoDragList: function() {
      this.transitionTo('drag-list');
    },

    goto500List: function() {
      this.transitionTo('five-hundred');     
    },

    gotoFireQuery: function() {
      this.transitionTo('fire-query');     
    },

    gotoSliderItems: function() {
      this.transitionTo('slider-items');     
    }


  }

});