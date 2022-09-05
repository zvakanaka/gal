(function() {
  const template = document.createElement('template')
  template.id = 'light-box-template'
  template.innerHTML = `
  <div id="light-box__background" class="light-box__hidden"></div>
  <div id="light-box__overlay" class="light-box__hidden container">
  <img id="light-box__image" class="web" src="" alt="Alt Text!">
  <div class="buttons">
  <div class="button" id="light-box__close"><div class="button-content">✕</div></div>
  <!-- <div class="button"><div class="button-content">r</div></div> -->
  <!-- <div class="button"><div class="button-content">v</div></div> -->
  <!-- <div class="button"><div class="button-content"><</div></div> -->
  <!-- <div class="button"><div class="button-content">></div></div> -->
  </div>
  </div>
  <style media="screen">
  #light-box__background { top: 0%; left: 0%; width: 100%; height: 100%; z-index: 9998; position: fixed; background-color: black; -moz-opacity: 0.8; opacity:.80; filter: alpha(opacity=80);}
  .container { top: 0px; left: 0px; z-index: 9999; height: 100%; width: 100%; display: grid; position: fixed; }
  #light-box__image { max-width:95%; max-height:95%; justify-self: center; align-self: center; }
  .web{ /*border-style: solid;*/ grid-column: 1; }
  .buttons { position: fixed; overflow: hidden; top: 12px; right: 12px; }
  .button { height: 64px; width: 64px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fffc; font-family: courier new, monospace; }
  .button-content { position: relative; transform: translateY(5%); font-size: 3em; }
  .light-box__hidden { display: none; }
  @media (min-aspect-ratio: 1/1) { /* landscape */
    
  }
  </style>`;
  // let querySelector = function(selector) {
  //   //currentScript is this ^ script tag, and the owner is this document around it
  //   let script = document._currentScript || document.currentScript;
  //   //ownerDocument is this entire file
  //   return script ? script.ownerDocument.querySelector(selector) : document.querySelector(selector);
  // };
  //querySelector only works at top level because currentScript is only valid there
  // const template = querySelector('template#light-box-template');
  customElements.define('light-box', class extends HTMLElement {//template setup
    constructor() {
      super(); // always always
    }
    static get observedAttributes() {
      return ['small', 'large'];
    }
    get small() { return this.querySelector('#light-box__image').getAttribute('src'); }
    set small(val) { this.querySelector('#light-box__image').setAttribute('src', val); }
    get large() { return this.querySelector('#light-box__image').getAttribute('src'); }
    set large(val) { this.querySelector('#light-box__image').setAttribute('src', val); }
    get open() { return this.hasAttribute('open'); }
    set open(val) { 
      if (val === this.open) return
      val !== false ? this.openModal() : this.closeModal()
    }

    openModal() {
      this.setAttribute('open', '') 
      this.querySelector('#light-box__overlay').classList.toggle('light-box__hidden');
      this.querySelector('#light-box__background').classList.toggle('light-box__hidden');
      document.body.style.overflow = 'hidden';
    }
    closeModal() { 
      if (this.open) {
        this.removeAttribute('open'); 
        this.large = '';
        this.small = '';
        this.querySelector('#light-box__overlay').classList.toggle('light-box__hidden');
        this.querySelector('#light-box__background').classList.toggle('light-box__hidden');
        document.body.style.overflow = 'unset';
      }
    }
    connectedCallback() {//event listeners
      const instance = template.content.cloneNode(true);
      this.appendChild(instance);
      //close modal
      this.querySelector('#light-box__close').addEventListener('click', this.closeModal.bind(this));
      document.addEventListener('keydown', ({ key }) => {
        if (key === 'Escape') {
          this.closeModal();
        }
      })
      //BUG: clicking ANYWHERE triggers listener
      // this.getElementsByClassName('light-box__overlay')[0].addEventListener('click', this.closeModal.bind(this),false);
    }
    disconnectedCallback() {}//event cleanup
    attributeChangedCallback(attr, oldValue, newValue) {//observedAttribute changes
      if (oldValue !== newValue) this[attr] = newValue;
    }
  });
}());
