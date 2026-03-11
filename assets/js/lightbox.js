import PhotoSwipeLightbox from "./photoswipe/photoswipe-lightbox.esm.js";
import PhotoSwipe from "./photoswipe/photoswipe.esm.js";
import PhotoSwipeVideoPlugin from './photoswipe-video-plugin.esm.js';
import CustomCaption from './custom.js';

import * as params from "@params";

const gallery = document.getElementById("gallery");

if (gallery) {
  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: ".gallery-item",
    showHideAnimationType: "zoom",
    bgOpacity: .8,
    pswpModule: PhotoSwipe,
    imageClickAction: "close",
    closeTitle: params.closeTitle,
    zoomTitle: params.zoomTitle,
    arrowPrevTitle: params.arrowPrevTitle,
    arrowNextTitle: params.arrowNextTitle,
    errorMsg: params.errorMsg,
  });
  
  const videoPlugin = new PhotoSwipeVideoPlugin(lightbox, {});
  const caption = new CustomCaption(lightbox, {icon:'ⓘ'});

  lightbox.on("change", () => {
    const target = lightbox.pswp.currSlide?.data?.element?.dataset["pswpTarget"];
    history.replaceState("", document.title, "#" + target);
  });

  lightbox.on("close", () => {
    history.replaceState("", document.title, window.location.pathname);
  });

  // I think if we add this using the pswp api register element - it will add it to the toolbar
  // we don't want that

  lightbox.on('afterInit', () => {
  const container = lightbox.pswp.container;
  if (container) {
    const observer = new MutationObserver(() => {
      if (container.style.width === '100%') {
        container.style.width = 'calc(100% - 80px)';
        container.style.left = '40px';
      }
    });
    observer.observe(container, { attributes: true, attributeFilter: ['style'] });
  }
  });

  lightbox.init();

  

  if (window.location.hash.substring(1).length > 1) {
    const target = window.location.hash.substring(1);
    const items = gallery.querySelectorAll("a");
    for (let i = 0; i < items.length; i++) {
      if (items[i].dataset["pswpTarget"] === target) {
        lightbox.loadAndOpen(i, { gallery });
        break;
      }
    }
  }
}
