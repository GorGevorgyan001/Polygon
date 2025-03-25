class Polygon {
    constructor(...points) {
        if (points.length < 2) return;
        this.points = points;
    }
    draw(ctx, strokeStyle="red", fillStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle=fillStyle;
        ctx.beginPath();
        ctx.moveTo(this.points[0].cx, this.points[0].cy);
        console.log(this.points)
        for (let i = 1; i < this.points.length; i++) {

            ctx.lineTo(this.points[i].cx, this.points[i].cy);
        }
        
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
    

}

class OrhogonlPolygon extends Polygon {
    constructor(...points) {
        super(...points);
        if(points.length < 3) throw Error("Անբավարար թվով կետեր");
        if(!isOrthogonalPolygon(points)) throw Error("Օրթոգոնալ չէ");
        if(hasSelfIntersections(points)) throw Error("Ունի ինքնահատում");
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
    union(b){
        // let newPoints=[];
        // let newPolygon = new OrhogonlPolygon(...newPoints);
        // return newPolygon;
        if (isPolygonInside(this, b)) return new OrhogonlPolygon(...this.points);
        if (isPolygonInside(b, this)) return new OrhogonlPolygon(...b.points);
        let allEdges = [...getEdges(this.points), ...getEdges(b.points)];
        let mergedEdges = mergeEdges(allEdges);
        let newPoints = reconstructPolygon(mergedEdges);

        return new OrhogonlPolygon(...newPoints);
    }
}

function isPolygonInside(big, small) {
    return small.points.every(p => isPointInsidePolygon(big.points, p));
}

function isPointInsidePolygon(polygon, point) {
    let crossings = 0;
    for (let i = 0; i < polygon.length; i++) {
        let p1 = polygon[i];
        let p2 = polygon[(i + 1) % polygon.length];

        if ((p1.y > point.y) !== (p2.y > point.y)) {
            let xCross = p1.x + ((point.y - p1.y) / (p2.y - p1.y)) * (p2.x - p1.x);
            if (xCross > point.x) crossings++;
        }
    }
    return crossings % 2 !== 0;
}

function getEdges(points) {
    let edges = [];
    for (let i = 0; i < points.length; i++) {
        let p1 = points[i];
        let p2 = points[(i + 1) % points.length];
        edges.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    }
    return edges;
}

function mergeEdges(edges) {
    let horizontal = [];
    let vertical = [];

    for (let edge of edges) {
        if (edge.y1 === edge.y2) horizontal.push(edge);
        else vertical.push(edge);
    }

    horizontal.sort((a, b) => a.y1 - b.y1 || a.x1 - b.x1);
    vertical.sort((a, b) => a.x1 - b.x1 || a.y1 - b.y1);

    return [...mergeSegments(horizontal), ...mergeSegments(vertical)];
}

function mergeSegments(segments) {
    let merged = [];
    for (let s of segments) {
        if (merged.length > 0) {
            let last = merged[merged.length - 1];
            if (last.x2 === s.x1 && last.y1 === s.y1 && last.y2 === s.y2) {
                last.x2 = s.x2;
                last.y2 = s.y2;
                continue;
            }
        }
        merged.push(s);
    }
    return merged;
}

function reconstructPolygon(edges) {
    let points = [];
    let start = edges[0];
    let current = start;
    do {
        points.push({ x: current.x1, y: current.y1 });
        let next = edges.find(e => e.x1 === current.x2 && e.y1 === current.y2);
        current = next || start;
    } while (current !== start);

    return points;
}


function isOrthogonalPolygon(points) {
    for (let i = 0; i < points.length; i++) {
        let { x: x1, y: y1 } = points[i];
        let { x: x2, y: y2 } = points[(i + 1) % points.length];
        if (x1 !== x2 && y1 !== y2) return false;
    }
    return true;
}
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


