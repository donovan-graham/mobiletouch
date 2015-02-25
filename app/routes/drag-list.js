import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.store.find('person');
  },

  setupController: function(controller, model){
    this._super(controller, model);
    Ember.run.later(function(){
      document.getElementById('app-content').classList.remove('flipOut');
      document.getElementById('app-content').classList.add('flipIn');
    }, 10);

    Ember.run.later(function(){
      document.getElementById('app-content').classList.remove('flipIn');
    }, 600);
  },

  hasAnimatedExit: false,

  actions: {
    willTransition: function(transition) {
      
      if (!this.hasAnimatedExit){

        transition.abort();
        document.getElementById('app-content').classList.add('flipOut');
        this.hasAnimatedExit = true;

        Ember.run.later(function(){
          transition.retry();
        }, 600);

      } else {
         this.hasAnimatedExit = false;
      } 
      
    }

  }

});
