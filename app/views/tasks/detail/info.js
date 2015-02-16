import Ember from 'ember';
import TransitionView from 'mobiletouch/mixins/transition-view';

export default Ember.View.extend(TransitionView, {
  classNames: ['child'],
  childNum: 3,
});
