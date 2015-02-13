import Ember from 'ember';
// import ENV from '../config/environment';

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
    var ref = new Firebase('https://' + ENV.firebase + '.firebaseio.com/people');
    ref.on("value", function(snapshot) {
      console.log(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    */
  }

});
