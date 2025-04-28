class Point 
{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.cx=x*scale+offsetX;
        this.cy=-y*scale+offsetY;
    }
    draw(ctx, color = "red") {
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}
function isPointInPolygon(point, poly) {
    let inside = false;
    let points = poly.points
    let j = points.length - 1;   // это индекс последней вершины многоугольника (для работы с последним ребром).
    for (let i = 0; i < points.length; i++) {
        let xi = points[i].x, yi = points[i].y;
        let xj = points[j].x, yj = points[j].y;
        if ((yi > point.y) !== (yj > point.y) &&
            point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi) {
            inside = !inside;
        }
        j = i;
    }
    return inside;
}



