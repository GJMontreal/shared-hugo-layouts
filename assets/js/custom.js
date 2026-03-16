/* custom.js */
export default class CustomCaption {
  constructor(lightbox, options = {}) {
    this.lightbox = lightbox;
    this.icon = options.icon || 'ⓘ';
    this.isVisible = false;
    this.captionToggleButton = null;
    this.captionContainer = null;
    

    lightbox.on('uiRegister', () => {
      lightbox.pswp.ui.registerElement({
        name: 'custom-caption',
        order: 9,
        isButton: false,
        appendTo: 'wrapper',
        html: '',
        onInit: (el, pswp) => {
          // create container and child elements
          const container = document.createElement('div');
          container.className = 'pswp__caption-container';

          const captionEl = document.createElement('div');
          captionEl.className = 'pswp__custom-caption hidden'; // hidden by default
          captionEl.style.maxHeight = '40vh';
          captionEl.style.overflowY = 'auto';
          captionEl.style.maxWidth = '80%';
          captionEl.style.margin = '0 auto';

          const button = document.createElement('button');
          button.className = 'pswp__bottom-right-button hidden'; // hidden by default
          button.textContent = this.icon;
          
          // Bind events
          button.addEventListener('click', () => {
            this.isVisible = !this.isVisible;
            captionEl.classList.toggle('hidden', !this.isVisible);
          });

          // Append to container
          container.appendChild(captionEl);
          container.appendChild(button);
          el.appendChild(container);

          // Save references
          this.captionToggleButton = button;
          this.captionContainer = container;

          lightbox.pswp.on('change', () => {
            const currSlideElement = lightbox.pswp.currSlide.data.element;
            let captionHTML = '';
            if (currSlideElement) {
              const hiddenCaption = currSlideElement.querySelector('.hidden-caption-content');
              if (hiddenCaption) {
                // get caption from element with class hidden-caption-content
                captionHTML = hiddenCaption.innerHTML;
              }
            }
            captionEl.innerHTML = captionHTML;
            el.classList.toggle('hidden', !(self.isVisible && captionHTML));

            // Toggle visibility based on content and state
            const shouldShow = this.isVisible && captionHTML;
            captionEl.classList.toggle('hidden', !shouldShow);
            button.classList.toggle('hidden', !captionHTML);
          });
        }
      });
    });
  }
}
