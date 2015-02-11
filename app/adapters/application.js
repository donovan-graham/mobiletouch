import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.FirebaseAdapter.extend({

  firebase: new window.Firebase('https://' + ENV.firebase + '.firebaseio.com'),

  pathForType: function(type) {
    return Ember.String.pluralize(Ember.String.underscore(Ember.String.decamelize(type)));
  },

});