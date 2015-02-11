import Ember from 'ember';
// import ENV from '../config/environment';

export default Ember.Route.extend({
  
  model: function() {
    return this.store.find('person');

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
