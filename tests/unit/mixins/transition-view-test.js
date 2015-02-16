import Ember from 'ember';
import TransitionViewMixin from 'mobiletouch/mixins/transition-view';

module('TransitionViewMixin');

// Replace this with your real tests.
test('it works', function() {
  var TransitionViewObject = Ember.Object.extend(TransitionViewMixin);
  var subject = TransitionViewObject.create();
  ok(subject);
});
