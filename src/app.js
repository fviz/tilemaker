import p5 from 'p5'
import {Coordinate} from "jsts/org/locationtech/jts/geom";
import GeometryFactory from "jsts/org/locationtech/jts/geom/GeometryFactory";
import DistanceOp from "jsts/org/locationtech/jts/operation/distance/DistanceOp";

const factory = new GeometryFactory();

function generateRandomCoordinate() {
    let newCoordinate = new Coordinate(Math.random() * 400, Math.random() * 400);
    return newCoordinate;
}

function generateSquare(x, y, size) {
    let coordinates = [];
    coordinates.push(new Coordinate(x, y));
    coordinates.push(new Coordinate(x+size, y));
    coordinates.push(new Coordinate(x+size, y+size));
    coordinates.push(new Coordinate(x, y+size));
    console.log(coordinates);
      return coordinates;
}

function generateLinearRing(coordinates) {
    let linearRingArray = [...coordinates];
    console.log(linearRingArray);
    linearRingArray.push(linearRingArray[0]);
    let linearRing = factory.createLinearRing(linearRingArray);
    return linearRing;
}

const sketch = p5 => {

    let shape = generateLinearRing(generateSquare(10, 10, 400));
    let mainGeometry = factory.createPolygon(shape);

    p5.setup = () => {
        p5.createCanvas(800, 600);
        p5.background(0);
        p5.stroke(p5.random()*255);
        p5.fill(p5.random()*255);


    };

    p5.draw = () => {

        let mouseGeometry = factory.createPoint(new Coordinate(p5.mouseX, p5.mouseY));

        p5.beginShape(p5.POLYGON);
        let coordinates = shape._points._coordinates;
        for (let i = 0; i < coordinates.length; i++) {
            let c = coordinates[i];
            p5.vertex(c.x, c.y);
        }
        p5.endShape();
        p5.ellipse(p5.mouseX, p5.mouseY, 5);

        let distanceOperator = new DistanceOp(mouseGeometry, mainGeometry);
        let distance = distanceOperator.distance();
        let nearestPoints = distanceOperator.nearestPoints();
        console.log(nearestPoints);
        p5.line(nearestPoints[0].x, nearestPoints[0].y, nearestPoints[1].x, nearestPoints[1].y);

        // p5.ellipse(c.x, c.y, 150, 150);
    }

}

new p5(sketch);