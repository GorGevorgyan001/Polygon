class Polygon {
    constructor(...points) {
        if (points.length < 2) return;
        this.points = points;
    }
    draw(ctx, strokeStyle = "red") {
        ctx.strokeStyle = strokeStyle;
        ctx.beginPath();
        ctx.moveTo(this.points[0].cx, this.points[0].cy);
        console.log(this.points)
        for (let i = 1; i < this.points.length; i++) {

            ctx.lineTo(this.points[i].cx, this.points[i].cy);
        }

        ctx.closePath();
        ctx.stroke();
        // ctx.fill();
    }


}

class OrhogonlPolygon extends Polygon {
    constructor(...points) {
        super(...points);
        if (points.length < 3) throw Error("Անբավարար թվով կետեր");
        if (!isOrthogonalPolygon(points)) throw Error("Օրթոգոնալ չէ");
        if (hasSelfIntersections(points)) throw Error("Ունի ինքնահատում");
    }
    calculateArea() {
        let area = 0;
        for (let i = 0; i < this.points.length; i++) {
            let { x: x1, y: y1 } = this.points[i];
            let { x: x2, y: y2 } = this.points[(i + 1) % this.points.length];
            area += x1 * y2 - x2 * y1;
        }
        return Math.abs(area / 2);
    }
    calculatePerimeter() {
        let perimeter = 0;
        for (let i = 0; i < this.points.length; i++) {
            let { x: x1, y: y1 } = this.points[i];
            let { x: x2, y: y2 } = this.points[(i + 1) % this.points.length];
            perimeter += Math.abs(x1 - x2) + Math.abs(y1 - y2);
        }
        return perimeter;
    }
   
}


function isOrthogonalPolygon(points) {
    for (let i = 0; i < points.length; i++) {
        let { x: x1, y: y1 } = points[i];
        let { x: x2, y: y2 } = points[(i + 1) % points.length];
        if (x1 !== x2 && y1 !== y2) return false;
    }
    return true;
}
// function ccw(a, b, c) {
//     return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
// }

function hasSelfIntersections(points) {
    function doLinesIntersect(p1, p2, p3, p4) {
        function ccw(a, b, c) {
            return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
        }
        return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
    }

    for (let i = 0; i < points.length; i++) {
        let p1 = points[i];
        let p2 = points[(i + 1) % points.length];

        for (let j = i + 2; j < points.length - (i === 0 ? 1 : 0); j++) { // որպեսզի չստուգվեն առաջի և վերջի կողերը նույնպես հարևան են, յ-ն էլ հարևանը բաց է թողնում i+2 սկսելով
            let p3 = points[j];
            let p4 = points[(j + 1) % points.length];

            if (doLinesIntersect(p1, p2, p3, p4)) {
                return true;
            }
        }
    }
    return false;
}