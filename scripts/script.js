function parsePoints(id) {
    let input = document.getElementById(id).value.trim();
    let lines = input.split("\n");
    let points = [];

    for (let line of lines) {
        let parts = line.trim().split(" ");
        if (parts.length !== 2) continue;
        let x = parseInt(parts[0], 10);
        let y = parseInt(parts[1], 10);
        if (isNaN(x) || isNaN(y)) continue;
        points.push(new Point(x, y));
    }
    return points;
}

let field = [];

function processPolygon() {
    let points = parsePoints("coordsInput");
    let message = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    try {
        let polygon = new OrhogonlPolygon(...points);
        field.push(polygon)
        let area = polygon.calculateArea();
        let perimeter = polygon.calculatePerimeter();
        message = `S= ${area}, P= ${perimeter}`;
    } catch (error) {
        let a = new Polygon(...points)
        field.push(a)
        message = error.message;

    }
    draw(ctx);
    document.getElementById("message").innerText = message;
}
function processPoly (){
    let points = parsePoints("coordsInputpoint");
    let message = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
        let polygon = new OrhogonlPolygon(...points);
        field.push(polygon)
    } catch (error) {
        let a = new Polygon(...points)
        field.push(a)
        message = error.message;

    }
    
    draw(ctx);
    
    document.getElementById("message").innerText = message;
}
function checkPoint() {
    let points = parsePoints("coordsInputpoint");
    let polygon = new OrhogonlPolygon(...points);
    const x = parseInt(document.getElementById("pointX").value);
    const y = parseInt(document.getElementById("pointY").value);
    if (isNaN(x) || isNaN(y)) {
        document.getElementById("result").innerText = "Ներմուծեք ճիշտ կոորդինատներ";
        return;
    }
    const point = new Point(x, y);
    const inside = isPointInPolygon(point, polygon);
    document.getElementById("message").innerText = inside
        ? "Կետը պատկանում է տիրույթին "
        : "Կետը չի պատկանում տիրույթին";
    draw(ctx);
    point.draw(ctx, inside ? "green" : "red");
    
}
function draw(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGridAndAxes(ctx);
    field.forEach(element => element.draw(ctx))
}
function checkSegment() {
    const x1 = parseInt(document.getElementById("segX1").value);
    const y1 = parseInt(document.getElementById("segY1").value);
    const x2 = parseInt(document.getElementById("segX2").value);
    const y2 = parseInt(document.getElementById("segY2").value);
     if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        document.getElementById("result").innerText = "Մուտքագրեք կոռեկտ տվյալներ";
        return;
    }
    let points = parsePoints("coordsInputpoint");
    let polygon = new OrhogonlPolygon(...points);
    const p1=new Point(x1,y1);
    const p2=new Point(x2,y2);
    const segment=new Segment(p1,p2);
    const resultText = Includes(segment, polygon);
    document.getElementById("message").innerText = resultText;
    draw(ctx);
    segment.draw(ctx);
}



