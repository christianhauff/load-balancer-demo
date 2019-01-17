//const lastExecution = new Date(new Date().setSeconds(new Date().getSeconds() - (intervalSeconds + 1)));

function btnPressed(button = 'ERROR') {
  //if (!checkTimeout(button)) return;

  let body = { id: getCookieToken(), button: button };
  $.post('/', body, res => {
    setElementTextById('output', JSON.parse(res));
  }).done(() => {
    // add stuff here if needed
  }).fail((xhr, status, err) => {
    console.error(xhr);
  });
}

function setElementTextById(element, text) {
  var debugText = document.getElementById(element);
  debugText.innerHTML = text;
}

/*
function checkTimeout(button) {
  if (getCookieToken() === 'debug') return setOutputText(button);

  let intervalTime = new Date();
  intervalTime.setSeconds(intervalTime.getSeconds() - intervalSeconds);

  if (intervalTime > lastExecution) {
    lastExecution.setTime(new Date());
    return setOutputText(button);
  } else {
    let timeDiff = (new Date() - lastExecution) / 1000;
    let ttw = (intervalSeconds - timeDiff).toFixed(1);
    return setOutputText(button, false, ttw);
  }
}

function setOutputText(button, bool = true, ttw = 0) {
  if (bool) {
    setElementTextById('output', `Request successful for ${button}`);
  } else {
    setElementTextById('output', `Please wait another ${ttw} seconds till your next request`);
  }
  return bool;
}

function checkDebugStatus() {
  return getCookieToken() === 'debug';
}

function setDebugText(res) {
  try {
    setElementTextById('debug', JSON.parse(res));
  } catch (ex) {
    setElementTextById('debug', res);
  }
}*/
