function calculateTotalDistance(lengths) {
  var totalDistance = 0;
  for (var i = 0; i < lengths.length; i++) {
    totalDistance += Math.abs(lengths[i]);
  }
  return totalDistance;
}

function calculateLength(pointA, pointB) {
  var xdistance = pointB[0] - pointA[0];
  var ydistance = pointB[1] - pointA[1];
  var length = Math.sqrt(xdistance ** 2 + ydistance ** 2);
  return length;
}

function calculateLengths(points) {
  var lengths = [];
  for (var i = 0; i < points.length - 1; i++) {
    if (points[i + 1].direction === "forwards") {
      lengths.push(
        calculateLength(points[i].coordinates, points[i + 1].coordinates)
      );
    } else {
      lengths.push(
        -calculateLength(points[i].coordinates, points[i + 1].coordinates)
      );
    }
  }

  return lengths;
}

function vectorize(points) {
  var vectors = [];
  for (var i = 0; i < points.length - 1; i++) {
    vectors.push([
      points[i + 1].coordinates[0] - points[i].coordinates[0],
      points[i + 1].coordinates[1] - points[i].coordinates[1]
    ]);
  }
  var indexes = [];
  for (var i = 0; i < points.length; i++) {
    if (points[i].direction === "alignment") {
      indexes.push(i);
    }
  }

  for (var k = 0; k < indexes.length; k++) {
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

    var robotCoord1 = points[indexes[k] - 1].coordinates;
    var robotCoord2 = points[indexes[k] - 2].coordinates;

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
    //here is thyne problem

    //lmo
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
    if (points[indexes[k] - 1].direction === "backwards") {
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
      var lineSlope = [];
    } else {
      var lineSlope = directionalIntersections[rememberI].function;
    }
    if (points) var oppositeSlope = 0;
    if (
      lineSlope[0] === 0 &&
      directionalIntersections[rememberI].coordinates[0][1] < robotCoord1[1]
    ) {
      oppositeSlope = 1000000;
    } else if (
      lineSlope[0] === 0 &&
      directionalIntersections[rememberI].coordinates[0][1] > robotCoord1[1]
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
        var xNew1 = 1;
        var xNew2 = 0;
      } else {
        var xNew1 = -1;
        var xNew2 = 0;
      }
    } else {
      if (
        Math.round((robotCoord1[1] / 3.386) * -1 + 114.29) >
        lineSlope[0] * Math.round(robotCoord1[0] / 3.386) + lineSlope[1]
      ) {
        var xNew1 = 1;
        var xNew2 = 0;
      } else {
        var xNew1 = -1;
        var xNew2 = 0;
      }
    }

    var yNew1 = xNew1 * oppositeSlope;
    var yNew2 = xNew2 * oppositeSlope;

    deltaX = xNew2 - xNew1;
    deltaY = yNew2 - yNew1;

    if (points.length > indexes[k] + 1) {
      if (points[indexes[k] + 1].direction === "forwards") {
        if (lineSlope[0] === 1000000 || lineSlope[0] === 0) {
          var newVector = [deltaX, deltaY];
        } else {
          var newVector = [deltaX, -1 * deltaY];
        }
      } else {
        if (lineSlope[0] === 1000000 || lineSlope[0] === 0) {
          var newVector = [deltaX * -1, deltaY * -1];
        } else {
          var newVector = [deltaX * -1, deltaY];
        }
      }
    } else {
      if (lineSlope[0] === 1000000 || lineSlope[0] === 0) {
        var newVector = [deltaX, deltaY];
      } else {
        var newVector = [deltaX, -1 * deltaY];
      }
    }

    vectors.splice(indexes[k] - 1, 1, newVector);
  }

  return vectors;
}

