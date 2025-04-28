function parseInput(input) {
    return input.trim().split("\n").map(p => {
        const [x, y] = p.split(" ").map(Number);
        return { X: offsetX + x * scale, Y: offsetY - y * scale };
    });
}
function pointInPolygon(point, polygon) {
    let count = 0;
    for (let i = 0; i < polygon.length; i++) {
        let a = polygon[i];
        let b = polygon[(i + 1) % polygon.length];
        if ((a.Y > point.Y) !== (b.Y > point.Y)) {
            let t = (point.Y - a.Y) / (b.Y - a.Y);
            let x = a.X + t * (b.X - a.X);
            if (x > point.X) count++;
        }
    }
    return count % 2 === 1;
}
function isOrthogonalPolygon(points) {
    for (let i = 0; i < points.length; i++) {
        let { X: x1, Y: y1 } = points[i];
        let { X: x2, Y: y2 } = points[(i + 1) % points.length];
        if (x1 !== x2 && y1 !== y2) return false;
    }
    return true;
}

function hasSelfIntersections(points) {
    function doLinesIntersect(p1, p2, p3, p4) {
        function ccw(a, b, c) {
            return (c.Y - a.Y) * (b.X - a.X) > (b.Y - a.Y) * (c.X - a.X);
        }
        return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
    }

    for (let i = 0; i < points.length; i++) {
        let p1 = points[i];
        let p2 = points[(i + 1) % points.length];

        for (let j = i + 2; j < points.length - (i === 0 ? 1 : 0); j++) {
            let p3 = points[j];
            let p4 = points[(j + 1) % points.length];

            if (doLinesIntersect(p1, p2, p3, p4)) {
                return true;
            }
        }
    }
    return false;
}

function drawPolygon(ctx, points, color, fill) {
    if (!points.length) return;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(points[0].X, points[0].Y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].X, points[i].Y);
    }
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3; 
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    ctx.stroke();


    const simplePoints = points.map(p => ({ x: p.X, y: p.Y }));

    let messages = [];
    if (!isOrthogonalPolygon(simplePoints)) {
        messages.push("Многоугольник не ортогональный.");
    }
    if (hasSelfIntersections(simplePoints)) {
        messages.push("Многоугольник имеет самопересечения.");
    }

    // Вывод сообщений
    const msgElement = document.getElementById("message");
    msgElement.textContent = messages.length ? messages.join(" ") : "";
}


function showIntersection() {
    drawOverlay("green", getIntersection);
}

function showUnion() {
    drawOverlay("blue", getUnion);
}

function showDifference() {
    drawOverlay("red", getDifference);
}


function fillMaskFromPolygon(mask, polygon) {
    let path = new Path2D();
    path.moveTo(polygon[0].X, polygon[0].Y);
    for (let i = 1; i < polygon.length; i++) {
        path.lineTo(polygon[i].X, polygon[i].Y);
    }
    path.closePath();

    const W = canvas.width;
    const H = canvas.height;

    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            if (ctx.isPointInPath(path, x, y)) {
                mask[y][x] = 1;
            }
        }
    }
}


function getIntersection(poly1, poly2) {
    let [mask1, W, H] = createMaskFromPolygon(poly1);
    let [mask2] = createMaskFromPolygon(poly2, W, H);

    let result = [];
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            if (mask1[y][x] && mask2[y][x]) result.push({ x, y });
        }
    }
    return result;
}


function getUnion(poly1, poly2) {
    let [mask1, W, H] = createMaskFromPolygon(poly1);
    let [mask2] = createMaskFromPolygon(poly2, W, H);

    let result = [];
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            if (mask1[y][x] || mask2[y][x]) result.push({ x, y });
        }
    }
    return result;
}

function getDifference(poly1, poly2) {
    let [mask1, W, H] = createMaskFromPolygon(poly1);
    let [mask2] = createMaskFromPolygon(poly2, W, H);

    let result = [];
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            if (mask1[y][x] && !mask2[y][x]) result.push({ x, y });
        }
    }
    return result;
}
function createMaskFromPolygon(polygon, W = canvas.width, H = canvas.height) {
    let mask = Array(H).fill(0).map(() => Array(W).fill(0));

    let path = new Path2D();
    path.moveTo(polygon[0].X, polygon[0].Y);
    for (let i = 1; i < polygon.length; i++) {
        path.lineTo(polygon[i].X, polygon[i].Y);
    }
    path.closePath();

    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            if (ctx.isPointInPath(path, x, y)) {
                mask[y][x] = 1;
            }
        }
    }
    return [mask, W, H];
}

function drawOverlay(color, operation) {
    let poly1 = parseInput(document.getElementById("polygon1").value);
    let poly2 = parseInput(document.getElementById("polygon2").value);
    let resultPixels = operation(poly1, poly2);

    for (let pt of resultPixels) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(pt.x, pt.y, 1, 1);
    }
    ctx.globalAlpha = 1;
}

function lineIntersection(p1, p2, p3, p4) {
    let denom = (p1.X - p2.X) * (p3.Y - p4.Y) - (p1.Y - p2.Y) * (p3.X - p4.X);
    if (denom === 0) return null;

    let intersectX = ((p1.X * p2.Y - p1.Y * p2.X) * (p3.X - p4.X) - (p1.X - p2.X) * (p3.X * p4.Y - p3.Y * p4.X)) / denom;
    let intersectY = ((p1.X * p2.Y - p1.Y * p2.X) * (p3.Y - p4.Y) - (p1.Y - p2.Y) * (p3.X * p4.Y - p3.Y * p4.X)) / denom;

    return { X: intersectX, Y: intersectY };
}



function drawPolygons() {
    let poly1 = parseInput(document.getElementById("polygon1").value);
    let poly2 = parseInput(document.getElementById("polygon2").value);

    drawPolygon(ctx, poly1, "black", false);
    drawPolygon(ctx, poly2, "black", false);
}
