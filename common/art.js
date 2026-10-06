/* Векторні ілюстрації виробів. Колір береться з CSS-змінних --a1..--a5, --ink,
   тому кожен варіант сайту фарбує їх власною палітрою. Замінити на реальні фото об’єктів. */
(function () {
  const H = (window.HPL = window.HPL || {});
  const svg = (b, vb = "0 0 480 360") =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ілюстрація виробу з HPL" preserveAspectRatio="xMidYMid meet">${b}</svg>`;
  const rnd = (i) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
  const A = {};

  A.partitions = () => {
    let s = `<rect x="0" y="302" width="480" height="58" fill="var(--a4)" opacity=".4"/>
    <rect x="14" y="34" width="452" height="9" rx="2" fill="var(--a3)"/>`;
    for (let i = 0; i < 4; i++) {
      const x = 24 + i * 112, c = i % 2 ? "--a2" : "--a1";
      s += `<rect x="${x}" y="43" width="104" height="245" fill="var(${c})"/>
      <rect x="${x + 12}" y="60" width="80" height="212" fill="none" stroke="var(--a5)" stroke-opacity=".3" stroke-width="2"/>
      <rect x="${x + 10}" y="288" width="5" height="14" fill="var(--a3)"/><rect x="${x + 89}" y="288" width="5" height="14" fill="var(--a3)"/>
      <circle cx="${x + 80}" cy="168" r="5" fill="var(--a5)"/><rect x="${x + 74}" y="180" width="12" height="4" rx="2" fill="var(--a5)"/>`;
    }
    return svg(s);
  };

  A.lockers = () => {
    let s = `<rect x="0" y="322" width="480" height="38" fill="var(--a4)" opacity=".4"/>`;
    for (let r = 0; r < 2; r++)
      for (let i = 0; i < 5; i++) {
        const x = 20 + i * 90, y = 28 + r * 146, c = (i + r) % 2 ? "--a2" : "--a1";
        s += `<rect x="${x}" y="${y}" width="82" height="138" fill="var(${c})"/>
        <rect x="${x + 14}" y="${y + 14}" width="54" height="3" fill="var(--a5)" opacity=".5"/><rect x="${x + 14}" y="${y + 22}" width="54" height="3" fill="var(--a5)" opacity=".5"/><rect x="${x + 14}" y="${y + 30}" width="54" height="3" fill="var(--a5)" opacity=".5"/>
        <rect x="${x + 62}" y="${y + 70}" width="6" height="26" rx="3" fill="var(--a5)"/>`;
      }
    s += `<rect x="20" y="330" width="452" height="12" fill="var(--a3)"/>`;
    return svg(s);
  };

  A.panels = () => {
    let s = `<rect width="480" height="360" fill="var(--a2)" opacity=".5"/>`;
    for (let i = 0; i < 8; i++)
      s += `<rect x="${12 + i * 58}" y="14" width="54" height="300" fill="var(${i % 2 ? "--a2" : "--a1"})"/>`;
    s += `<rect x="0" y="206" width="480" height="14" fill="var(--a3)"/><rect x="0" y="206" width="480" height="3" fill="var(--a5)" opacity=".5"/>
    <rect x="0" y="314" width="480" height="46" fill="var(--a4)" opacity=".55"/>`;
    for (let i = 0; i < 5; i++) s += `<rect x="${50 + i * 100}" y="220" width="6" height="22" fill="var(--a3)"/>`;
    return svg(s);
  };

  A.facade = () => {
    let s = "";
    const cols = ["--a1", "--a2", "--a3", "--a4"];
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 8; c++) {
        const k = r * 8 + c, w = 54, h = 54;
        s += `<rect x="${10 + c * 58}" y="${10 + r * 58}" width="${w}" height="${h}" fill="var(${cols[Math.floor(rnd(k + 3) * 4)]})" opacity="${(0.72 + rnd(k) * 0.28).toFixed(2)}"/>`;
      }
    return svg(s);
  };

  A.door = () =>
    svg(`<rect width="480" height="360" fill="var(--a2)" opacity=".45"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${i * 80 + 38}" y="0" width="2" height="330" fill="var(--a5)" opacity=".16"/>`).join("")}
    <rect x="130" y="26" width="220" height="304" fill="var(--a3)"/>
    <rect x="144" y="40" width="192" height="290" fill="var(--a1)"/>
    <rect x="164" y="62" width="152" height="108" fill="none" stroke="var(--a5)" stroke-opacity=".3" stroke-width="2"/>
    <rect x="164" y="190" width="152" height="120" fill="none" stroke="var(--a5)" stroke-opacity=".3" stroke-width="2"/>
    <rect x="296" y="182" width="22" height="6" rx="3" fill="var(--a5)"/>
    <rect x="0" y="330" width="480" height="30" fill="var(--a4)" opacity=".5"/>`);

  A.sheets = () => {
    let s = "";
    const cols = ["--a1", "--a2", "--a3", "--a4", "--a1"];
    for (let i = 0; i < 5; i++) {
      const y = 262 - i * 30, c = cols[i];
      s += `<polygon points="60,${y} 250,${y - 66} 430,${y - 22} 240,${y + 44}" fill="var(${c})"/>
      <polygon points="60,${y} 240,${y + 44} 240,${y + 64} 60,${y + 20}" fill="var(${c})"/><polygon points="60,${y} 240,${y + 44} 240,${y + 64} 60,${y + 20}" fill="var(--ink)" opacity=".28"/>
      <polygon points="240,${y + 44} 430,${y - 22} 430,${y - 2} 240,${y + 64}" fill="var(${c})"/><polygon points="240,${y + 44} 430,${y - 22} 430,${y - 2} 240,${y + 64}" fill="var(--ink)" opacity=".45"/>`;
    }
    return svg(s);
  };

  /* Силуети серій перегородок */
  const ser = (h, gap, w, kids) =>
    svg(
      `<rect x="0" y="206" width="240" height="34" fill="var(--a4)" opacity=".4"/>
      <rect x="${120 - w / 2}" y="${206 - gap - h}" width="${w}" height="${h}" rx="${kids ? 14 : 0}" fill="var(--a1)"/>
      <rect x="${120 - w / 2 + 10}" y="${206 - gap - h + 12}" width="${w - 20}" height="${h - 24}" rx="${kids ? 8 : 0}" fill="none" stroke="var(--a5)" stroke-opacity=".3" stroke-width="2"/>
      <circle cx="${120 + w / 2 - 18}" cy="${206 - gap - h / 2}" r="4" fill="var(--a5)"/>
      ${gap ? `<rect x="${120 - w / 2 + 8}" y="${206 - gap}" width="4" height="${gap}" fill="var(--a3)"/><rect x="${120 + w / 2 - 12}" y="${206 - gap}" width="4" height="${gap}" fill="var(--a3)"/>` : ""}
      ${kids ? "" : `<rect x="${120 - w / 2 - 8}" y="${206 - gap - h - 6}" width="${w + 16}" height="6" fill="var(--a3)"/>`}`,
      "0 0 240 240"
    );
  A.sLINE = () => ser(130, 16, 120);
  A.sSOLID = () => ser(136, 12, 130);
  A.sFULL = () => ser(186, 0, 140);
  A.sKIDS = () => ser(86, 10, 110, true);

  /* Листя-тінь для декору */
  A.leaf = () =>
    svg(
      `<g fill="currentColor"><path d="M200 400C190 300 200 200 215 80" stroke="currentColor" stroke-width="3" fill="none"/>
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<ellipse cx="${i % 2 ? 250 : 165}" cy="${340 - i * 42}" rx="58" ry="15" transform="rotate(${i % 2 ? -34 : 34} ${i % 2 ? 250 : 165} ${340 - i * 42})"/>`).join("")}</g>`,
      "0 0 400 420"
    );

  H.art = (name) => (A[name] ? A[name]() : "");
})();
