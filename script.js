//var c = document.getElementById("myCanvas");
//var ctx = c.getContext("2d");
//ctx.beginPath();
//ctx.moveTo(20,20);
//ctx.bezierCurveTo(20,100,200,100,200,20);
//ctx.stroke();

var ControlPoint = Class.extend({
    init: function (x, y, canvas, bindXtext, bindYtext) { //center
        this.x = x;
        this.y = y;
        this.ctx = canvas.getContext("2d");
        this.canvasRect = canvas.getBoundingClientRect();
        this.hovered = false;
        this.inmove = false;
        this.bindX = bindXtext;
        this.bindY = bindYtext;
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

    setHovered: function (hovered) {
        return this.hovered = hovered;
    },

    setInmove: function (inmove) {
        return this.inmove = inmove;
    },

    redraw: function () {
        this.bindX.value = this.x;
        this.bindY.value = this.y;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = '#2FFF1D';
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.hovered ? this.inmove ? '#1A8A13' : '#2FFF1D' : '#2CC21C';
        this.ctx.stroke();
    },

    clear: function () {
        this.ctx.clearRect(this.x - 7, this.y - 7, this.x + 7, this.y + 7);
    },

    highlightPointControls: function (highlight) {
        this.bindX.parentNode.parentNode.bgColor = highlight ? '#E3E3E3' : '#FFFFFF';
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
        this.highlightPointControls(this.hovered);
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
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.ctx = ctx;
    },

    redraw: function () {
        this.drawLine(this.p1, this.p3);
        this.drawLine(this.p2, this.p4);
        this.drawBezier(this.p1, this.p2, this.p3, this.p4);
    },

    drawLine: function (p1, p2) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.getX(), p1.getY());
        this.ctx.lineTo(p2.getX(), p2.getY());
        this.ctx.strokeStyle = '#0010B9';
        this.ctx.stroke();
    },

    drawBezier: function (p1, p2, p3, p4) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.getX(), p1.getY());
        this.ctx.bezierCurveTo(p3.getX(), p3.getY(), p4.getX(), p4.getY(), p2.getX(), p2.getY());
        this.ctx.strokeStyle = '#0010B9';
        this.ctx.stroke();
    }

});

