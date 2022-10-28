for (let i = 0; i < 70; i++) {
  create(i);
}

function create(i) {
  const width = Math.random() * 18;
  const height = width * 0.5;

  const colourIdx = Math.ceil(Math.random() * 4);
  let colour = "red";

  switch (colourIdx) {
    case 1:
      colour = "yellow";
      break;
    case 2:
      colour = "blue";
      break;
    case 3:
      colour = "green";
      break;
    default:
      colour = "red";
  }

  $('<div class="confetti-' + i + " " + colour + '"></div>').css({
    "width": width + "px",
    "height": height + "px",
    "top": -Math.random() * 20 + "%",
    "left": Math.random() * 100 + "%",
    "opacity": Math.random() + 0.5,
    "transform": "rotate(" + Math.random() * 360 + "deg)",
  }).appendTo(".wrapper");

  drop(i);
}

function drop(x) {
  $(".confetti-" + x).animate(
    {
      top: "100%",
      left: "+=" + Math.random() * 15 + "%",
    },
    Math.random() * 2000 + 2000,
    function () {
      reset(x);
    },
  );
}

function reset(x) {
  $(".confetti-" + x).css("opacity", "1");

  $(".confetti-" + x).animate(
    {
      "top": -Math.random() * 20 + "%",
      "left": "-=" + Math.random() * 15 + "%",
    },
    0,
    function () {
      drop(x);
    },
  );
}
