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

    moveTo: function (x, y) {
        this.x = x;
        this.y = y;
    },

    setHovered: function (hovered) {
        return this.hovered = hovered;
    },

    setInmove: function (inmove) {
        return this.inmove = inmove;
    },

    redraw: function () {
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

    checkHoverStatus: function (event) {
        this.clear();
        var ex = event.clientX - this.canvasRect.left;
        var ey = event.clientY - this.canvasRect.top;
        if (this.inmove) {
            this.moveTo(ex, ey);
        }

        if ((ex > this.x - 5) && (ex < this.x + 5) && (ey > this.y - 5) && (ey < this.y + 5)) {
            this.setHovered(true);
        } else {
            this.setHovered(false)
        }
        this.redraw();
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