function calculateInitialAngle(points, facing) {
  var firstAngle = Number(document.getElementById("textboxAngle").value);
  const checkForDirection = points[1].direction;
  const firstPoint = points[0].coordinates;
  const secondPoint = points[1].coordinates;
  const vec = [secondPoint[0] - firstPoint[0], secondPoint[1] - firstPoint[1]];
  if (checkForDirection === "forwards") {
    if (facing === "right") {
      if (vec[1] <= 0) {
        start = Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2));
      } else {
        start = Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) * -1;
      }
    } else {
      if (vec[1] <= 0) {
        start =
          Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) -
          Math.PI / 2;
      } else {
        if (vec[0] > 0) {
          start =
            (Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) +
              Math.PI / 2) *
            -1;
        } else {
          start =
            (Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) +
              Math.PI / 2 -
              Math.PI * 2) *
            -1;
        }
      }
    }
    return ((start * 180) / Math.PI) * -1 + firstAngle;
    
  } else if (checkForDirection === "backwards") {
    if (facing === "right") {
      if (vec[1] <= 0) {
        start = Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2));
        if (vec[0] <= 0) {
          start = start - Math.PI;
        } else {
          start = start - Math.PI;
        }
      } else {
        start = Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) * -1;
        if (vec[0] <= 0) {
          start = start + Math.PI;
        } else {
          start = start + Math.PI;
        }
      }
    } else {
      if (vec[1] <= 0) {
        if (vec[0] <= 0) {
          start =
            Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) -
            Math.PI / 2 -
            Math.PI;
        } else {
          start =
            Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) -
            Math.PI / 2 +
            Math.PI;
        }
      } else {
        if (vec[0] <= 0) {
          start =
            (Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) -
              Math.PI / 2) *
            -1;
        } else {
          start =
            (Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) -
              Math.PI / 2) *
            -1;
        }
      }
    }

    return ((start * 180) / Math.PI) * -1;
  }
  console.warn("Invalid checkForDirection yo! Pls fix! ");
}

function calculateAngles(vectors, points, facing) {
  var angles = [];
  if (points.length > 1) {
    initialAngle = calculateInitialAngle(points, facing);
    angles = [initialAngle];
    for (var i = 0; i < vectors.length - 1; i++) {
      var angle = calculateAngle(vectors[i], vectors[i + 1], points, i + 1);
      angles.push(angle);
    }
  }
  return angles.map(item => item * -1);
}

function calculateAngle(vectorA, vectorB, points, pointNumber) {
  if (points[pointNumber].direction === points[pointNumber + 1].direction) {
    if (vectorA[1] < 0) {
      vectorAngle1 =
        2 * Math.PI -
        Math.acos(vectorA[0] / Math.sqrt(vectorA[0] ** 2 + vectorA[1] ** 2));
    } else {
      vectorAngle1 = Math.acos(
        vectorA[0] / Math.sqrt(vectorA[0] ** 2 + vectorA[1] ** 2)
      );
    }
    if (vectorB[1] < 0) {
      vectorAngle2 =
        2 * Math.PI -
        Math.acos(vectorB[0] / Math.sqrt(vectorB[0] ** 2 + vectorB[1] ** 2));
    } else {
      vectorAngle2 = Math.acos(
        vectorB[0] / Math.sqrt(vectorB[0] ** 2 + vectorB[1] ** 2)
      );
    }
    var finalAngle = vectorAngle2 - vectorAngle1;
    if (Math.abs(finalAngle) > Math.PI) {
      if (finalAngle > 0) {
        finalAngle -= 2 * Math.PI;
      } else {
        finalAngle += 2 * Math.PI;
      }
    }
  } else {
    vectorB[0] = -vectorB[0];
    vectorB[1] = -vectorB[1];
    if (vectorA[1] < 0) {
      vectorAngle1 =
        2 * Math.PI -
        Math.acos(vectorA[0] / Math.sqrt(vectorA[0] ** 2 + vectorA[1] ** 2));
    } else {
      vectorAngle1 = Math.acos(
        vectorA[0] / Math.sqrt(vectorA[0] ** 2 + vectorA[1] ** 2)
      );
    }
    if (vectorB[1] < 0) {
      vectorAngle2 =
        2 * Math.PI -
        Math.acos(vectorB[0] / Math.sqrt(vectorB[0] ** 2 + vectorB[1] ** 2));
    } else {
      vectorAngle2 = Math.acos(
        vectorB[0] / Math.sqrt(vectorB[0] ** 2 + vectorB[1] ** 2)
      );
    }
    var finalAngle = vectorAngle2 - vectorAngle1;
    if (Math.abs(finalAngle) > Math.PI) {
      if (finalAngle > 0) {
        finalAngle -= 2 * Math.PI;
      } else {
        finalAngle += 2 * Math.PI;
      }
    }
    vectorB[0] = -vectorB[0];
    vectorB[1] = -vectorB[1];
  }
  finalAngle = (finalAngle * 180) / Math.PI;
  return finalAngle;
}

