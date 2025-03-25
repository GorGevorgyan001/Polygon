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

function processPolygon() {
    let points = parsePoints("coordsInput");
    let message = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGridAndAxes(ctx);
    try {
        let polygon = new OrhogonlPolygon(...points);
        polygon.draw(ctx);
        let area = polygon.calculateArea();
        let perimeter = polygon.calculatePerimeter();
        message = `S= ${area}, P= ${perimeter}`;
    } catch (error) {
        let a = new Polygon(...points)
        a.draw(ctx);
        message = error.message;

    }
    document.getElementById("message").innerText = message;
}
function processPolygons() {
    let points1 = parsePoints("coordsInput1");
    let points2 = parsePoints("coordsInput2");
    let message = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGridAndAxes(ctx);
    try {
        let nPolygon1 = new OrhogonlPolygon(...points1);
        let nPolygon2 = new OrhogonlPolygon(...points2);
        nPolygon1.draw(ctx);
        nPolygon2.draw(ctx, "black");
        let c=nPolygon1.union(nPolygon2);
        c.draw(ctx,'black','red');
    } catch (error) {
        let a = new Polygon(...points1);
        let b = new Polygon(...points2);
        a.draw(ctx);
        b.draw(ctx,"black");
        message = error.message;

    }
    document.getElementById("message").innerText = message;
}



