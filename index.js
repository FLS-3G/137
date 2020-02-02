var points = [];
var load = 0;
var scroll = 0;
var addPointPossible = undefined;
var lineSquaringPossible = undefined;
function loadEnable() {
  load = 1;
}
window.addEventListener("scroll", function() {
  scroll = window.scrollY;
});

function clearCanvas(canvasContext, img) {
  canvasContext.clearRect(0, 0, 800, 400);
  canvasContext.globalAlpha = 0.8;
  canvasContext.drawImage(img, 0, 0, 800, 400);
  canvasContext.globalAlpha = 1;
}

function addActionWhileMoving(point, redoList) {
  points[points.length - 2].actionsYesOrNo =
    points[points.length - 2].actionsYesOrNo + 2;
  var lastPoint = points[points.length - 2];
  lastPoint.type = "actionWhilleMoving";
  redraw(ctx, img, points);
  update(points, redoList);
}

function onChange(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var rtf = "";
    var rtf = e.target.result;
    var lastLine = getLastLineBreak(rtf, "^");
    var endLine = getLastLineBreak(rtf, "]");
    endLine = endLine - lastLine - 1;
    rtf = rtf.substr(lastLine, endLine);
    var x = [];
    var y = [];
    var d = [];
    var t = [];
    var a = [];
    var s = [];
    var w = 0;
    var l = 0;
    var f = 0;
    var b = 0;
    var p = 0;
    var c = 0;
    var m = 0;
    var first = 0;
    var long = 0;
    var realX = [];
    var realY = [];
    var realD = [];
    var realT = [];
    var realA = [];
    var realS = [];
    for (var i = 0; i < endLine; i++) {
      if (rtf.charAt(i) == "x") {
        x.push(i);
      }
      if (rtf.charAt(i) == "y") {
        y.push(i);
      }
      if (rtf.charAt(i) == "d") {
        d.push(i);
      }
      if (rtf.charAt(i) == "t") {
        t.push(i);
      }
      if (rtf.charAt(i) == "a") {
        a.push(i);
      }
      if (rtf.charAt(i) == "s") {
        s.push(i);
      }
      if (rtf.charAt(i) == "w") {
        w=i;
      }
      if (rtf.charAt(i) == "l") {
        l=i;
      }
      if (rtf.charAt(i) == "f") {
        f=i;
      }
      if (rtf.charAt(i) == "b") {
        b=i;
      }
      if (rtf.charAt(i) == "p") {
        p=i;
      }
      if (rtf.charAt(i) == "c") {
        c=i;
      }
      if (rtf.charAt(i) == "m") {
        m=i;
      }
    }
    for (i = 0; i < y.length; i++) {
      long = y[i] - x[i] - 1;
      first = x[i] + 1;
      realX.push(rtf.substr(first, long));
      long = d[i] - y[i] - 1;
      first = y[i] + 1;
      realY.push(rtf.substr(first, long));
      long = t[i] - d[i] - 1;
      first = d[i] + 1;
      realD.push(rtf.substr(first, long));
      long = a[i] - t[i] - 1;
      first = t[i] + 1;
      realT.push(rtf.substr(first, long));
      long = s[i] - a[i] - 1;
      first = a[i] + 1;
      realA.push(rtf.substr(first, long));
      long = x[i + 1] - s[i] - 1;
      first = s[i] + 1;
      realS.push(rtf.substr(first, long));
    }
    first=x[x.length - 1] + 1;
    long=w - x[x.length - 1] - 1 ;
    var wheelDiameter=rtf.substr(first, long);
    first=w + 1;
    long=l- w - 1 ;
    var axleLength=rtf.substr(first, long);
    first=l + 1;
    long=f- l - 1 ;
    var DTF=rtf.substr(first, long);
    first=f + 1;
    long=b- f - 1 ;
    var DTB=rtf.substr(first, long);
    first=b + 1;
    long=p- b - 1 ;
    var DTS=rtf.substr(first, long);
    first=p + 1;
    long=c- p - 1 ;
    var DTCS=rtf.substr(first, long);
    first=c + 1;
    long=m- c - 1 ;
    var motors=rtf.substr(first, long);
    for (i = 0; i < realD.length; i++) {
      if (realD[i] == 0) {
        realD[i] = undefined;
      }
      if (realD[i] == 2) {
        realD[i] = 2;
      }
      if (realD[i] == 1) {
        realD[i] = 1;
      }
      addCoord(undefined, realX[i], realY[i], realD[i], true);
      points[i].speedOfLine = realS[i];
      points[i].speedOfTurn = realT[i];
      if (realA[i] == 1 || realA[i] == 3) {
        addAction(points, redoList);
      }
      if (i > 0 && (realA[i - 1] == 2 || realA[i - 1] == 3)) {
        addActionWhileMoving(points, redoList);
      }
    }
    document.getElementById("axleLength").setAttribute("value", axleLength);
    document.getElementById("wheelSize").setAttribute("value", wheelDiameter);
    document.getElementById("textboxA").setAttribute("value", DTF);
    document.getElementById("textboxB").setAttribute("value", DTB);
    document.getElementById("textboxD").setAttribute("value", DTS);
    document.getElementById("textboxC").setAttribute("value", DTCS);
    if(motors == "1"){
      document.getElementById("backwardsMotors").setAttribute("checked",true);
    }
    load = 0;
  };
  reader.readAsText(file);
}
function getLastLineBreak(content, text) {
  var reversed = content
    .split("")
    .reverse()
    .join("");
  var index = content.length - reversed.indexOf(text);

  return index;
}

var facing = "up";
var axleLength = document.getElementById("axleLength").value;
var backwardsMotors = document.getElementById("backwardsMotors").value;
var textBox = "";
var redoList = [];
var redoActionList = [];
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var i = 1;
var output = "";
var img = new Image();

img.src = "https://raw.githubusercontent.com/FLS-3G/137/master/Mat2020.jpg";

window.onload = function() {
  clearCanvas(ctx, img);
};

function addAction(points, redoList) {
  var orderedListSelect = document.querySelector("ol");
  var lastLiSelect =
    orderedListSelect.childNodes[orderedListSelect.childElementCount - 1];
  var UlSelect = lastLiSelect.querySelector("ul");
  var textInLiInUl = document.createTextNode("[Action]");
  var liInUl = document.createElement("li");
  liInUl.setAttribute("class", "liInUl");
  liInUl.appendChild(textInLiInUl);
  UlSelect.appendChild(liInUl);
  points[points.length - 1].actionsYesOrNo = 1;
  var lastPoint = points[points.length - 1];
  lastPoint.type = "action";
  redraw(ctx, img, points);

  update(points, redoList);
}

function addSpeedToList(points) {
    const listOfPoints = document.querySelector("ol").children;
    for (i = 0; i < points.length; i++) {
      if (i === 0) {
        var currentSpeed = "---";
      }
      else{
      var currentSpeed = points[i-1].speedOfLine;}
      const text = listOfPoints[i].firstChild.innerText;
      if (text.includes(") ")) {
        newText = text.split(") ");
        newText[1] = currentSpeed;
        listOfPoints[i].firstChild.innerText = newText.join(") ");
      } else {
        listOfPoints[i].firstChild.innerText = `${text} ${currentSpeed}`;
      }
    }  
}

function addTurningSpeedToList(points) {
  const listOfPoints = document.querySelector("ol").children;
  for (i = 0; i < points.length; i++) {
      var currentTurningSpeed = points[i].speedOfTurn;
    if (i === 0){
      var currentTurningSpeed = "---";
    }
    const text = listOfPoints[i].firstChild.innerText;
    listOfPoints[i].firstChild.innerText = `${text} ${currentTurningSpeed}`;
      
  }  
}


