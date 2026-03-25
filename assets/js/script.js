'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

    ensureSkillBubbleField();

  });
}


function ensureSkillBubbleField() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const resumePage = document.querySelector('[data-page="resume"]');
  const bubbleField = document.querySelector('.skill-bubble-list');
  if (!resumePage || !bubbleField) return;

  if (bubbleField.dataset.floatReady === "true") return;
  if (!resumePage.classList.contains("active") || bubbleField.clientWidth < 220) return;

  bubbleField.dataset.floatReady = "true";

  const items = Array.from(bubbleField.querySelectorAll('.skill-bubble-item'));
  if (!items.length) return;

  const placed = [];
  const bubbles = [];
  const pairCooldown = new Map();

  const getBounds = () => {
    const style = getComputedStyle(bubbleField);
    return {
      width: bubbleField.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
      height: bubbleField.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
      leftPad: parseFloat(style.paddingLeft),
      topPad: parseFloat(style.paddingTop)
    };
  };

  const overlap = (a, b, pad = 6) => {
    return !(
      a.x + a.w + pad < b.x ||
      b.x + b.w + pad < a.x ||
      a.y + a.h + pad < b.y ||
      b.y + b.h + pad < a.y
    );
  };

  const randomVelocity = () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.14 + Math.random() * 0.18;
    return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
  };

  const placeBubbles = () => {
    const measured = items.map((el) => ({ el, w: el.offsetWidth, h: el.offsetHeight }));
    const totalArea = measured.reduce((sum, item) => sum + (item.w + 18) * (item.h + 18), 0);
    const width = Math.max(260, bubbleField.clientWidth);
    const targetHeight = Math.max(260, Math.min(460, Math.ceil(totalArea / (width * 0.36))));

    bubbleField.style.height = `${targetHeight}px`;

    const bounds = getBounds();

    placed.length = 0;
    bubbles.length = 0;

    measured.forEach((item) => {
      const maxX = Math.max(0, bounds.width - item.w);
      const maxY = Math.max(0, bounds.height - item.h);
      let pos = null;

      for (let attempt = 0; attempt < 140; attempt++) {
        const candidate = {
          x: Math.random() * maxX,
          y: Math.random() * maxY,
          w: item.w,
          h: item.h
        };

        if (!placed.some((p) => overlap(candidate, p))) {
          pos = candidate;
          break;
        }
      }

      if (!pos) {
        pos = {
          x: Math.random() * maxX,
          y: Math.random() * maxY,
          w: item.w,
          h: item.h
        };
      }

      const velocity = randomVelocity();
      item.el.style.left = "0px";
      item.el.style.top = "0px";
      item.el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

      placed.push(pos);
      bubbles.push({
        el: item.el,
        x: pos.x,
        y: pos.y,
        w: item.w,
        h: item.h,
        vx: velocity.vx,
        vy: velocity.vy
      });
    });
  };

  const flare = (x, y) => {
    const fx = document.createElement("span");
    fx.className = "bubble-flare";
    fx.style.left = `${x}px`;
    fx.style.top = `${y}px`;
    fx.style.setProperty("--flare-hue", `${28 + Math.floor(Math.random() * 38)}`);
    bubbleField.appendChild(fx);
    fx.addEventListener("animationend", () => fx.remove(), { once: true });
  };

  placeBubbles();

  let lastTime = performance.now();

  const tick = (now) => {
    const isResumeOpen = resumePage.classList.contains("active");
    const dt = Math.min(2.2, (now - lastTime) / 16.67);
    lastTime = now;

    if (isResumeOpen) {
      const bounds = getBounds();

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (b.x <= 0) {
          b.x = 0;
          b.vx = Math.abs(b.vx);
        } else if (b.x + b.w >= bounds.width) {
          b.x = Math.max(0, bounds.width - b.w);
          b.vx = -Math.abs(b.vx);
        }

        if (b.y <= 0) {
          b.y = 0;
          b.vy = Math.abs(b.vy);
        } else if (b.y + b.h >= bounds.height) {
          b.y = Math.max(0, bounds.height - b.h);
          b.vy = -Math.abs(b.vy);
        }
      }

      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const a = bubbles[i];
          const b = bubbles[j];

          if (!overlap(a, b, 0)) continue;

          const overlapX = Math.min(a.x + a.w - b.x, b.x + b.w - a.x);
          const overlapY = Math.min(a.y + a.h - b.y, b.y + b.h - a.y);

          if (overlapX < overlapY) {
            const shift = overlapX / 2;
            if (a.x < b.x) {
              a.x -= shift;
              b.x += shift;
            } else {
              a.x += shift;
              b.x -= shift;
            }

            const temp = a.vx;
            a.vx = b.vx;
            b.vx = temp;
          } else {
            const shift = overlapY / 2;
            if (a.y < b.y) {
              a.y -= shift;
              b.y += shift;
            } else {
              a.y += shift;
              b.y -= shift;
            }

            const temp = a.vy;
            a.vy = b.vy;
            b.vy = temp;
          }

          const key = `${i}-${j}`;
          const lastHit = pairCooldown.get(key) || 0;
          if (now - lastHit > 170) {
            pairCooldown.set(key, now);
            flare((a.x + a.w / 2 + b.x + b.w / 2) / 2 + bounds.leftPad, (a.y + a.h / 2 + b.y + b.h / 2) / 2 + bounds.topPad);
          }
        }
      }

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
      }
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);

  window.addEventListener("resize", () => {
    placeBubbles();
  });
}


window.addEventListener("load", ensureSkillBubbleField);