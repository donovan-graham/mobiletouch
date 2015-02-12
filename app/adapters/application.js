import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

var ApplicationAdapter;

if (ENV.useFixtureData) {

   ApplicationAdapter = DS.FixtureAdapter.extend({});

} else {

  var fmt = Ember.String.fmt;
  var Promise = Ember.RSVP.Promise;

  ApplicationAdapter = DS.FirebaseAdapter.extend({
  
    firebase: new window.Firebase('https://' + ENV.firebase + '.firebaseio.com'),

    pathForType: function(type) {
      return Ember.String.pluralize(Ember.String.underscore(Ember.String.decamelize(type)));
    },

    /* Override back to .on method instead of .once, because .once fetches data twice */
    findAll: function(store, type) {
      var adapter = this;
      var ref = this._getRef(type);

      return new Promise(function(resolve, reject) {
        // Listen for child events on the type
   
        /* ref.once('value', function(snapshot) { */
        ref.on('value', function(snapshot) {
          if (!adapter._findAllHasEventsForType(type)) {
            adapter._findAllAddEventListeners(store, type, ref);
          }
          var results = [];
          snapshot.forEach(function(childSnapshot) {
            var payload = adapter._assignIdToPayload(childSnapshot);
            adapter._updateRecordCacheForType(type, payload);
            results.push(payload);
          });

          resolve(results);
        }, function(error) {
          reject(error);
        });
      }, fmt('DS: FirebaseAdapter#findAll %@ to %@', [type, ref.toString()]));
    },

  });

}

export default ApplicationAdapter;