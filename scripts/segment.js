class Segment 
{
    constructor(p1,p2){
        this.p1=p1;
        this.p2=p2;
    }
    draw(ctx, color = "blue") {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.p1.cx, this.p1.cy); 
        ctx.lineTo(this.p2.cx, this.p2.cy);
        ctx.stroke();
    }
}

function doLinesIntersect(p1, p2, p3, p4) {
    function ccw(a, b, c) {
        return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
    }
    return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
}

function Includes(segment, poly) {
    const {p1,p2}=segment; // const p1= segment.p1; const p2=segment.p2
    const {points}=poly; // const points = poly.point;
    let insideStart = isPointInPolygon(p1, poly);
    let insideEnd = isPointInPolygon(p2, poly);
    let intersects = false;

    for (let i = 0; i < points.length; i++) {
        let next = (i + 1) % points.length;
        if (doLinesIntersect(p1, p2, points[i], points[next])) {
            intersects = true;
            break;
        }
    }

    if (insideStart && insideEnd && !intersects) {
        return "Հատվածը լրիվ ներսում է";
    }

    if (insideStart || insideEnd || intersects) {
        return "Հատվածը հատում է"; 
    }

    return "Հատվածը չի պատկանում";
}