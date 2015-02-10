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
      this.controller.set('appSubMenuItems', this.get('appSubMenuItems').addObject(Math.random()));
    },

    removeItem: function() {
      this.controller.set('appSubMenuItems', this.get('appSubMenuItems').slice(0,-1));
    },

    navToRoute: function(routeName) {
      if (routeName) {
        var delay = 100;    // delay for application.currentPath change to propogate
        
        Ember.run.later(this, function() {
          this.controller.set('sideMenuOpen', false);
        }, delay);

        this.transitionTo(routeName);
      } else {
        this.controller.set('sideMenuOpen', false);
      }
    },

    gotoDefaultList: function() {
      this.send('navToRoute', 'list');
    },

    gotoDragList: function() {
      this.send('navToRoute', 'drag-list');
    }


  }

});