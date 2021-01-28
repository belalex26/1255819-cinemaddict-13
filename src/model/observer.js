export default class Observer {
  constructor() {
    this._observers = {};
  }

  addObserver(method, callback) {
    this._observers[method].push(callback);
  }

  removeObserver(method, callback) {
    this._observers[method].filter((observer) => observer !== callback);
  }

  notify(method, payload) {
    this._observers[method].forEach((observer) => observer(payload));
  }
}
