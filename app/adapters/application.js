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
      console.log(">>> findAll");

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



    // Includes findQuery support:
    // https://github.com/webhook/webhook-cms/blob/65ae68bb52407b0a22d8f9d6f93df6173bcefb3e/app/adapters/application.JSON
    // https://github.com/webhook/webhook-cms/blob/master/app/adapters/application.js

    // Usage:
    // https://github.com/webhook/webhook-cms/blob/3123f984ae780a08ef6667041cd3c9db7a4e850d/app/controllers/wh/content/type/index.js#L198
    /*
      var query = {
        limit: this.get('recordLimit') + 1,
        orderBy: this.get('sortProperties.firstObject').replace('itemData.', ''),
        desc: !this.get('sortAscending')
      };

      var lastValue = this.get('content.lastObject').get(this.get('sortProperties.firstObject'));

      if (this.get('sortAscending')) {
        query.startAt = lastValue;
      } else {
        query.endAt = lastValue;
      }

      this.store.find(this.get('itemModelName'), query).then(function (records) {
        controller.set('endReached', records.get('length') - 1 < controller.get('recordLimit'));
        controller.set('isLoading', false);
        controller.get('content').addObjects(records);
      });
    */


    init: function () {
      this._super.apply(this, arguments);
      this._findQueryMapForType = {};
    },

    // basic support for Firebase queries
    // - orderBy
    // - limitToFirst
    // - limitToLast
    // - startAt
    // - endAt
    findQuery: function(store, type, query) {
      
      console.log(">>> findQuery");

      var adapter = this;
      var ref = this._getRef(type);

      console.log("ref:", ref);

      query = query || {};

      if (query.orderBy) {
        ref = ref.orderByChild(query.orderBy);
      }

      if (query.limit) {
        if (query.desc) {
          ref = ref.limitToLast(query.limit);
        } else {
          ref = ref.limitToFirst(query.limit);
        }
      }

      if (query.startAt) {
        ref =  ref.startAt(query.startAt);
      }

      if (query.endAt) {
        ref = ref.endAt(query.endAt);
      }


      return new Promise(function(resolve, reject) {
      
        /* ref.once('value', function(snapshot) { */
        ref.on('value', function(snapshot) {
          if (!adapter._findQueryHasEventsForType(type, query)) {
            adapter._findQueryAddEventListeners(store, type, ref, query);
          }
          var results = [];
          snapshot.forEach(function(childSnapshot) {
            var payload = adapter._assignIdToPayload(childSnapshot);
            adapter._updateRecordCacheForType(type, payload);
            results.push(payload);
          });

          if (query.desc) {
            results.reverse();
          }

          resolve(results);
        }, function(error) {
          reject(error);
        });
      }, fmt('DS: FirebaseAdapter#findQuery %@, %@ to %@', [type, JSON.stringify(query), ref.toString()]));
    },


    /**
      Keep track of what types `.findAll()` has been called for
      so duplicate listeners aren't added
    */
    _findQueryMapForType: undefined,

    /**
      Determine if the current type is already listening for children events
    */
    _findQueryHasEventsForType: function(type, query) {
      console.log("_findQueryHasEventsForType:", type + JSON.stringify(query));
      return !Ember.isNone(this._findQueryMapForType[type + JSON.stringify(query)]);
    },

    /**
      After `.findAll()` is called on a type, continue to listen for
      `child_added`, `child_removed`, and `child_changed`
    */
    _findQueryAddEventListeners: function(store, type, ref, query) {
      this._findQueryMapForType[type + JSON.stringify(query)] = true;

      var adapter = this;
      var serializer = store.serializerFor(type);

      ref.on('child_added', function(snapshot) {
        if (!store.hasRecordForId(type, adapter._getKey(snapshot))) {
          adapter._handleChildValue(store, type, serializer, snapshot);
        }
      });
    },




  });

}

export default ApplicationAdapter;