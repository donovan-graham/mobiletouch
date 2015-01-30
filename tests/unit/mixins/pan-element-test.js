import Ember from 'ember';
import PanElementMixin from 'mobiletouch/mixins/pan-element';

module('PanElementMixin');

// Replace this with your real tests.
test('it works', function() {
  var PanElementObject = Ember.Object.extend(PanElementMixin);
  var subject = PanElementObject.create();
  ok(subject);
});
