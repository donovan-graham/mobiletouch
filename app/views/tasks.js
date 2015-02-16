import Ember from 'ember';
import TransitionView from 'mobiletouch/mixins/transition-view';

export default Ember.View.extend(TransitionView, {
  elementId: 'main-parent',
  classNames: ['parent'],
  childNum: 1,

});
