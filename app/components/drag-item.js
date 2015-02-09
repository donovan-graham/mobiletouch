import Ember from 'ember';
import DragAndDrop from '../mixins/drag-and-drop';

export default Ember.Component.extend(DragAndDrop, {
  classNameBindings: [':no-select', ':drag-item', ':list-item', 'isDragging'],


});
