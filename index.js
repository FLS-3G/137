function clearCanvas(canvasContext, img) {
  canvasContext.clearRect(0, 0, 800, 400);
  canvasContext.globalAlpha = 0.8;
  canvasContext.drawImage(img, 0, 0, 800, 400);
  canvasContext.globalAlpha = 1;
}

var facing = "up";
var axleLength = document.getElementById("axleLength").value;
var backwardsMotors = document.getElementById("backwardsMotors").value;
var textBox = "";
var points = [];
var redoList = [];
var redoActionList = [];
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var i = 1;
var output = "";
var img = new Image();

img.src =
  "https://raw.githubusercontent.com/html-ninjas/FLS/master/Mat2020.jpg";

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

  redoList = [];

  update(points, redoList);
}

function addSpeedToList(points) {
  const listOfPoints = document.querySelector("ol").children;
  for (i = 0; i < points.length; i++) {
    var currentSpeed = points[i].speedOfLine;
    if (i === points.length - 1) {
      currentSpeed = "---";
    }

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

          if (points[j].actionsYesOrNo === 1) {
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

          if (points[j].actionsYesOrNo === 1) {
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
        if (facing === "up") {
          var angle = 0;
        } else {
          var angle = 90;
        }
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

        if (points[j].actionsYesOrNo === 1) {
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
  if (pointB.direction === "forwards") {
    colorLine(canvasContext, pointA, pointB, "#831100", 7);
    colorLine(canvasContext, pointA, pointB, "#FF2600", 3);
  } else if (pointB.direction === "alignment") {
    colorLine(canvasContext, pointA, pointB, "#188B08", 7);
    colorLine(canvasContext, pointA, pointB, "#00cd00", 3);
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
  var x = event.x;
  var y = event.y;

  x -= canvasDivisor.offsetLeft + 64 + 1.5;
  y -= canvasDivisor.offsetTop + 85 + 16 - 3;

  var speed = document.getElementById("speed").value;

  if (event.shiftKey) {
    points.push({
      coordinates: [x, y],
      direction: "backwards",
      type: "waypoint",
      actionsYesOrNo: 0,
      speedOfLine: speed
    });
  } else {
    points.push({
      coordinates: [x, y],
      direction: "forwards",
      type: "waypoint",
      actionsYesOrNo: 0,
      speedOfLine: speed
    });
  }

  redraw(ctx, img, points);
  addLiElement(
    "orderedList",
    Math.round(x / 3.386),
    Math.round((y / 3.386) * -1 + 114.29)
  );
  redoList = [];
  generateLists(points, speed);
  update(points, redoList);
}

function undoButton(ctx, img, points, redoActionList) {
  const point = points[points.length - 1];
  var ol = document.getElementById("orderedList");
  var liToKill = ol.childNodes[points.length - 1];

  if (point.actionsYesOrNo === 1) {
    redoList.push({ type: "emptyAction" });
    points[points.length - 1].actionsYesOrNo = 0;
    var childElementCount = liToKill.childElementCount;
    var ulToKill = liToKill.lastChild;
    ulToKill.firstChild.remove();
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
  points = [];
  redoList = [];
  textBox = "";
  document.getElementById("x_coord").value = "";
  document.getElementById("y_coord").value = "";
  document.getElementById("add_point").setAttribute("disabled", true);
  update(points, redoList);
}

function update(points, redoList) {
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

    if (directionalIntersections.length < 1) {
      document.getElementById("squaring").setAttribute("disabled", "");
    } else {
      document.getElementById("squaring").removeAttribute("disabled");
    }
  }
  generateEstimate();
  if (points.length === 0) {
    document.getElementById("alignButton").setAttribute("disabled", "");
  } else {
    document.getElementById("alignButton").removeAttribute("disabled");
  }

  if (points.length === 0) {
    document.getElementById("Undo").setAttribute("disabled", "");
  } else {
    document.getElementById("Undo").removeAttribute("disabled");
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
    (points.length > 0 && points[points.length - 1].actionsYesOrNo === 1) ||
    points.length === 0
  ) {
    document.getElementById("addAction").setAttribute("disabled", "");
  } else {
    document.getElementById("addAction").removeAttribute("disabled");
  }
  if (points.length === 0) {
    document.getElementById("create").setAttribute("disabled", "");
  } else {
    document.getElementById("create").removeAttribute("disabled", "");
  }
  addSpeedToList(points);
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
  } else {
    points.push(current);
    addLiElement(
      "orderedList",
      Math.round(current.coordinates[0] / 3.386),
      Math.round((current.coordinates[1] / 3.386) * -1 + 114.29)
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
        actionsYesOrNo: 2,
        speedOfLine: document.querySelector("#speed").value
      });
    }
    if (shift === 2) {
      points.push({
        coordinates: [Math.round(3.386 * x), Math.round(387 - 3.386 * y)],
        direction: "backwards",
        type: "waypoint",
        actionsYesOrNo: 0,
        speedOfLine: document.querySelector("#speed").value
      });
    } else if (shift === undefined) {
      points.push({
        coordinates: [Math.round(3.386 * x), Math.round(387 - 3.386 * y)],
        direction: "forwards",
        type: "waypoint",
        actionsYesOrNo: 0,
        speedOfLine: document.querySelector("#speed").value
      });
    }
    addLiElement("orderedList", x, y);
    redraw(ctx, img, points);
    redoList = [];

    document.querySelector("#x_coord").value = "";
    document.querySelector("#y_coord").value = "";
    document.querySelector("#add_point").setAttribute("disabled", true);
    update(points, redoList);
  }
  generateEstimate();
  generateLists(points, speed);
}

function coordCheck() {
  x = document.getElementById("x_coord").value;
  y = document.getElementById("y_coord").value;

  if (x == "" || y == "") {
    document.getElementById("add_point").setAttribute("disabled", "");
    document.getElementById("y_coord").setAttribute("class", "add-point-error");
    document.getElementById("x_coord").setAttribute("class", "add-point-error");
  } else {
    if (x <= 236 && y <= 114) {
      if (x >= 0 && y >= 0) {
        document.getElementById("add_point").removeAttribute("disabled");
        document.getElementById("y_coord").setAttribute("class", "input_box");
        document.getElementById("x_coord").setAttribute("class", "input_box");
      }
    } else {
      document.getElementById("add_point").setAttribute("disabled", "");
      document
        .getElementById("y_coord")
        .setAttribute("class", "add-point-error");
      document
        .getElementById("x_coord")
        .setAttribute("class", "add-point-error");
    }
  }
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
