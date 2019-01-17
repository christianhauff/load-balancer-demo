module.exports = class Microservice {
  constructor(info) {
    this.service = info.service;
    this.instance = info.instance;
    this.busy = false;
  }

  run(req, server, type) {
    this.busy = true;
    let timeout = this.getRandomTime(type);
    req.ms = this.instance;
    req.timeout = timeout;
    setTimeout(() => {
      this.busy = false;
      req.isFinished = true;
      req.sendStatus(server, 'return');
    }, timeout);
  }

  isBusy() {
    return this.busy;
  }

  getRandomTime(type) {
    let times = this.getServerTypeTimeout(type);
    return Math.floor(Math.random() * (times.max - times.min + 1)) + times.min;
  }

  getServerTypeTimeout(type = 'normal') {
    switch (type) {
      case 'fast':
        return { min: 500, max: 1000 };
      case 'normal':
      default:
        return { min: 3000, max: 4000 };
      case 'slow':
        return { min: 7000, max: 10000 };
    }
  }
}