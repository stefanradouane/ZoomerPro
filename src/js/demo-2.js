const img = document.getElementById("image");
const result = document.getElementById("preview");
const btn = document.querySelectorAll(".btn");
const content = document.querySelector(".content");
const increments = 30;
const inputs = document.querySelectorAll("[data-input]");
const inputfield = document.querySelector(".inputfield");
const headerinput = document.querySelector(".headerinput");

function baseSizeCalc(element) {
  return Math.min(
    parseFloat(getComputedStyle(element).width),
    parseFloat(getComputedStyle(element).height)
  );
}

// On input
if (inputs) {
  inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const [file] = input.files;
      if (file) {
        content.removeAttribute("hidden");
        headerinput.removeAttribute("hidden");
        inputfield.setAttribute("hidden", "");
        img.src = URL.createObjectURL(file);
        img.onload = function () {
          document.querySelector(".img-zoom-lens")?.remove();

          imageZoom();
        };
      }
    });
  });
}

document.addEventListener("keydown", async (e) => {
  // e.preventDefault();
  // console.log(e.clipboardData);
  // console.log(navigator.clipboard.read());
  if (e.key == "v") {
    try {
      const permission = await navigator.permissions.query({
        name: "clipboard-read",
      });
      if (permission.state === "denied") {
        throw new Error("Not allowed to read clipboard.");
      }
      const clipboardContents = await navigator.clipboard.read();
      for (const item of clipboardContents) {
        if (!item.types.includes("image/png")) {
          throw new Error("Clipboard contains non-image data.");
        }
        const blob = await item.getType("image/png");
        console.log(blob);
        img.src = URL.createObjectURL(blob);
        content.removeAttribute("hidden");
        headerinput.removeAttribute("hidden");
        inputfield.setAttribute("hidden", "");
        img.onload = function () {
          document.querySelector(".img-zoom-lens")?.remove();

          imageZoom();
        };
      }
    } catch (error) {
      console.error(error.message);
    }
  }
});

if (btn) {
  btn.forEach((btn) => {
    console.log(btn);

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const maginfier = e.target.dataset.maginfier;
      let maginfySize;
      const currentWidth = getComputedStyle(
        document.querySelector(".img-zoom-lens")
      ).width;

      if (
        maginfier == "minus" &&
        !(parseFloat(currentWidth) >= baseSizeCalc(img))
      )
        maginfySize = parseFloat(currentWidth) + increments;
      else if (
        maginfier == "plus" &&
        !(parseFloat(currentWidth) - increments <= 10)
      )
        maginfySize = parseFloat(currentWidth) - increments;
      else return;

      document.querySelector(".img-zoom-lens").remove();
      imageZoom(maginfySize);
    });
  });
}

// imageZoom();

function imageZoom(maginfySize) {
  var lens, cx, cy;
  let baseSize = baseSizeCalc(img);
  let usedSize = maginfySize ? maginfySize : baseSize;

  /* Create lens: */
  lens = Object.assign(document.createElement("div"), {
    classList: ["img-zoom-lens"],
  });

  lens.style.height = usedSize + "px";
  lens.style.width = usedSize + "px";

  /* Insert lens: */
  img.parentElement.insertBefore(lens, img);

  /* Calculate the ratio between result DIV and lens: */
  cx = result.offsetWidth / usedSize;
  cy = result.offsetHeight / usedSize;

  /* Set background properties for the result DIV */
  result.style.backgroundImage = "url('" + img.src + "')";
  result.style.backgroundSize = img.width * cx + "px " + img.height * cy + "px";

  /* Execute a function when someone moves the cursor over the image, or the lens: */
  lens.addEventListener("mousemove", moveLens);
  img.addEventListener("mousemove", moveLens);

  /* And also for touch screens: */
  lens.addEventListener("touchmove", moveLens);
  img.addEventListener("touchmove", moveLens);

  window.addEventListener("resize", function () {
    lens.style.height = baseSizeCalc(img) + "px";
    lens.style.width = baseSizeCalc(img) + "px";

    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize =
      img.width * cx + "px " + img.height * cy + "px";
  });

  function moveLens(e) {
    var pos, x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = getCursorPos(e);
    /* Calculate the position of the lens: */
    x = pos.x - lens.offsetWidth / 2;
    y = pos.y - lens.offsetHeight / 2;
    /* Prevent the lens from being positioned outside the image: */
    if (x > img.width - lens.offsetWidth) {
      x = img.width - lens.offsetWidth;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > img.height - lens.offsetHeight) {
      y = img.height - lens.offsetHeight;
    }
    if (y < 0) {
      y = 0;
    }
    /* Set the position of the lens: */
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    /* Display what the lens "sees": */
    result.style.backgroundPosition = "-" + x * cx + "px -" + y * cy + "px";
  }
  function getCursorPos(e) {
    var a,
      x = 0,
      y = 0;
    e = e || window.event;
    /* Get the x and y positions of the image: */
    a = img.getBoundingClientRect();
    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /* Consider any page scrolling: */
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  }
}
