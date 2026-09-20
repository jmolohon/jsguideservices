/**
 * Fish weight calculator — vanilla JS, per-species Minnesota SVG art.
 */
(function () {
  "use strict";

  const LEN_MIN = 8;
  const LEN_MAX = 42;
  const GIRTH_MIN = 4;
  const GIRTH_MAX = 26;

  /** Length-only species: fixed aspect (sy/sx) so proportions stay representative */
  const SPECIES_ASPECT = {
    pike: 0.42,
    muskie: 0.675, // taller again (~0.45 * 1.5)
    crappie: 0.92,
    bluegill: 0.95,
  };

  const SPECIES_ART = {
    default: "\n<defs>\n  <linearGradient id=\"g-walleye\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#2f451c\"/>\n    <stop offset=\"30%\" stop-color=\"#6f8a32\"/>\n    <stop offset=\"65%\" stop-color=\"#c4a03a\"/>\n    <stop offset=\"100%\" stop-color=\"#f7f2e6\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-walleye)\" stroke=\"#2a3814\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M18 46 C22 40,28 34,36 32 C48 28,62 26,78 25 C100 24,122 26,142 30 C152 32,158 36,162 42\n     L188 22 L176 45 L190 68 L162 48 C158 54,150 58,140 60 C118 64,96 66,74 64 C58 62,44 58,34 54\n     C28 52,22 50,18 48 C16 47,16 46.5,18 46 Z\"/>\n<ellipse cx=\"86\" cy=\"36\" rx=\"11\" ry=\"7\" fill=\"#3d5220\" opacity=\".28\"/>\n<ellipse cx=\"112\" cy=\"34\" rx=\"10\" ry=\"6\" fill=\"#3d5220\" opacity=\".24\"/>\n<path fill=\"#5a6e28\" stroke=\"#2a3814\" stroke-width=\".8\" d=\"M72 26 C80 10,102 9,114 24 L108 26 C98 16,84 16,76 26 Z\"/>\n<ellipse cx=\"108\" cy=\"22\" rx=\"3.2\" ry=\"2.4\" fill=\"#1a1a1a\" opacity=\".85\"/>\n<path fill=\"#5a6e28\" stroke=\"#2a3814\" stroke-width=\".8\" d=\"M118 26 C128 14,142 16,148 28 L140 30 C134 22,124 22,118 28 Z\"/>\n<path fill=\"#f5f5f0\" stroke=\"#2a3814\" stroke-width=\".7\" d=\"M176 52 L190 68 L168 56 Z\"/>\n<circle cx=\"44\" cy=\"36\" r=\"6.2\" fill=\"#f7f4e8\" stroke=\"#2a3814\" stroke-width=\".7\"/>\n<circle cx=\"45\" cy=\"36\" r=\"4.1\" fill=\"#c9a227\"/>\n<circle cx=\"46\" cy=\"36.3\" r=\"2.1\" fill=\"#141414\"/>\n<path fill=\"none\" stroke=\"#2a3814\" stroke-width=\"1.05\" stroke-linecap=\"round\" d=\"M20 47 C30 50,40 51,52 48\"/>\n",
    walleye: "\n<defs>\n  <linearGradient id=\"g-walleye\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#2f451c\"/>\n    <stop offset=\"30%\" stop-color=\"#6f8a32\"/>\n    <stop offset=\"65%\" stop-color=\"#c4a03a\"/>\n    <stop offset=\"100%\" stop-color=\"#f7f2e6\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-walleye)\" stroke=\"#2a3814\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M18 46 C22 40,28 34,36 32 C48 28,62 26,78 25 C100 24,122 26,142 30 C152 32,158 36,162 42\n     L188 22 L176 45 L190 68 L162 48 C158 54,150 58,140 60 C118 64,96 66,74 64 C58 62,44 58,34 54\n     C28 52,22 50,18 48 C16 47,16 46.5,18 46 Z\"/>\n<ellipse cx=\"86\" cy=\"36\" rx=\"11\" ry=\"7\" fill=\"#3d5220\" opacity=\".28\"/>\n<ellipse cx=\"112\" cy=\"34\" rx=\"10\" ry=\"6\" fill=\"#3d5220\" opacity=\".24\"/>\n<path fill=\"#5a6e28\" stroke=\"#2a3814\" stroke-width=\".8\" d=\"M72 26 C80 10,102 9,114 24 L108 26 C98 16,84 16,76 26 Z\"/>\n<ellipse cx=\"108\" cy=\"22\" rx=\"3.2\" ry=\"2.4\" fill=\"#1a1a1a\" opacity=\".85\"/>\n<path fill=\"#5a6e28\" stroke=\"#2a3814\" stroke-width=\".8\" d=\"M118 26 C128 14,142 16,148 28 L140 30 C134 22,124 22,118 28 Z\"/>\n<path fill=\"#f5f5f0\" stroke=\"#2a3814\" stroke-width=\".7\" d=\"M176 52 L190 68 L168 56 Z\"/>\n<circle cx=\"44\" cy=\"36\" r=\"6.2\" fill=\"#f7f4e8\" stroke=\"#2a3814\" stroke-width=\".7\"/>\n<circle cx=\"45\" cy=\"36\" r=\"4.1\" fill=\"#c9a227\"/>\n<circle cx=\"46\" cy=\"36.3\" r=\"2.1\" fill=\"#141414\"/>\n<path fill=\"none\" stroke=\"#2a3814\" stroke-width=\"1.05\" stroke-linecap=\"round\" d=\"M20 47 C30 50,40 51,52 48\"/>\n",
    pike: "\n<defs>\n  <linearGradient id=\"g-pike\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#2d4a32\"/>\n    <stop offset=\"45%\" stop-color=\"#5a7a48\"/>\n    <stop offset=\"100%\" stop-color=\"#d8e0c8\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-pike)\" stroke=\"#1e3020\" stroke-width=\"1.1\" stroke-linejoin=\"round\"\n  d=\"M12 45 C20 38,32 34,48 33 C70 31,100 30,130 32 C148 34,160 38,168 44\n     L198 28 L184 45 L198 62 L168 46 C160 52,148 56,130 58 C100 60,70 59,48 57\n     C32 56,20 52,12 47 C10 46,10 45.5,12 45 Z\"/>\n<circle cx=\"58\" cy=\"40\" r=\"2.2\" fill=\"#e8f0d8\" opacity=\".7\"/>\n<circle cx=\"78\" cy=\"38\" r=\"2\" fill=\"#e8f0d8\" opacity=\".65\"/>\n<circle cx=\"98\" cy=\"41\" r=\"2.1\" fill=\"#e8f0d8\" opacity=\".65\"/>\n<circle cx=\"118\" cy=\"39\" r=\"1.9\" fill=\"#e8f0d8\" opacity=\".6\"/>\n<circle cx=\"138\" cy=\"42\" r=\"1.8\" fill=\"#e8f0d8\" opacity=\".55\"/>\n<path fill=\"#3d5a38\" stroke=\"#1e3020\" stroke-width=\".75\" d=\"M90 32 C100 18,120 18,132 32 L124 34 C114 26,102 26,94 34 Z\"/>\n<path fill=\"#3d5a38\" stroke=\"#1e3020\" stroke-width=\".75\" d=\"M100 58 L112 70 L124 58 Z\"/>\n<circle cx=\"36\" cy=\"38\" r=\"4.5\" fill=\"#eef2e4\" stroke=\"#1e3020\" stroke-width=\".6\"/>\n<circle cx=\"37\" cy=\"38\" r=\"2.6\" fill=\"#2a3a20\"/>\n<circle cx=\"37.8\" cy=\"38.2\" r=\"1.3\" fill=\"#111\"/>\n<path fill=\"none\" stroke=\"#1e3020\" stroke-width=\"1\" stroke-linecap=\"round\" d=\"M14 46 C24 50,34 50,44 46\"/>\n",
    muskie: "\n<defs>\n  <linearGradient id=\"g-muskie\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#243828\"/>\n    <stop offset=\"40%\" stop-color=\"#4a6840\"/>\n    <stop offset=\"100%\" stop-color=\"#c5d0b0\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-muskie)\" stroke=\"#152018\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M10 45 C18 36,34 32,52 31 C78 29,110 29,140 32 C156 34,166 38,172 44\n     L202 26 L188 45 L202 64 L172 46 C166 54,154 58,140 60 C110 63,78 62,52 60\n     C34 58,18 52,10 47 C8 46,8 45.5,10 45 Z\"/>\n<path stroke=\"#1a2818\" stroke-width=\"2.2\" fill=\"none\" opacity=\".35\" d=\"M70 34 L70 54\"/>\n<path stroke=\"#1a2818\" stroke-width=\"2.2\" fill=\"none\" opacity=\".35\" d=\"M92 32 L92 56\"/>\n<path stroke=\"#1a2818\" stroke-width=\"2.2\" fill=\"none\" opacity=\".35\" d=\"M114 33 L114 55\"/>\n<path stroke=\"#1a2818\" stroke-width=\"2.2\" fill=\"none\" opacity=\".35\" d=\"M136 34 L136 54\"/>\n<path fill=\"#345038\" stroke=\"#152018\" stroke-width=\".75\" d=\"M95 30 C108 14,130 14,142 30 L134 32 C124 22,110 22,100 32 Z\"/>\n<path fill=\"#345038\" stroke=\"#152018\" stroke-width=\".75\" d=\"M108 58 L122 74 L136 58 Z\"/>\n<circle cx=\"38\" cy=\"37\" r=\"5\" fill=\"#e8ecd8\" stroke=\"#152018\" stroke-width=\".65\"/>\n<circle cx=\"39\" cy=\"37\" r=\"3\" fill=\"#243020\"/>\n<circle cx=\"40\" cy=\"37.3\" r=\"1.5\" fill=\"#0e0e0e\"/>\n<path fill=\"none\" stroke=\"#152018\" stroke-width=\"1.1\" stroke-linecap=\"round\" d=\"M12 47 C24 52,36 52,48 47\"/>\n",
    bass: "\n<defs>\n  <linearGradient id=\"g-bass\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#2a3a22\"/>\n    <stop offset=\"40%\" stop-color=\"#5a7040\"/>\n    <stop offset=\"75%\" stop-color=\"#b8a050\"/>\n    <stop offset=\"100%\" stop-color=\"#f0ead8\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-bass)\" stroke=\"#1e2a16\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M28 46 C34 30,52 20,78 18 C104 16,130 22,150 32 C158 38,162 44,162 48\n     L188 30 L174 48 L188 66 L162 52 C158 60,148 68,130 72 C104 78,78 76,56 68\n     C42 62,32 54,28 48 C26 47,26 46.5,28 46 Z\"/>\n<path stroke=\"#1a2010\" stroke-width=\"3.5\" fill=\"none\" opacity=\".4\" stroke-linecap=\"round\" d=\"M58 46 C90 44,120 46,150 48\"/>\n<path fill=\"#3a4a28\" stroke=\"#1e2a16\" stroke-width=\".8\" d=\"M70 20 C88 4,118 6,132 22 L122 24 C110 14,90 12,76 22 Z\"/>\n<path fill=\"#3a4a28\" stroke=\"#1e2a16\" stroke-width=\".8\" d=\"M90 68 L108 84 L124 68 Z\"/>\n<circle cx=\"48\" cy=\"36\" r=\"5.5\" fill=\"#f2efe4\" stroke=\"#1e2a16\" stroke-width=\".65\"/>\n<circle cx=\"49\" cy=\"36\" r=\"3.3\" fill=\"#c9a227\"/>\n<circle cx=\"50\" cy=\"36.3\" r=\"1.7\" fill=\"#111\"/>\n<path fill=\"none\" stroke=\"#1e2a16\" stroke-width=\"1.2\" stroke-linecap=\"round\" d=\"M30 48 C40 56,52 56,62 48\"/>\n",
    trout: "\n<defs>\n  <linearGradient id=\"g-trout\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#3a5a48\"/>\n    <stop offset=\"35%\" stop-color=\"#7a9a78\"/>\n    <stop offset=\"55%\" stop-color=\"#d08090\"/>\n    <stop offset=\"100%\" stop-color=\"#e8e4d4\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-trout)\" stroke=\"#243828\" stroke-width=\"1.1\" stroke-linejoin=\"round\"\n  d=\"M20 46 C28 36,44 30,66 28 C92 26,120 28,146 34 C156 38,162 42,164 46\n     L192 28 L178 46 L192 64 L164 50 C160 56,150 60,136 62 C110 66,84 66,60 62\n     C42 58,28 52,20 48 C18 47,18 46.5,20 46 Z\"/>\n<path stroke=\"#c06078\" stroke-width=\"4\" fill=\"none\" opacity=\".55\" stroke-linecap=\"round\" d=\"M55 46 C90 44,125 46,155 48\"/>\n<circle cx=\"70\" cy=\"36\" r=\"1.4\" fill=\"#1a2018\"/>\n<circle cx=\"88\" cy=\"34\" r=\"1.3\" fill=\"#1a2018\"/>\n<circle cx=\"106\" cy=\"37\" r=\"1.4\" fill=\"#1a2018\"/>\n<circle cx=\"124\" cy=\"35\" r=\"1.2\" fill=\"#1a2018\"/>\n<circle cx=\"142\" cy=\"38\" r=\"1.2\" fill=\"#1a2018\"/>\n<path fill=\"#4a6850\" stroke=\"#243828\" stroke-width=\".75\" d=\"M85 28 C98 14,122 14,134 28 L126 30 C116 22,100 22,90 30 Z\"/>\n<path fill=\"#4a6850\" stroke=\"#243828\" stroke-width=\".75\" d=\"M100 60 L114 72 L128 60 Z\"/>\n<circle cx=\"42\" cy=\"38\" r=\"4.8\" fill=\"#f0ece0\" stroke=\"#243828\" stroke-width=\".6\"/>\n<circle cx=\"43\" cy=\"38\" r=\"2.8\" fill=\"#2a3830\"/>\n<circle cx=\"43.8\" cy=\"38.2\" r=\"1.4\" fill=\"#111\"/>\n<path fill=\"none\" stroke=\"#243828\" stroke-width=\"1\" stroke-linecap=\"round\" d=\"M22 47 C32 50,42 50,50 46\"/>\n",
    crappie: "\n<defs>\n  <linearGradient id=\"g-crappie\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#2c343c\"/>\n    <stop offset=\"40%\" stop-color=\"#7a8794\"/>\n    <stop offset=\"100%\" stop-color=\"#e4e8ec\"/>\n  </linearGradient>\n</defs>\n<!-- elongated oval / diamond panfish profile -->\n<path fill=\"url(#g-crappie)\" stroke=\"#1a2028\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M36 46\n     C40 30, 58 18, 82 16\n     C108 14, 136 20, 152 32\n     C160 38, 164 44, 164 48\n     L186 32 L174 48 L186 64\n     L164 52\n     C160 60, 150 70, 132 74\n     C108 78, 82 76, 60 68\n     C46 62, 38 54, 36 48\n     C34 47, 34 46.5, 36 46 Z\"/>\n<!-- soft irregular mottling (not random fleck dots) -->\n<path fill=\"#2a323a\" opacity=\".28\" d=\"M70 28 C78 24, 88 28, 90 36 C86 40, 74 38, 70 32 Z\"/>\n<path fill=\"#2a323a\" opacity=\".24\" d=\"M98 30 C110 26, 122 32, 120 42 C112 46, 98 42, 98 30 Z\"/>\n<path fill=\"#2a323a\" opacity=\".22\" d=\"M78 48 C90 46, 102 52, 98 60 C88 64, 76 58, 78 48 Z\"/>\n<path fill=\"#2a323a\" opacity=\".2\" d=\"M118 44 C130 42, 140 48, 136 56 C126 58, 116 52, 118 44 Z\"/>\n<path fill=\"#3a4450\" stroke=\"#1a2028\" stroke-width=\".8\"\n  d=\"M78 18 C94 4, 124 6, 140 22 L130 26 C118 16, 98 14, 84 22 Z\"/>\n<path fill=\"#3a4450\" stroke=\"#1a2028\" stroke-width=\".8\"\n  d=\"M86 70 C102 84, 130 84, 146 68 L136 64 C124 76, 104 76, 92 68 Z\"/>\n<path fill=\"#3a4450\" stroke=\"#1a2028\" stroke-width=\".8\" d=\"M164 48 L186 32 L174 48 L186 64 Z\"/>\n<circle cx=\"58\" cy=\"38\" r=\"5.2\" fill=\"#e8ecf0\" stroke=\"#1a2028\" stroke-width=\".65\"/>\n<circle cx=\"59\" cy=\"38\" r=\"3.1\" fill=\"#c9a227\"/>\n<circle cx=\"60\" cy=\"38.3\" r=\"1.6\" fill=\"#111\"/>\n<path fill=\"none\" stroke=\"#1a2028\" stroke-width=\"1\" stroke-linecap=\"round\" d=\"M38 48 C46 52, 54 52, 62 48\"/>\n",
    bluegill: "\n<defs>\n  <linearGradient id=\"g-bluegill\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#2e4a24\"/>\n    <stop offset=\"35%\" stop-color=\"#5a7a32\"/>\n    <stop offset=\"62%\" stop-color=\"#c47828\"/>\n    <stop offset=\"100%\" stop-color=\"#f0c878\"/>\n  </linearGradient>\n</defs>\n<!-- MN bluegill: deeper mid-body but longer than tall, pointed snout, continuous dorsal -->\n<path fill=\"url(#g-bluegill)\" stroke=\"#243818\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M34 47\n     C38 32, 54 20, 78 17\n     C104 14, 132 20, 150 32\n     C158 38, 162 44, 162 48\n     L184 34 L172 48 L184 62\n     L162 52\n     C156 62, 142 72, 120 76\n     C96 80, 72 76, 54 66\n     C42 58, 36 52, 34 48\n     C32 47.2, 32 46.8, 34 47 Z\"/>\n<!-- soft vertical bars -->\n<path stroke=\"#2a3818\" stroke-width=\"3.2\" fill=\"none\" opacity=\".18\" stroke-linecap=\"round\" d=\"M78 22 L78 70\"/>\n<path stroke=\"#2a3818\" stroke-width=\"3.2\" fill=\"none\" opacity=\".16\" stroke-linecap=\"round\" d=\"M98 20 L98 72\"/>\n<path stroke=\"#2a3818\" stroke-width=\"3\" fill=\"none\" opacity=\".14\" stroke-linecap=\"round\" d=\"M118 22 L118 70\"/>\n<path stroke=\"#2a3818\" stroke-width=\"2.6\" fill=\"none\" opacity=\".12\" stroke-linecap=\"round\" d=\"M136 28 L136 66\"/>\n<!-- long continuous dorsal -->\n<path fill=\"#3d5a28\" stroke=\"#243818\" stroke-width=\".8\"\n  d=\"M72 20 C90 4, 128 4, 148 22 L138 26 C122 14, 96 12, 80 22 Z\"/>\n<!-- anal -->\n<path fill=\"#3d5a28\" stroke=\"#243818\" stroke-width=\".8\"\n  d=\"M92 72 C108 86, 132 84, 148 68 L138 64 C126 76, 108 78, 96 70 Z\"/>\n<!-- caudal -->\n<path fill=\"#3d5a28\" stroke=\"#243818\" stroke-width=\".8\" d=\"M162 48 L184 34 L172 48 L184 62 Z\"/>\n<!-- dark opercular ear flap (classic bluegill) -->\n<path fill=\"#0e0e0e\" d=\"M52 36 C48 34, 46 38, 46 42 C46 48, 50 50, 56 48 C54 44, 54 40, 52 36 Z\"/>\n<!-- blue sheen on cheek -->\n<path fill=\"#4a8ab0\" opacity=\".35\" d=\"M50 40 C54 36, 60 38, 62 44 C58 48, 50 46, 50 40 Z\"/>\n<circle cx=\"60\" cy=\"36\" r=\"5\" fill=\"#f4f0e0\" stroke=\"#243818\" stroke-width=\".65\"/>\n<circle cx=\"61\" cy=\"36\" r=\"3\" fill=\"#c9a227\"/>\n<circle cx=\"62\" cy=\"36.3\" r=\"1.5\" fill=\"#111\"/>\n<path fill=\"none\" stroke=\"#243818\" stroke-width=\"1\" stroke-linecap=\"round\" d=\"M36 48 C44 52, 52 52, 60 47\"/>\n",
  };

  let mySpecies = "0";
  let myFishG = 16;
  let myFishL = 25;
  let speciesKey = "default";

  const speciesEl = document.getElementById("Species");
  const lengthSlider = document.getElementById("slider-length");
  const girthSlider = document.getElementById("slider-girth");
  const amountEl = document.getElementById("amount");
  const girthEl = document.getElementById("girth");
  const weightEl = document.getElementById("weight");
  const dimGirth = document.getElementById("dim-girth");
  const dimLengthValue = document.getElementById("dim-length-value");
  const dimGirthValue = document.getElementById("dim-girth-value");
  const fishGroup = document.getElementById("fish-group");

  function speciesUsesGirth(specie) {
    switch (String(specie)) {
      case "2":
      case "4":
        return false;
      default:
        return true;
    }
  }

  function currentSpeciesKey() {
    const opt = speciesEl.options[speciesEl.selectedIndex];
    return (opt && opt.dataset.species) || "default";
  }

  function setGirthVisible(visible) {
    if (dimGirth) dimGirth.hidden = !visible;
  }

  function calcWgt() {
    switch (mySpecies) {
      case "2":
        return (myFishL * myFishL * myFishL) / 3500;
      case "3":
        return (myFishL * myFishL * myFishG) / 1200;
      case "4":
        return (myFishL * myFishL * myFishL) / 1200;
      default:
        return (myFishG * myFishG * myFishL) / 800;
    }
  }

  function toLbs(wgt) {
    const lbs = Math.floor(wgt);
    const oz = Math.round((wgt - lbs) * 16);
    return lbs + " Lbs " + oz + " Oz";
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function renderSpeciesArt() {
    speciesKey = currentSpeciesKey();
    if (!fishGroup) return;
    fishGroup.innerHTML = SPECIES_ART[speciesKey] || SPECIES_ART.default;
  }

  function updateFishVisual() {
    const lenT = (myFishL - LEN_MIN) / (LEN_MAX - LEN_MIN);
    const useGirth = speciesUsesGirth(mySpecies);
    const sx = lerp(0.55, 1.35, lenT);
    let sy;

    if (useGirth) {
      const girthT = (myFishG - GIRTH_MIN) / (GIRTH_MAX - GIRTH_MIN);
      sy = lerp(0.45, 1.45, girthT);
    } else {
      // Length-only: grow with length but keep species proportions
      const aspect = SPECIES_ASPECT[speciesKey] || 0.7;
      sy = sx * aspect;
      // Panfish stay a bit deeper at small sizes; pike stay slim
      if (speciesKey === "crappie" || speciesKey === "bluegill") {
        sy = Math.max(sy, lerp(0.62, 1.05, lenT));
      }
      if (speciesKey === "pike") {
        sy = Math.min(sy, sx * 0.5);
      }
      if (speciesKey === "muskie") {
        sy = Math.min(sy, sx * 0.75);
      }
    }

    if (fishGroup) {
      fishGroup.setAttribute(
        "transform",
        "translate(110 45) scale(" + sx + " " + sy + ") translate(-110 -45)",
      );
    }

    if (dimLengthValue) dimLengthValue.textContent = myFishL + "\"";
    if (dimGirthValue) dimGirthValue.textContent = myFishG + "\"";
  }

  function refreshAll() {
    weightEl.value = toLbs(calcWgt());
    updateFishVisual();
  }

  function onSpeciesChange() {
    mySpecies = speciesEl.value;
    speciesKey = currentSpeciesKey();
    setGirthVisible(speciesUsesGirth(mySpecies));
    renderSpeciesArt();
    refreshAll();
  }

  function onLengthInput() {
    myFishL = parseFloat(lengthSlider.value);
    amountEl.value = String(myFishL);
    refreshAll();
  }

  function onGirthInput() {
    myFishG = parseFloat(girthSlider.value);
    girthEl.value = String(myFishG);
    refreshAll();
  }

  speciesEl.addEventListener("change", onSpeciesChange);
  lengthSlider.addEventListener("input", onLengthInput);
  girthSlider.addEventListener("input", onGirthInput);

  amountEl.value = lengthSlider.value;
  girthEl.value = girthSlider.value;
  myFishL = parseFloat(lengthSlider.value);
  myFishG = parseFloat(girthSlider.value);
  onSpeciesChange();
})();
