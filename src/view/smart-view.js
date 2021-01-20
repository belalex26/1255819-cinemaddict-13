import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
  constructor() {
    super();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    this._restoreHandler();
  }

  _restoreHandler() {
    throw new Error(`Can't run abstract method: _restoreHandler`);
  }

  updateData(updatedData, withoutReloadingHandler) {
    this._filmCard = Object.assign({}, this._filmCard, updatedData);
    if (withoutReloadingHandler) {
      return;
    }
    this.updateElement();
  }
}
