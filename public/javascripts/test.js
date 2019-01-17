var interval = null; // clearInterval(interval);

function setType(type) {
  let possibleTypes = ['fast', 'normal', 'slow'];
  if (!possibleTypes.includes(type)) return;

  $.post('/type', { type: type }, res => {
    setElementTextById('debug', JSON.parse(res));
  }).fail((xhr, status, err) => {
    console.error(xhr);
  });
}

function sendRequest(button) {
  let body = { id: getCookieToken(), button: button };
  $.post('/', body, res => {
    // add stuff here if needed
  }).fail((xhr, status, err) => {
    console.error(xhr);
  });
}

function checkInterval() {
  if (interval !== null) clearInterval(interval);
}

function clearAll() {
  checkInterval();
  setElementTextById('debug', 'Intervals cleared');
}

function testCase1() {
  // continuous 3x request green
  setElementTextById('debug', 'Test Case 1 started');
  checkInterval();
  interval = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      sendRequest('green');
    }
  }, 3500);
}

function testCase2() {
  // continuous 3x request green & red
  setElementTextById('debug', 'Test Case 2 started');
  checkInterval();
  interval = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      sendRequest('green');
      sendRequest('red');
    }
  }, 3500);
}
