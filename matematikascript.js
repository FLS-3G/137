var start = 0;
var points = [];
var lengths = [];
var vectorAngles = [];
var angles = [];
var vectors = [];

function calculateLength(pointA, pointB) {
  var xdistance = pointB[0] - pointA[0];
  var ydistance = pointB[1] - pointA[1];
  var length = Math.sqrt(xdistance ** 2 + ydistance ** 2);
  return length;
}

function calculateLengths(point_s) {
  for (var i = 0; i < point_s.length - 1; i++) {
    lengths.push(
      calculateLength(point_s[i].coordinates, point_s[i + 1].coordinates)
    );
  }
}

function vectorize(points) {
  for (var i = 0; i < points.length - 1; i++) {
    vectors.push([
      points[i + 1].coordinates[0] - points[i].coordinates[0],
      points[i + 1].coordinates[1] - points[i].coordinates[1]
    ]);
  }
}

function calculateInitialAngle(firstPoint, secondPoint) {
  var vec = [secondPoint[0] - firstPoint[0], secondPoint[1] - firstPoint[1]];
  if (document.getElementById("startValue").value == "right") {
    start =
      Math.PI / 2 - Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2));
  } else {
    start =
      Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) - Math.PI / 2;
  }
}

function calculateAngles(vectors) {
  for (var i = 0; i < vectors.length - 1; i++) {
    const angle = calculateAngle(vectors[i], vectors[i + 1], i);
    vectorAngles.push(angle);
  }
}

function calculateAngle(vectorA, vectorB, pointNumber) {
  console.log(pointNumber);
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
    angles.push(finalAngle);
    return finalAngle;
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
    angles.push(finalAngle);
    return finalAngle;
  }
}

function generateLists(points, vectors) {
  calculateLengths(points);
  vectorize(points);
  calculateAngles(vectors);
}

var points = [
  { coordinates: [0, 0], direction: "forwards" },
  { coordinates: [2, 2], direction: "forwards" },
  { coordinates: [2, 1], direction: "backwards" }
];
generateLists();
console.log(lenghts, angles);

/*function onSubmit(event) {
  event.preventDefault();
  j += 1;

  x = document.getElementById("x1").value;
  y = document.getElementById("y1").value;

  document.getElementById("x1").value = "";
  document.getElementById("y1").value = "";

  points.push({
    coordinates: [x, y],
    direction: document.getElementById("direction").value
  });

  generateLists(points, vectors);

  if (j == 2) {
    calculateInitialAngle(points[0].coordinates, points[1].coordinates);
    var node1 = document.createElement("li");
    var textnode1 = document.createTextNode((start / Math.PI) * 180);
    node1.appendChild(textnode1);
    document.getElementById("list").appendChild(node1);

    var node3 = document.createElement("li");
    var textnode3 = document.createTextNode(lengths[lengths.length - 1]);
    node3.appendChild(textnode3);
    document.getElementById("list").appendChild(node3);
  }
  if (j > 2) {
    var node2 = document.createElement("li");
    var textnode2 = document.createTextNode(
      (angles[angles.length - 1] / Math.PI) * -180
    );
    node2.appendChild(textnode2);
    document.getElementById("list").appendChild(node2);

    var node3 = document.createElement("li");
    var textnode3 = document.createTextNode(lengths[lengths.length - 1]);
    node3.appendChild(textnode3);
    document.getElementById("list").appendChild(node3);
  }
  vectors = [];
  angles = [];
  vectorAngles = [];
}
document.getElementById("x1").value = "";
document.getElementById("y1").value = "";
document.querySelector("form").onsubmit = onSubmit;*/