function addLiElement(listId, x, y) {
  var speed = document.getElementById("speed").value;
  var getOrderedList = document.getElementById(listId);
  var newLi = document.createElement("li");
  var newUl = document.createElement("ul");
  newUl.setAttribute("class", "ulNew");
  var textInLi = document.createTextNode(`(${x},${y})`);
  var coords = document.createElement("p");
  coords.appendChild(textInLi);
  newLi.appendChild(coords);
  newLi.appendChild(newUl);
  getOrderedList.appendChild(newLi);
}

function drawCircle(canvasContext, point, color) {
  canvasContext.beginPath();
  canvasContext.fillStyle = color;
  canvasContext.strokeStyle = "black";
  canvasContext.lineWidth = 2;
  canvasContext.arc(
    point.coordinates[0],
    point.coordinates[1],
    5,
    0,
    2 * Math.PI
  );
  canvasContext.fill();
  canvasContext.stroke();
}

function drawPoints(canvasContext, points) {
  var distanceToFront = Number(document.getElementById("textboxA").value);
  var distanceToBack = Number(document.getElementById("textboxB").value);
  var distanceToSide = Number(document.getElementById("textboxD").value);
  var sensorDistance = Number(document.getElementById("textboxC").value);

  if (points.length === 0) {
  } else {
    for (var j = 0; j < points.length; j++) {
      if (j > 0) {
        var direction = points[j].direction;

        if (direction === "alignment") {
          var blackLines = [
            {
              number: 1,
              function: [1000000, -63999947],
              coordinates: [
                [64, 53],
                [64, 73]
              ]
            },
            {
              number: 2,
              function: [0, 73],
              coordinates: [
                [64, 73],
                [82, 73]
              ]
            },
            {
              number: 3,
              function: [1000000, -81999927],
              coordinates: [
                [82, 73],
                [82, 93]
              ]
            },
            {
              number: 4,
              function: [-1.0385, 185.3462],
              coordinates: [
                [87, 95],
                [113, 68]
              ]
            },
            {
              number: 5,
              function: [1000000, -112999932],
              coordinates: [
                [113, 59],
                [113, 68]
              ]
            },
            {
              number: 6,
              function: [1.0667, -61.5333],
              coordinates: [
                [98, 43],
                [113, 59]
              ]
            },
            {
              number: 7,
              function: [0, 43],
              coordinates: [
                [80, 43],
                [98, 43]
              ]
            },
            {
              number: 8,
              function: [1.0833, -43.6667],
              coordinates: [
                [68, 30],
                [80, 43]
              ]
            },
            {
              number: 9,
              function: [0, 22],
              coordinates: [
                [92, 22],
                [152, 22]
              ]
            },
            {
              number: 10,
              function: [0, 19],
              coordinates: [
                [153, 19],
                [168, 19]
              ]
            },
            {
              number: 11,
              function: [0, 22],
              coordinates: [
                [169, 22],
                [200, 22]
              ]
            },
            {
              number: 12,
              function: [-1.8333, 337.6667],
              coordinates: [
                [146, 70],
                [170, 26]
              ]
            },
            {
              number: 13,
              function: [0.6176, -58.9118],
              coordinates: [
                [165, 43],
                [199, 64]
              ]
            },
            {
              number: 14,
              function: [1000000, -168999911],
              coordinates: [
                [169, 89],
                [169, 114]
              ]
            }
          ];

          var sensorDistance = Number(
            document.getElementById("textboxC").value
          );

          var robotCoord1 = points[j].coordinates;
          var robotCoord2 = points[j - 1].coordinates;

          if (
            Math.round(robotCoord1[0] / 3.386) ===
              Math.round(robotCoord2[0] / 3.386) &&
            Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) >
              Math.round((robotCoord2[1] / 3.386) * -1 + 114.29)
          ) {
            var robotSlope = [
              1000000,
              -1000000 * Math.round(robotCoord1[0] / 3.386) +
                Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
            ];
          } else if (
            Math.round(robotCoord1[0] / 3.386) ===
              Math.round(robotCoord2[0] / 3.386) &&
            Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) <
              Math.round((robotCoord2[1] / 3.386) * -1 + 114.29)
          ) {
            var robotSlope = [
              -1000000,
              1000000 * Math.round(robotCoord1[0] / 3.386) +
                Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
            ];
          } else {
            var robotSlope = calculateSlope(
              Math.round(robotCoord1[0] / 3.386),
              Math.round(robotCoord2[0] / 3.386),
              Math.round((robotCoord1[1] / 3.386) * -1 + 114.29),
              Math.round((robotCoord2[1] / 3.386) * -1 + 114.29)
            );
          }

          var blackLineIntersections = [];
          var validIntersections = [];
          for (i = 0; i < 14; i++) {
            blackLineIntersections.push(
              calculateIntersection(robotSlope, blackLines[i].function)
            );
          }
          for (i = 0; i < 14; i++) {
            if (blackLines[i].function[0] === 1000000) {
              if (
                blackLineIntersections[i][1] >
                  blackLines[i].coordinates[0][1] &&
                blackLineIntersections[i][1] < blackLines[i].coordinates[1][1]
              ) {
                validIntersections.push(blackLines[i]);
              }
            } else {
              if (
                blackLineIntersections[i][0] >
                  blackLines[i].coordinates[0][0] &&
                blackLineIntersections[i][0] < blackLines[i].coordinates[1][0]
              ) {
                validIntersections.push(blackLines[i]);
              }
            }
          }

          var validIntersectionCoordinates = [];
          for (i = 0; i < validIntersections.length; i++) {
            validIntersectionCoordinates.push(
              calculateIntersection(robotSlope, validIntersections[i].function)
            );
          }

          var directionalIntersections = [];
          for (i = 0; i < validIntersections.length; i++) {
            if (points[points.length - 1].direction === "backwards") {
              if (
                Math.round(robotCoord1[0] / 3.386) ===
                Math.round(robotCoord2[0] / 3.386)
              ) {
                if (
                  Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) >=
                    Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
                  validIntersectionCoordinates[i][1] >=
                    Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
                ) {
                  directionalIntersections.push(validIntersections[i]);
                } else if (
                  Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) <=
                    Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
                  validIntersectionCoordinates[i][1] <=
                    Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
                ) {
                  directionalIntersections.push(validIntersections[i]);
                }
              } else {
                if (
                  Math.round(robotCoord1[0] / 3.386) >=
                    Math.round(robotCoord2[0] / 3.386) &&
                  validIntersectionCoordinates[i][0] >=
                    Math.round(robotCoord1[0] / 3.386)
                ) {
                  directionalIntersections.push(validIntersections[i]);
                } else if (
                  Math.round(robotCoord1[0] / 3.386) <=
                    Math.round(robotCoord2[0] / 3.386) &&
                  validIntersectionCoordinates[i][0] <=
                    Math.round(robotCoord1[0] / 3.386)
                ) {
                  directionalIntersections.push(validIntersections[i]);
                }
              }
            } else {
              if (
                Math.round(robotCoord2[0] / 3.386) ===
                Math.round(robotCoord1[0] / 3.386)
              ) {
                if (
                  Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) >=
                    Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
                  validIntersectionCoordinates[i][1] >=
                    Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
                ) {
                  directionalIntersections.push(validIntersections[i]);
                } else if (
                  Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) <=
                    Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
                  validIntersectionCoordinates[i][1] <=
                    Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
                ) {
                  directionalIntersections.push(validIntersections[i]);
                }
              } else {
                if (
                  Math.round(robotCoord1[0] / 3.386) >=
                    Math.round(robotCoord2[0] / 3.386) &&
                  validIntersectionCoordinates[i][0] >=
                    Math.round(robotCoord1[0] / 3.386)
                ) {
                  directionalIntersections.push(validIntersections[i]);
                } else if (
                  Math.round(robotCoord1[0] / 3.386) <=
                    Math.round(robotCoord2[0] / 3.386) &&
                  validIntersectionCoordinates[i][0] <=
                    Math.round(robotCoord1[0] / 3.386)
                ) {
                  directionalIntersections.push(validIntersections[i]);
                }
              }
            }
          }
          if (points[j].direction === "backwards") {
            var directionalIntersections = validIntersections.diff(
              directionalIntersections
            );
          }
          var directionalIntersectionsCoordinates = [];
          for (i = 0; i < directionalIntersections.length; i++) {
            directionalIntersectionsCoordinates.push(
              calculateIntersection(
                robotSlope,
                directionalIntersections[i].function
              )
            );
          }
          var distanceFormula = [];
          var smallestDistance = 1000000;
          var rememberI = 0;
          for (i = 0; i < directionalIntersectionsCoordinates.length; i++) {
            distanceFormula.push(
              Math.sqrt(
                (directionalIntersectionsCoordinates[i][0] -
                  Math.round(robotCoord1[0] / 3.386)) **
                  2 +
                  (directionalIntersectionsCoordinates[i][1] -
                    Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)) **
                    2
              )
            );
            if (
              distanceFormula[i] < smallestDistance &&
              distanceFormula[i] > sensorDistance
            ) {
              rememberI = i;
              smallestDistance = distanceFormula[i];
            }
          }
          if (directionalIntersections.length < 1) {
            var lineSlope = [];
          } else {
            var lineSlope = directionalIntersections[rememberI].function;
          }
          if (points) var oppositeSlope = 0;
          if (
            lineSlope[0] === 0 &&
            directionalIntersections[rememberI].coordinates[0][1] <
              robotCoord1[1]
          ) {
            oppositeSlope = 1000000;
          } else if (
            lineSlope[0] === 0 &&
            directionalIntersections[rememberI].coordinates[0][1] >
              robotCoord1[1]
          ) {
            oppositeSlope = -1000000;
          } else {
            oppositeSlope = -1 / lineSlope[0];
          }

          if (lineSlope[0] < 0) {
            if (
              Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) <
              lineSlope[0] * Math.round(robotCoord1[0] / 3.386) + lineSlope[1]
            ) {
              var xNew1 = 0;
              var xNew2 = 1;
            } else {
              var xNew1 = 0;
              var xNew2 = -1;
            }
          } else {
            if (
              Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) >
              lineSlope[0] * Math.round(robotCoord1[0] / 3.386) + lineSlope[1]
            ) {
              var xNew1 = 0;
              var xNew2 = 1;
            } else {
              var xNew1 = 0;
              var xNew2 = -1;
            }
          }

          var yNew1 = xNew1 * oppositeSlope;
          var yNew2 = xNew2 * oppositeSlope;
          deltaX = xNew2 - xNew1;
          deltaY = yNew2 - yNew1;
          var angle =
            (Math.atan2(deltaY, deltaX) - Math.PI / 2) * (180 / Math.PI) * -1;
          if (lineSlope[0] === 0) {
            angle = angle + 180;
          }

          if (
            points[j].actionsYesOrNo === 1 ||
            points[j].actionsYesOrNo === 3
          ) {
            drawCircle(canvasContext, points[j], "#00cd00");
          } else {
            drawCircle(canvasContext, points[j], "yellow");
          }

          if (document.getElementById("robotHitbox").checked) {
            drawHitbox(
              canvasContext,
              distanceToFront,
              distanceToBack,
              distanceToSide,
              points[j].coordinates[0],
              points[j].coordinates[1],
              angle
            );
          }
        } else {
          if (facing === "up") {
            var angle = 0;
          } else {
            var angle = 90;
          }
          if (i < 1) {
          } else {
            var deltaX =
              points[j].coordinates[0] - points[j - 1].coordinates[0];
            var deltaY =
              points[j].coordinates[1] - points[j - 1].coordinates[1];
            var angle =
              (Math.atan2(deltaY, deltaX) + Math.PI / 2) * (180 / Math.PI);
            if (points[j].direction === "backwards") {
              angle = angle + 180;
            }
          }

          if (
            points[j].actionsYesOrNo === 1 ||
            points[j].actionsYesOrNo === 3
          ) {
            drawCircle(canvasContext, points[j], "#00cd00");
          } else {
            drawCircle(canvasContext, points[j], "yellow");
          }

          if (document.getElementById("robotHitbox").checked) {
            drawHitbox(
              canvasContext,
              distanceToFront,
              distanceToBack,
              distanceToSide,
              points[j].coordinates[0],
              points[j].coordinates[1],
              angle
            );
          }
        }
      } else {
        angle = Number(document.getElementById("textboxAngle").value)* -1;
        if (j < 1) {
        } else {
          var deltaX = points[j].coordinates[0] - points[j - 1].coordinates[0];
          var deltaY = points[j].coordinates[1] - points[j - 1].coordinates[1];
          var angle =
            (Math.atan2(deltaY, deltaX) + Math.PI / 2) * (180 / Math.PI);
          if (points[i].direction === "backwards") {
            angle = angle + 180;
          }
        }

        if (points[j].actionsYesOrNo === 1 || points[j].actionsYesOrNo === 3) {
          drawCircle(canvasContext, points[j], "#00cd00");
        } else {
          drawCircle(canvasContext, points[j], "yellow");
        }

        if (document.getElementById("robotHitbox").checked) {
          drawHitbox(
            canvasContext,
            distanceToFront,
            distanceToBack,
            distanceToSide,
            points[j].coordinates[0],
            points[j].coordinates[1],
            angle
          );
        }
      }
    }
  }
}
function drawHitbox(
  canvasContext,
  distanceToFront,
  distanceToBack,
  distanceToSide,
  x,
  y,
  angle
) {
  var distanceToFront = distanceToFront * 3.386;
  var distanceToBack = distanceToBack * 3.386;
  var distanceToSide = distanceToSide * 3.386;
  var width = distanceToSide * 2;
  var height = distanceToFront + distanceToBack;
  canvasContext.save();

  canvasContext.translate(x, y);
  canvasContext.rotate((angle * Math.PI) / 180);
  canvasContext.translate(-x, -y);
  canvasContext.strokeRect(
    x - width / 2,
    y - height + distanceToBack,
    width,
    height
  );

  canvasContext.restore();
}

