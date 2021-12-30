function Canvas(id = "canvas") {
  this.id = id;
  this.canvas = document.getElementById(id);
  this.context = this.canvas.getContext("2d");
  this.w = this.canvas.width;
  this.h = this.canvas.height;

  // draws black over the entire canvas
  this.clear = function () {
    this.drawRect(0, 0, this.canvas.width, this.canvas.height, "#78C380", true);
  };

  // top left corner of line goes on x, y
  this.drawLine = function (x, y, toX, toY, color = "white") {
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(toX, toY);
    this.context.stroke();
  };

  // center of circle goes on x, y
  this.drawCircle = function (x, y, radius, color = "white", fill = false) {
    this.context.beginPath();
    if (fill) {
      this.context.fillStyle = color;
      this.context.arc(x, y, radius, 0, 2 * Math.PI);
      this.context.fill();
    } else {
      this.context.strokeStyle = color;
      this.context.arc(x, y, radius, 0, 2 * Math.PI);
      this.context.stroke();
    }
  };

  // top left corner of rect goes on x, y
  this.drawRect = function (
    x,
    y,
    width,
    height,
    color = "white",
    fill = false
  ) {
    this.context.beginPath();
    if (fill) {
      this.context.fillStyle = color;
      this.context.fillRect(x, y, width, height);
    } else {
      this.context.strokeStyle = color;
      this.context.rect(x, y, width, height);
      this.context.stroke();
    }
  };

  // top left corner of text goes on x, y
  this.drawText = function (x, y, text, color = "white", fontSize = 40) {
    this.context.font = fontSize + "px Arial";
    this.context.fillStyle = color;
    this.context.fillText(text, x, y + fontSize * 0.8);
  };

  this.drawEntitySprite = function (entity, imgX, imgY, imgW, imgH) {
    this.context.drawImage(
      entity.img,
      imgX,
      imgY,
      imgW,
      imgH,
      entity.x,
      entity.y,
      entity.w,
      entity.h
    );
  };
}
