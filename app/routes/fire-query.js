import Ember from 'ember';
import ENV from '../config/environment';


export default Ember.Route.extend({

  actions: {

    dinoHeight: function() {
     console.log(">>> dinoHeights");
 
      var ref = new Firebase("https://dinosaur-facts.firebaseio.com/");
      ref.orderByChild("height").on("child_added", function(snapshot) {
        console.log(snapshot.key() + " was " + snapshot.val().height + " meters tall");
      });

      return;
    },
    

    dinoHeightStartAt3: function() {

      console.log(">>> dinoHeightStartAt3");
      var ref = new Firebase("https://dinosaur-facts.firebaseio.com/");
      ref.orderByChild("height").startAt(3).on("child_added", function(snapshot) {
        console.log(snapshot.key())
      });
    },


    authenticate: function() {

      /* context sensitive */
      var store = this.store;
      var type = store.modelFor('person');
      var adapter = store.adapterFor(type); 
      var serializer = store.serializerFor(type);

      var ref = new Firebase('https://' + ENV.firebase + '.firebaseio.com');
      
      ref.authWithPassword({
        email:    'marc@example.com',
        password: 'password'
      }, function(error, authData) {
        if (error) {
          console.log("Error authenticating user:", error);
        } else {
          var email = authData.password.email;

          console.log("User authenticated:", authData)
          console.log("User email:", email);


          // var newRef = new Firebase('https://fiery-fire-1076.firebaseio.com/people')

          ref.child('people')
            .orderByChild("email")
            .startAt(email)
            .endAt(email)
            .limitToFirst(1)
            .once('value', function(snapshot) {

              // ref.on("child_changed", function(snapshot) {
              //   var changedPost = snapshot.val();
              //   console.log("The updated post title is " + changedPost.title);
              // });

              var person;

              snapshot.forEach(function(childSnapshot) {
                var payload = adapter._assignIdToPayload(childSnapshot);
                person = payload;

                // add snapshot to store
                if (!store.hasRecordForId(type, adapter._getKey(childSnapshot))) {
                  adapter._handleChildValue(store, type, serializer, childSnapshot);
                }
              });
            
              console.log('Person object from email:', person);
            }, function (errorObject) {
              console.log("Failed to find person object: " + errorObject.code);
            });
        }
      });

    }

  }

});