function drawLine(canvasContext, pointA, pointB) {
  if (
    (pointB.direction === "forwards" && pointA.actionsYesOrNo === 0) ||
    (pointB.direction === "forwards" && pointA.actionsYesOrNo === 1)
  ) {
    colorLine(canvasContext, pointA, pointB, "#831100", 7);
    colorLine(canvasContext, pointA, pointB, "#FF2600", 3);
  } else if (pointB.direction === "alignment" && pointA.actionsYesOrNo !== 2) {
    colorLine(canvasContext, pointA, pointB, "#188B08", 7);
    colorLine(canvasContext, pointA, pointB, "#00cd00", 3);
  } else if (
    pointB.direction === "forwards" &&
    (pointA.actionsYesOrNo === 2 || pointA.actionsYesOrNo === 3)
  ) {
    colorLine(canvasContext, pointA, pointB, "#00cd00", 7);
    colorLine(canvasContext, pointA, pointB, "#FF2600", 3);
  } else if (
    pointB.direction === "backwards" &&
    (pointA.actionsYesOrNo === 2 || pointA.actionsYesOrNo === 3)
  ) {
    colorLine(canvasContext, pointA, pointB, "#00cd00", 7);
    colorLine(canvasContext, pointA, pointB, "#0433FF", 3);
  } else {
    colorLine(canvasContext, pointA, pointB, "#002E7A", 7);
    colorLine(canvasContext, pointA, pointB, "#0433FF", 3);
  }
}

