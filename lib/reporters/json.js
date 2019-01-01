'use strict';

const {log} = console;

class Json {

  constructor() {
    this.ok = true;
  }

  report(result) {
    if (!result.ok)
      this.ok = false;
    log(JSON.stringify(result));
  }

  summary() {
    return this.ok ? 0 : 1;
  }
}

module.exports = Json;
