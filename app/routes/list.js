import Ember from 'ember';
// import ENV from 'mobiletouch/config/environment';

export default Ember.Route.extend({
  
  model: function() {
    return this.store.find('person');


    /*
    var query = {
        orderBy: 'is_active',
        startAt: false       
      };

    return this.store.find('person', query);
    */

    /*
    var ref = new window.Firebase('https://' + ENV.firebase + '.firebaseio.com/people');
    ref.on("value", function(snapshot) {
      console.log(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    */
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
