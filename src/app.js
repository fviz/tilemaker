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

    return coordinates;
}

function generateLinearRing(coordinates) {
    let linearRingArray = [...coordinates];
    linearRingArray.push(linearRingArray[0]);
    let linearRing = factory.createLinearRing(linearRingArray);
    return linearRing;
}

const sketch = p5 => {

    let initialShape = generateSquare(10, 10, 400);

    p5.setup = () => {
        p5.createCanvas(800, 600);
        p5.background(0);
        p5.stroke(255);
        p5.fill(255, 20);
    };

    p5.draw = () => {

        let mainGeometry = factory.createPolygon(generateLinearRing(initialShape));

        p5.background(0);

        let mouseGeometry = factory.createPoint(new Coordinate(p5.mouseX, p5.mouseY));

        p5.beginShape(p5.TRIANGLE_STRIP);
        console.log(mainGeometry);
        let coordinates = mainGeometry._shell._points._coordinates;
        for (let i = 0; i < coordinates.length; i++) {
            let c = coordinates[i];
            p5.vertex(c.x, c.y);
        }
        p5.endShape();
        p5.ellipse(p5.mouseX, p5.mouseY, 5);

        let distanceOperator = new DistanceOp(mouseGeometry, mainGeometry);
        let distance = distanceOperator.distance();
        let nearestPoints = distanceOperator.nearestPoints();
        p5.ellipse(nearestPoints[1].x, nearestPoints[1].y, 10);

        // p5.ellipse(c.x, c.y, 150, 150);
    }

    p5.mousePressed = () => {
        let newCoordinate = new Coordinate(p5.mouseX, p5.mouseY);
        initialShape.push(newCoordinate);
    }

}

new p5(sketch);