function colorLine(canvasContext, pointA, pointB, color, width) {
  canvasContext.beginPath();
  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = width;
  canvasContext.moveTo(pointA.coordinates[0], pointA.coordinates[1]);
  canvasContext.lineTo(pointB.coordinates[0], pointB.coordinates[1]);
  canvasContext.stroke();
}

function drawLines(canvasContext, points) {
  for (var i = 0; i < points.length - 1; i++) {
    drawLine(canvasContext, points[i], points[i + 1]);
  }
}

function redraw(canvasContext, img, points) {
  clearCanvas(canvasContext, img);
  drawLines(canvasContext, points);
  drawPoints(canvasContext, points);
}

function motorsCheck() {
  if (document.getElementById("backwardsMotors").checked) {
    var backwardsMotors = 1;
  } else {
    var backwardsMotors = 0;
  }
  return backwardsMotors;
}

function onCanvasClick(event) {
  if(addPointPossible == 1){
  var x = event.x;
  var y = event.y;

  x -= canvasDivisor.offsetLeft + 64 + 1.5;
  y -= canvasDivisor.offsetTop + 85 + 16 - 3 - scroll;

  var speed = document.getElementById("speed").value;

  if (event.shiftKey) {
    points.push({
      coordinates: [x, y],
      direction: "backwards",
      type: "waypoint",
      actionsYesOrNo: 0,
      speedOfLine: speed,
      speedOfTurn: document.querySelector("#angleSpeed").value
    });
  } else {
    points.push({
      coordinates: [x, y],
      direction: "forwards",
      type: "waypoint",
      actionsYesOrNo: 0,
      speedOfLine: speed,
      speedOfTurn: document.querySelector("#angleSpeed").value
    });
  }

  redraw(ctx, img, points);
  addLiElement(
    "orderedList",
    Math.round((x / 3.386) * 10) / 10,
    Math.round(((y / 3.386) * -1 + 114.29) * 10) / 10
  );
  if (redoList.length > 1) {
    if (redoList[redoList.length - 1].type === "emptyAction") {
      redoList.pop(redoList.length - 2);
    }
    redoList.pop(redoList.length - 1);
  } else {
    redoList = [];
  }

  generateLists(points, speed);
  update(points, redoList);}
}

function undoButton(ctx, img, points, redoActionList) {
  const point = points[points.length - 1];
  var pastPoint = points[points.length - 2];
  var ol = document.getElementById("orderedList");
  var liToKill = ol.childNodes[points.length - 1];

  if (point.actionsYesOrNo === 1) {
    redoList.push({ type: "emptyAction" });
    points[points.length - 1].actionsYesOrNo = 0;
  } else if (points.length > 1 && pastPoint.actionsYesOrNo === 2) {
    redoList.push({ type: "emptyActionWhileMoving" });
    points[points.length - 2].actionsYesOrNo = 0;
  } else if (points.length > 1 && pastPoint.actionsYesOrNo === 3) {
    redoList.push({ type: "emptyActionWhileMoving" });
    points[points.length - 2].actionsYesOrNo = 1;
  } else {
    var redoElement = points.pop();
    redoList.push(redoElement);
    liToKill.parentNode.removeChild(liToKill);
  }

  redraw(ctx, img, points);
  update(points, redoList);
}

function clearPath(canvasContext, img) {
  clearCanvas(canvasContext, img);
  points.splice(0, points.length);

  document.querySelector("ol").innerHTML = "";
  redoList = [];
  textBox = "";
  document.getElementById("x_coord").value = "";
  document.getElementById("y_coord").value = "";
  document.getElementById("add_point").setAttribute("disabled", true);
  update(points, redoList);
}