function redefineLastSpeed() {
  if (document.getElementById("speed").value !== "") {
    if (points.length > 1) {
      points[points.length - 2].speedOfLine = document.getElementById(
        "speed"
      ).value;
      points[points.length - 1].speedOfLine = document.getElementById(
        "speed"
      ).value;
      update(points, redoList);
      generateEstimate();
    }
    if (points.length > 1) {
      points[points.length - 2].speedOfTurn = document.getElementById(
        "angeleSpeed"
      ).value;
      points[points.length - 1].speedOfTurn = document.getElementById(
        "angeleSpeed"
      ).value;
      
      update(points, redoList);
  }}
}


function generateEstimate() {
  var wheelSize = document.getElementById("wheelSize").value;
  var speed = document.getElementById("speed").value;

  wheelSize = document.getElementById("wheelSize").value;
  speed = document.getElementById("speed").value;

  lengths = calculateLengths(points);

  if (wheelSize === "" || speed === "") {
    var wrongParams = 1;
    document
      .getElementById("wheelSize")
      .setAttribute("class", "add-point-error");
    document.getElementById("speed").setAttribute("class", "add-point-error");
  } else {
    if (wheelSize >= 1 && speed >= 1) {
      var wrongParams = 0;
      document.getElementById("wheelSize").setAttribute("class", "input_box");
      document.getElementById("speed").setAttribute("class", "input_box");
    } else {
      var wrongParams = 1;
      document
        .getElementById("wheelSize")
        .setAttribute("class", "add-point-error");
      document.getElementById("speed").setAttribute("class", "add-point-error");
    }
  }
  if (wrongParams === 1) {
    var time = "Wrong Parameters";
  } else {
    if (points.length <= 1) {
      var time = 0;
    } else {
      var timeForLine = 0;
      for (var i = 0; i < lengths.length; i++) {
        if (points[i].speedOfLine >= 80) {
          var rot = 2.24;
        } else {
          var rot = 0.027625 * points[i].speedOfLine;
        }

        timeForLine += Math.round(
          Math.abs(lengths[i]) / 3.386 / (wheelSize * Math.PI * rot)
        );
      }
      var time = `${timeForLine}s`;
    }
  }
  document.getElementById("time_estimate").innerHTML = time;
}

const ln = String.fromCharCode(13);

function actionWhileMoving(id){
  return `${id}${ln}`
}
function action(id) {
  return `3${ln}${id}${ln}`;
}

function movement(angle, turnSpeed, distance, speed) {
  return `2${ln}${angle}${ln}${turnSpeed}${ln}${distance}${ln}${speed}${ln}`;
}

function alignment(speed) {
  return `4${ln}${speed}${ln}`;
}

