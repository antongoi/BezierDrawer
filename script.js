//var c = document.getElementById("myCanvas");
//var ctx = c.getContext("2d");
//ctx.beginPath();
//ctx.moveTo(20,20);
//ctx.bezierCurveTo(20,100,200,100,200,20);
//ctx.stroke();

var ControlPoint = Class.extend({
    init: function (x, y, canvas) { //center
        this.x = x;
        this.y = y;
        this.ctx = canvas.getContext("2d");
        this.canvasRect = canvas.getBoundingClientRect();
        this.hovered = false;
        this.inmove = false;
    },

    getX: function () {
        return this.x;
    },

    getY: function () {
        return this.y;
    },

    setXY: function (x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
    },

    setOrigin: function (isOrigin) {
        this.isOrigin = isOrigin;
    },

    setFirstPoint: function (isFirst) {
        this.first = isFirst;
    },

    setHovered: function (hovered) {
        return this.hovered = hovered;
    },

    setInmove: function (inmove) {
        return this.inmove = inmove;
    },

    redraw: function () {
        //this.bindX.value = this.x;
        //this.bindY.value = this.y;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.isOrigin ? '#003EE9' : '#2FFF1D';
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.hovered ? this.inmove ? '#1A8A13' : '#2FFF1D' : '#2CC21C';
        this.ctx.stroke();
        if (this.first) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI, false);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#00085D';
            this.ctx.stroke();
        }
    },

    clear: function () {
        this.ctx.clearRect(this.x - 7, this.y - 7, this.x + 7, this.y + 7);
    },

    checkHoverStatus: function (event) {
        //this.clear();
        globalClear();
        var ex = event.clientX - this.canvasRect.left;
        var ey = event.clientY - this.canvasRect.top;
        if (this.inmove) {
            this.setXY(ex, ey);
        }

        if ((ex > this.x - 5) && (ex < this.x + 5) && (ey > this.y - 5) && (ey < this.y + 5)) {
            this.setHovered(true);
        } else {
            this.setHovered(false)
        }
        globalRepaint();
    },

    checkPressStatus: function (event) {
        var ex = event.clientX - this.canvasRect.left;
        var ey = event.clientY - this.canvasRect.top;
        if ((ex > this.x - 5) && (ex < this.x + 5) && (ey > this.y - 5) && (ey < this.y + 5)) {
            this.setInmove(true);
            this.redraw();
        }
    },

    checkReleaseStatus: function (event) {
        this.setInmove(false);
        this.redraw();
    }
});


var BezierCurve = Class.extend({
    init: function (p1, p2, p3, p4, ctx) { //p1, p2 - start & end points, p3, p4 - curving points
        this.p1 = p1;
        this.p1.setFirstPoint(true);
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.ctx = ctx;
        this.color = '#0010B9';
    },

    getP1: function () {
        return this.p1;
    },

    getP2: function () {
        return this.p2;
    },

    getP3: function () {
        return this.p3;
    },

    getP4: function () {
        return this.p4;
    },

    setColor: function (color) {
        this.color = color;
    },

    redraw: function () {
        getViewController().updateView();
        this.drawLine(this.p1, this.p3);
        this.drawLine(this.p2, this.p4);
        this.drawBezier(this.p1, this.p2, this.p3, this.p4);
        this.p1.redraw();
        this.p2.redraw();
        this.p3.redraw();
        this.p4.redraw();
    },

    drawLine: function (p1, p2) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.getX(), p1.getY());
        this.ctx.lineTo(p2.getX(), p2.getY());
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
    },

    drawBezier: function (p1, p2, p3, p4) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.getX(), p1.getY());
        this.ctx.bezierCurveTo(p3.getX(), p3.getY(), p4.getX(), p4.getY(), p2.getX(), p2.getY());
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
    }

});


var ViewController = Class.extend({
    //pNx, pNy - bindings to view coordinates fields,
    // line - link to active bezier
    init: function (p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y, line, originPoint, opBindingX, opBindingY, originActivity) {
        this.p1x = p1x;
        this.p1y = p1y;
        this.p2x = p2x;
        this.p2y = p2y;
        this.p3x = p3x;
        this.p3y = p3y;
        this.p4x = p4x;
        this.p4y = p4y;
        this.line = line;
        this.originPoint = originPoint;
        this.opBindingX = opBindingX;
        this.opBindingY = opBindingY;
        this.originActivity = originActivity;
    },

    focusToLine: function (line) {
        this.line = line;
        this.updateView();
    },

    getActiveLine: function () {
        return this.line;
    },

    updateView: function () {
        var dx = this.originActivity.checked ? this.originPoint.getX() : 0;
        var dy = this.originActivity.checked ? this.originPoint.getY() : 0;
        this.p1x.value = this.line.getP1().getX() - dx;
        this.p2x.value = this.line.getP2().getX() - dx;
        this.p3x.value = this.line.getP3().getX() - dx;
        this.p4x.value = this.line.getP4().getX() - dx;
        this.p1y.value = this.line.getP1().getY() - dy;
        this.p2y.value = this.line.getP2().getY() - dy;
        this.p3y.value = this.line.getP3().getY() - dy;
        this.p4y.value = this.line.getP4().getY() - dy;
        this.opBindingX.value = this.originPoint.getX();
        this.opBindingY.value = this.originPoint.getY();
        this.highlightPointControls(this.p1x, this.line.getP1().hovered);
        this.highlightPointControls(this.p2x, this.line.getP2().hovered);
        this.highlightPointControls(this.p3x, this.line.getP3().hovered);
        this.highlightPointControls(this.p4x, this.line.getP4().hovered);
        document.getElementById("lineColor").value = this.line.color;
    },

    highlightPointControls: function (pNx, highlight) {
        pNx.parentNode.parentNode.bgColor = highlight ? '#E3E3E3' : '#FFFFFF';
    },

    applyNewCoords: function () {
        var dx = this.originActivity.checked ? this.originPoint.getX() : 0;
        var dy = this.originActivity.checked ? this.originPoint.getY() : 0;
        this.line.getP1().setXY(parseInt(this.p1x.value) + dx, parseInt(this.p1y.value) + dy);
        this.line.getP2().setXY(parseInt(this.p2x.value) + dx, parseInt(this.p2y.value) + dy);
        this.line.getP3().setXY(parseInt(this.p3x.value) + dx, parseInt(this.p3y.value) + dy);
        this.line.getP4().setXY(parseInt(this.p4x.value) + dx, parseInt(this.p4y.value) + dy);
        this.originPoint.setXY(parseInt(this.opBindingX.value), parseInt(this.opBindingY.value));
        globalClear();
        globalRepaint();
    }

});