function update(points, redoList) {
  addPointPossible = 1;
  speedOfLineCheck();
  speedOfTurnCheck();
  axleLengthCheck();
  wheelSizeCheck();
  DTFCheck();
  DTBCheck();
  DTSCheck();
  DTCSCheck();
  coordCheck();
  if (points.length <= 1) {
    document.getElementById("squaring").setAttribute("disabled", "");
  } else {
    var blackLines = [
      {
        number: 1,
        function: [1000000, -63999947],
        coordinates: [
          [64, 53],
          [64, 73]
        ]
      },
      {
        number: 2,
        function: [0, 73],
        coordinates: [
          [64, 73],
          [82, 73]
        ]
      },
      {
        number: 3,
        function: [1000000, -81999927],
        coordinates: [
          [82, 73],
          [82, 93]
        ]
      },
      {
        number: 4,
        function: [-1.0385, 185.3462],
        coordinates: [
          [87, 95],
          [113, 68]
        ]
      },
      {
        number: 5,
        function: [1000000, -112999932],
        coordinates: [
          [113, 59],
          [113, 68]
        ]
      },
      {
        number: 6,
        function: [1.0667, -61.5333],
        coordinates: [
          [98, 43],
          [113, 59]
        ]
      },
      {
        number: 7,
        function: [0, 43],
        coordinates: [
          [80, 43],
          [98, 43]
        ]
      },
      {
        number: 8,
        function: [1.0833, -43.6667],
        coordinates: [
          [68, 30],
          [80, 43]
        ]
      },
      {
        number: 9,
        function: [0, 22],
        coordinates: [
          [92, 22],
          [152, 22]
        ]
      },
      {
        number: 10,
        function: [0, 19],
        coordinates: [
          [153, 19],
          [168, 19]
        ]
      },
      {
        number: 11,
        function: [0, 22],
        coordinates: [
          [169, 22],
          [200, 22]
        ]
      },
      {
        number: 12,
        function: [-1.8333, 337.6667],
        coordinates: [
          [146, 70],
          [170, 26]
        ]
      },
      {
        number: 13,
        function: [0.6176, -58.9118],
        coordinates: [
          [165, 43],
          [199, 64]
        ]
      },
      {
        number: 14,
        function: [1000000, -168999911],
        coordinates: [
          [169, 89],
          [169, 114]
        ]
      }
    ];

    var sensorDistance = Number(document.getElementById("textboxC").value);

    var robotCoord1 = points[points.length - 1].coordinates;
    var robotCoord2 = points[points.length - 2].coordinates;

    if (
      Math.round(robotCoord1[0] / 3.386) ===
        Math.round(robotCoord2[0] / 3.386) &&
      Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) >
        Math.round((robotCoord2[1] / 3.386) * -1 + 114.29)
    ) {
      var robotSlope = [
        1000000,
        -1000000 * Math.round(robotCoord1[0] / 3.386) +
          Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
      ];
    } else if (
      Math.round(robotCoord1[0] / 3.386) ===
        Math.round(robotCoord2[0] / 3.386) &&
      Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) <
        Math.round((robotCoord2[1] / 3.386) * -1 + 114.29)
    ) {
      var robotSlope = [
        -1000000,
        1000000 * Math.round(robotCoord1[0] / 3.386) +
          Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
      ];
    } else {
      var robotSlope = calculateSlope(
        Math.round(robotCoord1[0] / 3.386),
        Math.round(robotCoord2[0] / 3.386),
        Math.round((robotCoord1[1] / 3.386) * -1 + 114.29),
        Math.round((robotCoord2[1] / 3.386) * -1 + 114.29)
      );
    }

    var blackLineIntersections = [];
    var validIntersections = [];

    for (i = 0; i < 14; i++) {
      blackLineIntersections.push(
        calculateIntersection(robotSlope, blackLines[i].function)
      );
    }

    for (i = 0; i < 14; i++) {
      if (blackLines[i].function[0] === 1000000) {
        if (
          blackLineIntersections[i][1] > blackLines[i].coordinates[0][1] &&
          blackLineIntersections[i][1] < blackLines[i].coordinates[1][1]
        ) {
          validIntersections.push(blackLines[i]);
        }
      } else {
        if (
          blackLineIntersections[i][0] > blackLines[i].coordinates[0][0] &&
          blackLineIntersections[i][0] < blackLines[i].coordinates[1][0]
        ) {
          validIntersections.push(blackLines[i]);
        }
      }
    }

    var validIntersectionCoordinates = [];
    for (i = 0; i < validIntersections.length; i++) {
      validIntersectionCoordinates.push(
        calculateIntersection(robotSlope, validIntersections[i].function)
      );
    }

    var directionalIntersections = [];

    for (i = 0; i < validIntersections.length; i++) {
      if (points[points.length - 1].direction === "backwards") {
        if (
          Math.round(robotCoord1[0] / 3.386) ===
          Math.round(robotCoord2[0] / 3.386)
        ) {
          if (
            Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) >=
              Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
            validIntersectionCoordinates[i][1] >=
              Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
          ) {
            directionalIntersections.push(validIntersections[i]);
          } else if (
            Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) <=
              Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
            validIntersectionCoordinates[i][1] <=
              Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
          ) {
            directionalIntersections.push(validIntersections[i]);
          }
        } else {
          if (
            Math.round(robotCoord1[0] / 3.386) >=
              Math.round(robotCoord2[0] / 3.386) &&
            validIntersectionCoordinates[i][0] >=
              Math.round(robotCoord1[0] / 3.386)
          ) {
            directionalIntersections.push(validIntersections[i]);
          } else if (
            Math.round(robotCoord1[0] / 3.386) <=
              Math.round(robotCoord2[0] / 3.386) &&
            validIntersectionCoordinates[i][0] <=
              Math.round(robotCoord1[0] / 3.386)
          ) {
            directionalIntersections.push(validIntersections[i]);
          }
        }
      } else {
        if (
          Math.round(robotCoord2[0] / 3.386) ===
          Math.round(robotCoord1[0] / 3.386)
        ) {
          if (
            Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) >=
              Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
            validIntersectionCoordinates[i][1] >=
              Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
          ) {
            directionalIntersections.push(validIntersections[i]);
          } else if (
            Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) <=
              Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
            validIntersectionCoordinates[i][1] <=
              Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
          ) {
            directionalIntersections.push(validIntersections[i]);
          }
        } else {
          if (
            Math.round(robotCoord1[0] / 3.386) >=
              Math.round(robotCoord2[0] / 3.386) &&
            validIntersectionCoordinates[i][0] >=
              Math.round(robotCoord1[0] / 3.386)
          ) {
            directionalIntersections.push(validIntersections[i]);
          } else if (
            Math.round(robotCoord1[0] / 3.386) <=
              Math.round(robotCoord2[0] / 3.386) &&
            validIntersectionCoordinates[i][0] <=
              Math.round(robotCoord1[0] / 3.386)
          ) {
            directionalIntersections.push(validIntersections[i]);
          }
        }
      }
    }
    if (points[points.length - 1].direction === "backwards") {
      var directionalIntersections = validIntersections.diff(
        directionalIntersections
      );
    }
    var directionalIntersectionsCoordinates = [];
    for (i = 0; i < directionalIntersections.length; i++) {
      directionalIntersectionsCoordinates.push(
        calculateIntersection(robotSlope, directionalIntersections[i].function)
      );
    }
    var distanceFormula = [];
    var smallestDistance = 1000000;
    var rememberI = 0;
    for (i = 0; i < directionalIntersectionsCoordinates.length; i++) {
      distanceFormula.push(
        Math.sqrt(
          (directionalIntersectionsCoordinates[i][0] -
            Math.round(robotCoord1[0] / 3.386)) **
            2 +
            (directionalIntersectionsCoordinates[i][1] -
              Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)) **
              2
        )
      );
      if (
        distanceFormula[i] < smallestDistance &&
        distanceFormula[i] > sensorDistance
      ) {
        rememberI = i;
        smallestDistance = distanceFormula[i];
      }
    }

    if ((
      directionalIntersections.length < 1 ||
      distanceFormula[rememberI] < sensorDistance ||
      points[points.length - 1].direction === "alignment"
    ) || lineSquaringPossible == 0 || addPointPossible == 0) {
      document.getElementById("squaring").setAttribute("disabled", "");
    } else {
      document.getElementById("squaring").removeAttribute("disabled");
    }
  }
  generateEstimate();
  if (points.length === 0 || addPointPossible == 0) {
    document.getElementById("alignButton").setAttribute("disabled", "");
  } else {
    document.getElementById("alignButton").removeAttribute("disabled");
  }

  if (points.length === 0) {
    document.getElementById("Undo").setAttribute("disabled", "");
  } else {
    document.getElementById("Undo").removeAttribute("disabled");
  }
  if (points.length !== 0 || redoList.length !== 0) {
    document.getElementById("loadFake").setAttribute("disabled", "");
  } else {
    document.getElementById("loadFake").removeAttribute("disabled");
  }
  if (points.length === 0) {
    document.getElementById("clearPath").setAttribute("disabled", "");
  } else {
    document.getElementById("clearPath").removeAttribute("disabled");
  }

  if (points.length === 0) {
    document.getElementById("addAction").setAttribute("disabled", "");
  } else {
    document.getElementById("addAction").removeAttribute("disabled");
  }
  if (redoList.length === 0) {
    document.getElementById("redo").setAttribute("disabled", "");
  } else {
    document.getElementById("redo").removeAttribute("disabled");
  }
  if (
    (points.length > 0 && points[points.length - 1].actionsYesOrNo % 2 === 1) ||
    points.length === 0
  ) {
    document.getElementById("addAction").setAttribute("disabled", "");
  } else {
    document.getElementById("addAction").removeAttribute("disabled");
  }
  //---------------------------------

  if (
    (points.length > 1 && points[points.length - 2].actionsYesOrNo === 2) ||
    (points.length > 1 && points[points.length - 2].actionsYesOrNo === 3) ||
    points.length < 2 ||
    points[points.length - 1].direction === "alignment"
  ) {
    document
      .getElementById("addActionWhileMoving")
      .setAttribute("disabled", "");
  } else {
    document.getElementById("addActionWhileMoving").removeAttribute("disabled");
  }
  //-------------------------------------------------------
  if (points.length === 0) {
    document.getElementById("create").setAttribute("disabled", "");
  } else {
    document.getElementById("create").removeAttribute("disabled", "");
  }
  addSpeedToList(points);
  addTurningSpeedToList(points);
}

function openModal() {
  document.querySelector("#clear-modal").style.display = "block";
  document.querySelector("#canvas-overlay").style.display = "block";
}

function closeModal() {
  document.querySelector("#clear-modal").style.display = "none";
  document.querySelector("#canvas-overlay").style.display = "none";
}
function confirmModal() {
  closeModal();
  clearPath(ctx, img);
  startStartingModal();
}

function closeStartingModal() {
  document.querySelector("#start-modal").style.display = "none";
  document.querySelector("#canvas-overlay").style.display = "none";
}

function startStartingModal() {
  document.querySelector("#start-modal").style.display = "block";
  document.querySelector("#canvas-overlay").style.display = "block";
}

function startingUp() {
  closeStartingModal();
  clearPath(ctx, img);
  facing = "up";
}
function startingRight() {
  closeStartingModal();
  clearPath(ctx, img);
  facing = "right";
}