function makeTextBox(points, wheelSize, angles, speedOfLine) {
  var axleLength = document.getElementById("axleLength").value;
  var numberOfMovements = 1;
  var listForGeneration = points;

  if (points.length > 0) {
    numberOfMovements = points.length - 1;
    for (i = 0; i < points.length; i++) {
      if (points[i].actionsYesOrNo === 1) {
        numberOfMovements = numberOfMovements + 1;
      }
    }
  } else {
    var numberOfMovements = 0;
  }

  var textBox = "";
  textBox += wheelSize;
  textBox += ln;
  textBox += axleLength;
  textBox += ln;
  textBox += motorsCheck();
  textBox += ln;
  textBox += numberOfMovements;
  textBox += ln;

  let action_id = 0;
  let actionWhileMoving_id = 0;
  var counter = 0;
  var listOfSpeeds = [];
  for (i = 0; i < listForGeneration.length - 1; i++) {
    listOfSpeeds.push(listForGeneration[i].speedOfLine);
  }

  //---------------------------------------------
  if (listForGeneration[0].actionsYesOrNo === 1 || listForGeneration[0].actionsYesOrNo === 3) {
    textBox += action(++action_id);
  }
  for (i = 1; i < listForGeneration.length; i++) {
    if (listForGeneration[i].direction !== "alignment") {
      textBox += movement(
        angles[i - 1],
        points[i].speedOfTurn,
        lengths[i - 1] / 3.386 / (wheelSize * Math.PI),
        points[i - 1].speedOfLine
      );
      if (listForGeneration[i-1].actionsYesOrNo === 2 || listForGeneration[i-1].actionsYesOrNo === 3) {
        textBox += actionWhileMoving(++actionWhileMoving_id);
      }
      else{textBox += `0${ln}`;}
      if (listForGeneration[i].actionsYesOrNo === 1 || listForGeneration[i].actionsYesOrNo === 3) {
        textBox += action(++action_id);
      }
    }
    if (listForGeneration[i].direction === "alignment") {
      textBox += alignment(points[i - 1].speedOfLine);
      if (listForGeneration[i].actionsYesOrNo === 1) {
        textBox += action(++action_id);
      }
    }
  }
  //----------------------------------------------------
  textBox +="^"
  for(var i = 0; i<points.length;i++){
    textBox +="x";
    textBox +=Math.round((points[i].coordinates[0]/ 3.386)*10)/10;
    textBox +="y";
    textBox +=Math.round(((points[i].coordinates[1] / 3.386) * -1 + 114.29)*10)/10;
    textBox +="d";
    var direction = points[i].direction;
    if(direction == "forwards"){
      direction = 0;
    }
    else if (direction == "backwards")
    {
      direction = 2;
    }
    else{
      direction = 1;
    }
    textBox +=direction;
    textBox +="t";
    textBox +=points[i].speedOfTurn;
    textBox +="a";
    textBox +=points[i].actionsYesOrNo;
    textBox +="s";
    textBox +=points[i].speedOfLine;
  }
  textBox +="x";
  textBox +="]";


  textBox = textBox.replace(/NaN/g, "0");

  return textBox + String.fromCharCode(10);
}

function makeTextFile(text) {
  var data = new Blob([text], { type: "text/rtf" });
  var textFile = null;

  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  return textFile;
}

function generateFile(points, wheelSize, facing, speedOfLine) {
  var anchor = document.createElement("a");
  anchor.setAttribute("id", "invisibleLink");
  anchor.setAttribute("download", "FLSFile.rtf");

  lengths = calculateLengths(points);
  vectors = vectorize(points);
  angles = calculateAngles(vectors, points, facing);
  const output = makeTextBox(points, wheelSize, angles, speedOfLine);

  anchor.href = makeTextFile(output);
  document.querySelector("body").appendChild(anchor);
}

function generateLists(points, speed) {
  lengths = calculateLengths(points);
  vectors = vectorize(points);
  angles = calculateAngles(vectors, points, facing);
  totalDistance = calculateTotalDistance(lengths);

  generateEstimate(speed);
}
