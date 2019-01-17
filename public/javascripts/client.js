function startWebsocket() {
  var conn = new WebSocket('ws://127.0.0.1:3001');
  conn.onmessage = e => {
    console.log(e.data);
  }
}