function redoButton(redoList, points) {
  var current = redoList.pop();

  if (current.type === "emptyAction") {
    points[points.length - 1].actionsYesOrNo = 1;
    var orderedListSelect = document.querySelector("ol");
    var lastLiSelect =
      orderedListSelect.childNodes[orderedListSelect.childElementCount - 1];
    var UlSelect = lastLiSelect.querySelector("ul");
    var textInLiInUl = document.createTextNode("[Action]");
    var liInUl = document.createElement("li");
    liInUl.setAttribute("class", "liInUl");
    liInUl.appendChild(textInLiInUl);
    UlSelect.appendChild(liInUl);
  } else if (current.type === "emptyActionWhileMoving") {
    points[points.length - 2].actionsYesOrNo += 2;
    var orderedListSelect = document.querySelector("ol");
    var lastLiSelect =
      orderedListSelect.childNodes[orderedListSelect.childElementCount - 1];
    var UlSelect = lastLiSelect.querySelector("ul");
    var liInUl = document.createElement("li");
    liInUl.setAttribute("class", "liInUl");
  } else {
    points.push(current);
    addLiElement(
      "orderedList",
      Math.round((current.coordinates[0] / 3.386) * 10) / 10,
      Math.round(((current.coordinates[1] / 3.386) * -1 + 114.29) * 10) / 10
    );
  }

  redraw(ctx, img, points);
  update(points, redoList);
}

function addCoord(
  event = undefined,
  x = undefined,
  y = undefined,
  shift = undefined,
  override = false
) {
  if (!override) {
    x = document.getElementById("x_coord").value;
    y = document.getElementById("y_coord").value;
    var shiftCheck = event.shiftKey;
    if (shiftCheck === true) {
      shift = 2;
    } else if (shiftCheck === false) {
      shift = undefined;
    } else {
      shift = 1;
    }
  } else {
    if (shift === 2) {
      shiftCheck = true;
    } else if (shift === undefined) {
      shiftCheck = false;
    }

    if (shiftCheck === true) {
      shift = 2;
    } else if (shiftCheck === false) {
      shift = undefined;
    } else {
      shift = 1;
    }
  }

  if (x === "" || y === "") {
  } else {
    if (shift === 1) {
      points.push({
        coordinates: [Math.round(3.386 * x), Math.round(387 - 3.386 * y)],
        direction: "alignment",
        type: "waypoint",
        actionsYesOrNo: 0,
        speedOfLine: document.querySelector("#speed").value,
        speedOfTurn: document.querySelector("#angleSpeed").value
      });
    }
    if (shift === 2) {
      points.push({
        coordinates: [Math.round(3.386 * x), Math.round(387 - 3.386 * y)],
        direction: "backwards",
        type: "waypoint",
        actionsYesOrNo: 0,
        speedOfLine: document.querySelector("#speed").value,
        speedOfTurn: document.querySelector("#angleSpeed").value
      });
    } else if (shift === undefined) {
      points.push({
        coordinates: [Math.round(3.386 * x), Math.round(387 - 3.386 * y)],
        direction: "forwards",
        type: "waypoint",
        actionsYesOrNo: 0,
        speedOfLine: document.querySelector("#speed").value,
        speedOfTurn: document.querySelector("#angleSpeed").value
      });
    }
    addLiElement("orderedList", x, y);
    redraw(ctx, img, points);
    if (redoList.length > 1) {
      if (redoList[redoList.length - 1].type === "emptyAction") {
        redoList.pop(redoList.length - 2);
      }
      redoList.pop(redoList.length - 1);
    } else {
      redoList = [];
    }

    document.querySelector("#x_coord").value = "";
    document.querySelector("#y_coord").value = "";
    document.querySelector("#add_point").setAttribute("disabled", true);
    update(points, redoList);
  }
  generateEstimate();
  generateLists(points, speed);
}


function allowAddCoord (){
  update(points,redoList);
}
function  angleCheck(){
  var textboxAngle= document.getElementById("textboxAngle").value
  if(textboxAngle>180 || textboxAngle<-180){
    document.getElementById("textboxAngle").setAttribute("class", "add-point-error");
    document.getElementById("setAngle").setAttribute("disabled", "");
}else{
  document.getElementById("textboxAngle").setAttribute("class", "input_box");
  document.getElementById("setAngle").removeAttribute("disabled", "");}
}

function speedOfLineCheck() {
  var speedLine = document.getElementById("speed").value
  if(speedLine>100 || speedLine<=0){
    document.getElementById("speed").setAttribute("class", "add-point-error");
    document.getElementById("create").setAttribute("disabled", "");
    addPointPossible = 0;
  }
}
function speedOfTurnCheck() {
  var speedTurn = document.getElementById("angleSpeed").value;
  if ((speedTurn>100 || speedTurn<=0)){
    document.getElementById("angleSpeed").setAttribute("class", "add-point-error");
    document.getElementById("create").setAttribute("disabled", "");
    document.getElementById("create").setAttribute("disabled", "");
    document.getElementById("create").setAttribute("disabled", "");
    addPointPossible = 0;
  }else{
    document.getElementById("angleSpeed").setAttribute("class", "input_box");
  }
}
function wheelSizeCheck() {
  var wheelSize = document.getElementById("wheelSize").value;
  if ( wheelSize<=0){
    document.getElementById("wheelSize").setAttribute("class", "add-point-error");
    document.getElementById("create").setAttribute("disabled", "");
  }
  else{
    document.getElementById("wheelSize").setAttribute("class", "input_box");
    document.getElementById("create").removeAttribute("disabled", "");
  }
}
function axleLengthCheck() {
  var axleLength = document.getElementById("axleLength").value;
  if ( axleLength<=0){
    document.getElementById("axleLength").setAttribute("class", "add-point-error");
    document.getElementById("create").setAttribute("disabled", "");
  }
  else{
    document.getElementById("axleLength").setAttribute("class", "input_box");
    document.getElementById("create").removeAttribute("disabled", "");
  }
}
function DTFCheck() {
  var textboxA = document.getElementById("textboxA").value;
  if ( textboxA<=0){
    document.getElementById("textboxA").setAttribute("class", "add-point-error");
    addPointPossible = 0;
  }
  else{
    document.getElementById("textboxA").setAttribute("class", "input_box");
  }
}
function DTBCheck() {
  var textboxB = document.getElementById("textboxB").value;
  if ( textboxB<=0){
    document.getElementById("textboxB").setAttribute("class", "add-point-error");
    addPointPossible = 0;
  }
  else{
    document.getElementById("textboxB").setAttribute("class", "input_box");
  }
}
function DTSCheck() {
  var textboxD = document.getElementById("textboxD").value;
  if ( textboxD<=0){
    document.getElementById("textboxD").setAttribute("class", "add-point-error");
    addPointPossible = 0;
  }
  else{
    document.getElementById("textboxD").setAttribute("class", "input_box");
  }
}
function DTCSCheck() {
  var textboxC = document.getElementById("textboxC").value;
  if ( textboxC == ""){
    document.getElementById("textboxC").setAttribute("class", "add-point-error");
    document.getElementById("squaring").setAttribute("disabled", "");
    lineSquaringPossible = 0;
  }
  else{
    document.getElementById("textboxC").setAttribute("class", "input_box");
    
    lineSquaringPossible = 1;
  }
}

