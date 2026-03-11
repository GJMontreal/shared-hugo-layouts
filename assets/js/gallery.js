import justifiedLayout from "./justified-layout/index.js";
import * as params from "@params";

const gallery = document.getElementById("gallery");

if (gallery) {
  let containerWidth = 0;
  const items = gallery.querySelectorAll(".gallery-item");

  const input = Array.from(items).map((item) => {
    const img = item.querySelector("img");
    img.style.width = "100%";
    img.style.height = "auto";
    return {
      width: parseFloat(img.getAttribute("width")),
      height: parseFloat(img.getAttribute("height")),
    };
  });

  function updateGallery() {
    console.trace('updateGallery called');
    if (containerWidth === gallery.getBoundingClientRect().width) return;
    containerWidth = gallery.getBoundingClientRect().width;

    const geometry = justifiedLayout(input, {
      containerWidth,
      containerPadding: 0,
      boxSpacing: Number.isInteger(params.boxSpacing) ? params.boxSpacing : 8,
      targetRowHeight: params.targetRowHeight || 288,
      targetRowHeightTolerance: Number.isInteger(params.targetRowHeightTolerance) ? params.targetRowHeightTolerance : 0.25,
    });

    // Group boxes by row (same top value)
    const rows = {};
    geometry.boxes.forEach((box, i) => {
      const row = box.top;
      if (!rows[row]) rows[row] = [];
      rows[row].push({ ...box, i });
    });
    
    // Center each row
    Object.values(rows).forEach(row => {
      const rowWidth = row[row.length - 1].left + row[row.length - 1].width;
      const offset = (containerWidth - rowWidth) / 2;
      row.forEach(({ i }) => {
        const { width, height, top, left } = geometry.boxes[i];
        items[i].style.position = "absolute";
        items[i].style.width = width + "px";
        items[i].style.height = height + "px";
        items[i].style.top = top + "px";
        items[i].style.left = (left + offset) + "px";
        items[i].style.overflow = "hidden";
      });
    });

    gallery.style.position = "relative";
    gallery.style.height = geometry.containerHeight + "px";
    gallery.style.visibility = "";
  }

  window.addEventListener("resize", updateGallery);
  window.addEventListener("orientationchange", updateGallery);

  updateGallery();
  updateGallery();
}
