module.exports = class Request {
  constructor(info) {
    this.color = info.color;
    this.id = info.id;
    this.inProcess = false;
    this.isFinished = false;

    this.ms = 'none';
    this.timeout;
  }

  toString() {
    return `S:${this.ms}|inP:${this.inProcess}|isF:${this.isFinished}|T:${(this.timeout / 1000).toFixed(1)}`;
  }

  sendStatus(server, status) {
    server.connections.forEach(conn => {
      conn.sendText(JSON.stringify(this.getBody(status)));
    });
  }

  getBody(status) {
    // status ['waiting', 'toService', 'return']
    return {
      id: this.id,
      status: status,
      color: this.color,
      instance: this.ms,
      timeout: this.timeout,
    };
  }
}