function coordCheck() {
  x = document.getElementById("x_coord").value;
  y = document.getElementById("y_coord").value;

  if (x == "" && y == "") {
    document.getElementById("add_point").setAttribute("disabled", "");
    document.getElementById("x_coord").setAttribute("class", "input_box");
    document.getElementById("y_coord").setAttribute("class", "input_box");
  }
  else if(x=="" &&  y!=""){
    document.getElementById("x_coord").setAttribute("class", "add-point-error");
    document.getElementById("add_point").setAttribute("disabled", "");
    if(y<0 || y>114){
      document.getElementById("y_coord").setAttribute("class", "add-point-error");
    }
    else{
      document.getElementById("y_coord").setAttribute("class", "input_box");}
  }
  else if(y=="" &&  x!=""){
    document.getElementById("y_coord").setAttribute("class", "add-point-error");
    document.getElementById("add_point").setAttribute("disabled", "");
    if(x<0 || x>236){
      document.getElementById("x_coord").setAttribute("class", "add-point-error");
    }
    else{
      document.getElementById("x_coord").setAttribute("class", "input_box");}
  }
   else {
     if (x <= 236 && x>=0) {
        document.getElementById("x_coord").setAttribute("class", "input_box");
      }
      if (y <=114 && y >=0){
        document.getElementById("y_coord").setAttribute("class", "input_box");
      }
      if((y <=114 && y >=0) && (x <= 236 && x>=0)){
        document.getElementById("add_point").removeAttribute("disabled", "");
      }
  }
  if(addPointPossible == 0){
    document.getElementById("add_point").setAttribute("disabled", "");
  }
}
function scrollToTopFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
function scrollSmooth(id, type = "#") {
  const section = document.querySelector(`${type}${id}`);
  section.scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    section.classList.add("scale-animation");
  }, 100);
  setTimeout(() => {
    section.classList.remove("scale-animation");
  }, 1100);
}

function handleGenerateClick(event) {
  var wheelSize = document.getElementById("wheelSize").value;
  var old = document.getElementById("invisibleLink");

  if (old) {
    old.remove();
  }
  generateFile(points, wheelSize, facing);
  var invisibleLink = document.getElementById("invisibleLink");
  invisibleLink.click();
}

function advancedMode() {
  var advancedmodeid = document.getElementById("AdvMode");
  var displayadv = advancedmodeid.style.display;
  if (displayadv == "block") {
    advancedmodeid.style.display = "none";
  } else {
    advancedmodeid.style.display = "block";
  }
}

function wallAlign(points) {
  if (event.shiftKey === true) {
    shift = 2;
  } else {
    shift = undefined;
  }

  if (points.length < 1) {
    return;
  }

  var distanceToFront = document.getElementById("textboxA").value;
  var distanceToBack = document.getElementById("textboxB").value;
  useDistance = distanceToFront;

  if (shift === 2) {
    var useDistance = distanceToBack;
  }

  var lastCoord = points[points.length - 1];
  var xOld = lastCoord.coordinates[0];
  var yOld = lastCoord.coordinates[1];
  xOld = Math.round(xOld / 3.386);
  yOld = Math.round((387 - yOld) / 3.386);
  var xNew = 0 + useDistance;
  var yNew = yOld;
  var min = xOld;

  if (236 - xOld < min) {
    min = 236 - xOld;

    xNew = 236 - useDistance;
    yNew = yOld;
  }
  if (yOld < min) {
    min = yOld;

    xNew = xOld;
    yNew = 0 + useDistance;
  }
  if (114 - yOld < min) {
    min = 114 - yOld;

    xNew = xOld;
    yNew = 114 - useDistance;
  }

  addCoord(undefined, xNew, yNew, shift, true);
}

