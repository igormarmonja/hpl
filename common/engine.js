/* Спільний рушій: поява елементів, паралакс, прогрес скролу, лічильники, акордеон, форма */
(function () {
  const H = (window.HPL = window.HPL || {});
  const $ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const frames = [];
  H.$ = $; H.clamp = clamp; H.reduce = reduce;
  H.onFrame = (fn) => frames.push(fn);

  function split(el) {
    let i = 0;
    (function walk(n) {
      Array.from(n.childNodes).forEach((c) => {
        if (c.nodeType === 3) {
          const f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) return f.appendChild(document.createTextNode(" "));
            const w = document.createElement("span"); w.className = "w";
            const s = document.createElement("span"); s.style.setProperty("--i", i++); s.textContent = t;
            w.appendChild(s); f.appendChild(w);
          });
          n.replaceChild(f, c);
        } else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
      });
    })(el);
  }

  function count(el) {
    const to = parseFloat(el.dataset.count), suf = el.dataset.suffix || "";
    if (reduce) return (el.textContent = to + suf);
    const t0 = performance.now(), dur = 1600;
    (function step(t) {
      const p = clamp((t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  H.init = function () {
    document.documentElement.classList.add("js");
    $("[data-art]").forEach((el) => (el.innerHTML = H.art(el.dataset.art)));
    $("[data-split]").forEach(split);
    $(".marq-track").forEach((t) => (t.innerHTML = t.innerHTML + t.innerHTML));

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        if (e.target.dataset.count) count(e.target);
        io.unobserve(e.target);
      }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    /* елемент із повністю обрізаним clip-path IO не бачить — спостерігаємо за батьком */
    $("[data-reveal],[data-split],[data-count],[data-in]").forEach((el) => {
      if (el.dataset.reveal === "mask" && el.parentElement) {
        const pio = new IntersectionObserver((es) => es.forEach((e) => {
          if (e.isIntersecting) { el.classList.add("in"); pio.disconnect(); }
        }), { threshold: 0.2 });
        pio.observe(el.parentElement);
      } else io.observe(el);
    });

    /* акордеон */
    $(".acc-head").forEach((h) =>
      h.addEventListener("click", () => {
        const it = h.closest(".acc-item"), grp = it.closest("[data-single]");
        if (grp) $(".acc-item.open", grp).forEach((o) => o !== it && (o.classList.remove("open"), o.querySelector(".acc-head")?.setAttribute("aria-expanded", "false")));
        const o = it.classList.toggle("open");
        h.setAttribute("aria-expanded", o);
      })
    );

    /* форма (демо) */
    $("form[data-form]").forEach((f) => {
      f.addEventListener("submit", (e) => { e.preventDefault(); f.classList.add("sent"); });
      const file = f.querySelector("input[type=file]"), lab = f.querySelector("[data-filename]");
      if (file && lab) file.addEventListener("change", () => (lab.textContent = file.files[0] ? file.files[0].name : lab.dataset.default));
    });

    /* меню */
    $("[data-burger]").forEach((b) => b.addEventListener("click", () => {
      const o = document.body.classList.toggle("menu-open"); b.setAttribute("aria-expanded", o);
    }));
    $("[data-menu] a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

    /* магніт і підсвітка за курсором */
    if (!reduce && matchMedia("(hover:hover)").matches) {
      $("[data-magnetic]").forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.25}px ${(e.clientY - r.top - r.height / 2) * 0.35}px`;
        });
        el.addEventListener("mouseleave", () => (el.style.translate = ""));
      });
      $("[data-spot]").forEach((el) =>
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", e.clientX - r.left + "px");
          el.style.setProperty("--my", e.clientY - r.top + "px");
        })
      );
    }

    const par = $("[data-speed]"), sps = $("[data-sp]"), vps = $("[data-vp]");
    let lastY = scrollY;
    function tick() {
      const vh = innerHeight, y = scrollY, root = document.documentElement;
      root.style.setProperty("--page", (y / Math.max(1, root.scrollHeight - vh)).toFixed(4));
      document.body.classList.toggle("scrolled", y > 30);
      document.body.classList.toggle("hdr-hide", y > 600 && y > lastY + 2 && !document.body.classList.contains("menu-open"));
      if (y < lastY - 2 || y < 600) document.body.classList.remove("hdr-hide");
      lastY = y;
      if (!reduce)
        par.forEach((el) => {
          const r = el.getBoundingClientRect(), base = r.top - (el._ty || 0);
          if (base + r.height < -400 || base > vh + 400) return;
          const off = base + r.height / 2 - vh / 2;
          el._ty = -off * parseFloat(el.dataset.speed);
          el.style.translate = `0 ${el._ty.toFixed(1)}px`;
          if (el.dataset.rot) el.style.rotate = ((off * parseFloat(el.dataset.rot)) / 100).toFixed(2) + "deg";
        });
      sps.forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sp", clamp(-r.top / Math.max(1, r.height - vh)).toFixed(4));
      });
      vps.forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--vp", clamp((vh - r.top) / (vh + r.height)).toFixed(4));
      });
      frames.forEach((f) => f(y, vh));
    }
    let tk = false;
    addEventListener("scroll", () => { if (!tk) { tk = true; requestAnimationFrame(() => { tk = false; tick(); }); } }, { passive: true });
    addEventListener("resize", tick);
    addEventListener("load", tick);
    tick();
    H.tick = tick;
  };

  /* Малі шаблони, спільні для варіантів */
  H.footerCatalog = () =>
    H.catalog().map((c) => `<div><h4><a href="${c.url}">${c.n}</a></h4><ul>${c.items.map((i) => `<li><a href="${c.url}">${i}</a></li>`).join("")}</ul></div>`).join("");
  H.faqHtml = () =>
    H.faq.map((f, i) => `<div class="acc-item${i === 0 ? " open" : ""}"><button class="acc-head" aria-expanded="${i === 0}"><span>${f[0]}</span><i class="plus" aria-hidden="true"></i></button><div class="acc-body"><div><p>${f[1]}</p></div></div></div>`).join("");
  H.formHtml = (cls = "") => `
    <form data-form class="${cls}" novalidate>
      <div class="form-fields">
        <label class="fld"><span>Ім’я</span><input type="text" name="name" placeholder="Як до вас звертатись" autocomplete="name"></label>
        <label class="fld"><span>Телефон</span><input type="tel" name="phone" placeholder="+38 0__ ___ __ __" autocomplete="tel"></label>
        <label class="fld"><span>Тип об’єкта</span><select name="type">${H.objectTypes.map((t) => `<option>${t}</option>`).join("")}</select></label>
        <label class="fld file"><span>Креслення</span><b data-filename data-default="Завантажити файл (DWG, PDF, фото)">Завантажити файл (DWG, PDF, фото)</b><input type="file" name="file"></label>
        <label class="fld"><span>Коментар</span><textarea name="msg" rows="3" placeholder="Розміри, кількість, терміни"></textarea></label>
        <button class="btn-submit" type="submit">${H.cta}</button>
        <p class="note">Прорахунок за 1 день. Ціни не публікуємо — рахуємо під ваш проєкт.</p>
      </div>
      <div class="form-ok"><h4>Дякуємо!</h4><p>Це демонстраційна форма — у робочій версії заявка піде менеджеру.</p></div>
    </form>`;
})();
