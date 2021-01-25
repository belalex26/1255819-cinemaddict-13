/* export default class Observer {
  constructor() {
    this._observers = {};
  }

  addObserver(method, callback) {
    this._observers[method].push(callback);
  }

  removeObserver(callback) {
    this._observers.filter((observer) => observer !== callback);
  }

  notify(method, payload) {
    this._observers[method].forEach((observer) => observer(payload));
  }
}
*/

export default class Observer {
  constructor() {
    this._observers = {};
  }

  addObserver(method, cb) {
    this._observers[method].push(cb);
  }

  removeObserver(method, cb) {
    this._observers[method].filter((observer) => observer !== cb);
  }

  notify(method, payload) {
    this._observers[method].forEach((observer) => observer(payload));
  }
}
