function randomString(length) {
  var characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let str = "";
  while (str.length < length) {
    var randomCharacterIndex = Math.floor(Math.random() * characters.length);
    var randomCharacter = characters.charAt(randomCharacterIndex);
    str += randomCharacter;
  }
  return str;
}

function calculateDimensions(
  currentLocation,
  lastLocation,
  defaultThickness = 8
) {
  if (!currentLocation || !lastLocation) return;

  let leftClick, rightClick, topClick, bottomClick;

  if (currentLocation.x > lastLocation.x) {
    rightClick = currentLocation;
    leftClick = lastLocation;
  } else {
    leftClick = currentLocation;
    rightClick = lastLocation;
  }

  if (currentLocation.y > lastLocation.y) {
    bottomClick = currentLocation;
    topClick = lastLocation;
  } else {
    topClick = currentLocation;
    bottomClick = lastLocation;
  }

  const w = rightClick.x - leftClick.x;
  const h = bottomClick.y - topClick.y;

  if (w > h) {
    return {
      x: leftClick.x,
      y: leftClick.y,
      w,
      h: defaultThickness,
    };
  } else {
    return {
      x: topClick.x,
      y: topClick.y,
      w: defaultThickness,
      h,
    };
  }
}

function makeAjaxCall(method, url, body, callback) {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      // XMLHttpRequest.DONE == 4
      var responseBody;
      try {
        responseBody = JSON.parse(xmlhttp.response);
      } catch (e) {}
      var response = {
        status: xmlhttp.status,
        statusText: xmlhttp.statusText,
        data: responseBody,
      };
      callback(response);
    }
  };

  xmlhttp.open(method, url, true);

  if (!body) {
    xmlhttp.send();
  } else {
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(body));
  }
}