function lineSquaring(points) {
  var blackLines = [
    {
      number: 1,
      function: [1000000, -63999947],
      coordinates: [
        [64, 53],
        [64, 73]
      ]
    },
    {
      number: 2,
      function: [0, 73],
      coordinates: [
        [64, 73],
        [82, 73]
      ]
    },
    {
      number: 3,
      function: [1000000, -81999927],
      coordinates: [
        [82, 73],
        [82, 93]
      ]
    },
    {
      number: 4,
      function: [-1.0385, 185.3462],
      coordinates: [
        [87, 95],
        [113, 68]
      ]
    },
    {
      number: 5,
      function: [1000000, -112999932],
      coordinates: [
        [113, 59],
        [113, 68]
      ]
    },
    {
      number: 6,
      function: [1.0667, -61.5333],
      coordinates: [
        [98, 43],
        [113, 59]
      ]
    },
    {
      number: 7,
      function: [0, 43],
      coordinates: [
        [80, 43],
        [98, 43]
      ]
    },
    {
      number: 8,
      function: [1.0833, -43.6667],
      coordinates: [
        [68, 30],
        [80, 43]
      ]
    },
    {
      number: 9,
      function: [0, 22],
      coordinates: [
        [92, 22],
        [152, 22]
      ]
    },
    {
      number: 10,
      function: [0, 19],
      coordinates: [
        [153, 19],
        [168, 19]
      ]
    },
    {
      number: 11,
      function: [0, 22],
      coordinates: [
        [169, 22],
        [200, 22]
      ]
    },
    {
      number: 12,
      function: [-1.8333, 337.6667],
      coordinates: [
        [146, 70],
        [170, 26]
      ]
    },
    {
      number: 13,
      function: [0.6176, -58.9118],
      coordinates: [
        [165, 43],
        [199, 64]
      ]
    },
    {
      number: 14,
      function: [1000000, -168999911],
      coordinates: [
        [169, 89],
        [169, 114]
      ]
    }
  ];

  var sensorDistance = Number(document.getElementById("textboxC").value);

  var robotCoord1 = points[points.length - 1].coordinates;
  var robotCoord2 = points[points.length - 2].coordinates;

  if (
    Math.round(robotCoord1[0] / 3.386) === Math.round(robotCoord2[0] / 3.386) &&
    Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) >
      Math.round((robotCoord2[1] / 3.386) * -1 + 114.29)
  ) {
    var robotSlope = [
      1000000,
      -1000000 * Math.round(robotCoord1[0] / 3.386) +
        Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
    ];
  } else if (
    Math.round(robotCoord1[0] / 3.386) === Math.round(robotCoord2[0] / 3.386) &&
    Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) <
      Math.round((robotCoord2[1] / 3.386) * -1 + 114.29)
  ) {
    var robotSlope = [
      -1000000,
      1000000 * Math.round(robotCoord1[0] / 3.386) +
        Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
    ];
  } else {
    var robotSlope = calculateSlope(
      Math.round(robotCoord1[0] / 3.386),
      Math.round(robotCoord2[0] / 3.386),
      Math.round((robotCoord1[1] / 3.386) * -1 + 114.29),
      Math.round((robotCoord2[1] / 3.386) * -1 + 114.29)
    );
  }

  var blackLineIntersections = [];
  var validIntersections = [];

  for (i = 0; i < 14; i++) {
    blackLineIntersections.push(
      calculateIntersection(robotSlope, blackLines[i].function)
    );
  }

  for (i = 0; i < 14; i++) {
    if (blackLines[i].function[0] === 1000000) {
      if (
        blackLineIntersections[i][1] > blackLines[i].coordinates[0][1] &&
        blackLineIntersections[i][1] < blackLines[i].coordinates[1][1]
      ) {
        validIntersections.push(blackLines[i]);
      }
    } else {
      if (
        blackLineIntersections[i][0] > blackLines[i].coordinates[0][0] &&
        blackLineIntersections[i][0] < blackLines[i].coordinates[1][0]
      ) {
        validIntersections.push(blackLines[i]);
      }
    }
  }

  var validIntersectionCoordinates = [];
  for (i = 0; i < validIntersections.length; i++) {
    validIntersectionCoordinates.push(
      calculateIntersection(robotSlope, validIntersections[i].function)
    );
  }

  var directionalIntersections = [];

  for (i = 0; i < validIntersections.length; i++) {
    if (points[points.length - 1].direction === "backwards") {
      if (
        Math.round(robotCoord1[0] / 3.386) ===
        Math.round(robotCoord2[0] / 3.386)
      ) {
        if (
          Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) >=
            Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
          validIntersectionCoordinates[i][1] >=
            Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
        ) {
          directionalIntersections.push(validIntersections[i]);
        } else if (
          Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) <=
            Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
          validIntersectionCoordinates[i][1] <=
            Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
        ) {
          directionalIntersections.push(validIntersections[i]);
        }
      } else {
        if (
          Math.round(robotCoord1[0] / 3.386) >=
            Math.round(robotCoord2[0] / 3.386) &&
          validIntersectionCoordinates[i][0] >=
            Math.round(robotCoord1[0] / 3.386)
        ) {
          directionalIntersections.push(validIntersections[i]);
        } else if (
          Math.round(robotCoord1[0] / 3.386) <=
            Math.round(robotCoord2[0] / 3.386) &&
          validIntersectionCoordinates[i][0] <=
            Math.round(robotCoord1[0] / 3.386)
        ) {
          directionalIntersections.push(validIntersections[i]);
        }
      }
    } else {
      if (
        Math.round(robotCoord2[0] / 3.386) ===
        Math.round(robotCoord1[0] / 3.386)
      ) {
        if (
          Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) >=
            Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
          validIntersectionCoordinates[i][1] >=
            Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
        ) {
          directionalIntersections.push(validIntersections[i]);
        } else if (
          Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) <=
            Math.round((robotCoord2[1] / 3.386) * -1 + 114.29) &&
          validIntersectionCoordinates[i][1] <=
            Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)
        ) {
          directionalIntersections.push(validIntersections[i]);
        }
      } else {
        if (
          Math.round(robotCoord1[0] / 3.386) >=
            Math.round(robotCoord2[0] / 3.386) &&
          validIntersectionCoordinates[i][0] >=
            Math.round(robotCoord1[0] / 3.386)
        ) {
          directionalIntersections.push(validIntersections[i]);
        } else if (
          Math.round(robotCoord1[0] / 3.386) <=
            Math.round(robotCoord2[0] / 3.386) &&
          validIntersectionCoordinates[i][0] <=
            Math.round(robotCoord1[0] / 3.386)
        ) {
          directionalIntersections.push(validIntersections[i]);
        }
      }
    }
  }
  if (points[points.length - 1].direction === "backwards") {
    var directionalIntersections = validIntersections.diff(
      directionalIntersections
    );
  }
  var directionalIntersectionsCoordinates = [];
  for (i = 0; i < directionalIntersections.length; i++) {
    directionalIntersectionsCoordinates.push(
      calculateIntersection(robotSlope, directionalIntersections[i].function)
    );
  }
  var distanceFormula = [];
  var smallestDistance = 1000000;
  var rememberI = 0;
  for (i = 0; i < directionalIntersectionsCoordinates.length; i++) {
    distanceFormula.push(
      Math.sqrt(
        (directionalIntersectionsCoordinates[i][0] -
          Math.round(robotCoord1[0] / 3.386)) **
          2 +
          (directionalIntersectionsCoordinates[i][1] -
            Math.round((robotCoord1[1] / 3.386) * -1 + 114.29)) **
            2
      )
    );
    if (
      distanceFormula[i] < smallestDistance &&
      distanceFormula[i] > sensorDistance
    ) {
      rememberI = i;
      smallestDistance = distanceFormula[i];
    }
  }

  if (directionalIntersections.length < 1) {
    lineSlope = [];
  } else {
    var lineSlope = directionalIntersections[rememberI].function;
  }

  var finalCoords = calculateIntersection(robotSlope, lineSlope);

  var circleCustom = [finalCoords[0], finalCoords[1], sensorDistance];
  if (lineSlope[0] === 0) {
    var oppositeSlope = [1000000, -1000000 * finalCoords[0] + finalCoords[1]];
  } else {
    var oppositeSlope = [
      -1 / lineSlope[0],
      (1 / lineSlope[0]) * finalCoords[0] + finalCoords[1]
    ];
  }

  var circleIntersections = calculateIntersectionWithCircle(
    circleCustom,
    oppositeSlope
  );
  var circleIntersection1 = circleIntersections[0];
  var circleIntersection2 = circleIntersections[1];

  var assistantSlope1 = [
    lineSlope[0],
    -1 * lineSlope[0] * circleIntersection1[0] + circleIntersection1[1]
  ];
  var assistantSlope2 = [
    lineSlope[0],
    -1 * lineSlope[0] * circleIntersection2[0] + circleIntersection2[1]
  ];

  var solution1 = calculateIntersection(assistantSlope1, robotSlope);
  var solution2 = calculateIntersection(assistantSlope2, robotSlope);

  var distance1 = Math.sqrt(
    (solution1[0] - robotCoord1[0] / 3.386) ** 2 +
      (solution1[1] - ((robotCoord1[1] / 3.386) * -1 + 114.29)) ** 2
  );

  var distance2 = Math.sqrt(
    (solution2[0] - robotCoord1[0] / 3.386) ** 2 +
      (solution2[1] - ((robotCoord1[1] / 3.386) * -1 + 114.29)) ** 2
  );

  if (distance1 < distance2) {
    var finalSolution = solution1;
  } else {
    var finalSolution = solution2;
  }

  var IntersectionFinalLine = calculateIntersection(robotSlope, lineSlope);
  var distanceToLine = Math.sqrt(
    (IntersectionFinalLine[0] - robotCoord1[0] / 3.386) ** 2 +
      (IntersectionFinalLine[1] - ((robotCoord1[1] / 3.386) * -1 + 114.29)) ** 2
  );
  if (
    (Math.round(robotCoord1[0] / 3.386) === Math.round(finalSolution[0]) &&
      Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) ===
        Math.round(finalSolution[1])) ||
    distanceToLine < sensorDistance
  ) {
  } else {
    addCoord(
      undefined,
      Math.round(finalSolution[0]),
      Math.round(finalSolution[1]),
      1,
      true
    );
    return lineSlope;
  }
}

function calculateIntersectionWithCircle(circle, slope) {
  var xCircle = circle[0];
  var yCircle = circle[1];
  var circleRadius = circle[2];
  var a = slope[0];
  var b = slope[1];
  var x1 =
    (xCircle -
      a * b +
      a * yCircle -
      Math.sqrt(
        -a * a * xCircle * xCircle +
          2 * a * yCircle * xCircle -
          2 * a * b * xCircle +
          a * a * circleRadius * circleRadius +
          2 * b * yCircle +
          circleRadius * circleRadius -
          b * b -
          yCircle * yCircle
      )) /
    (1 + a * a);

  var x2 =
    (xCircle -
      a * b +
      a * yCircle +
      Math.sqrt(
        -a * a * xCircle * xCircle +
          2 * a * yCircle * xCircle -
          2 * a * b * xCircle +
          a * a * circleRadius * circleRadius +
          2 * b * yCircle +
          circleRadius * circleRadius -
          b * b -
          yCircle * yCircle
      )) /
    (1 + a * a);

  var y1 = a * x1 + b;
  var y2 = a * x2 + b;
  var coordinate1 = [x1, y1];
  var coordinate2 = [x2, y2];
  var coordinates = [coordinate1, coordinate2];
  return coordinates;
}

function calculateSlope(x1, x2, y1, y2) {
  var a = (y1 - y2) / (x1 - x2);
  var b = -1 * a * x1 + y1;
  var c = [a, b];
  return c;
}

function calculateIntersection(slope1, slope2) {
  var a1 = slope1[0];
  var a2 = slope2[0];
  var b1 = slope1[1];
  var b2 = slope2[1];
  var x = (b2 - b1) / (a1 - a2);
  var y = a1 * x + b1;
  var c = [x, y];
  return c;
}
Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    return a.indexOf(i) < 0;
  });
};
