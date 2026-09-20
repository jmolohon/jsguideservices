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
    muskie: 0.45,
    crappie: 1.05,
    bluegill: 1.12,
  };

  const SPECIES_ART = {
    default: "\n<defs>\n  <linearGradient id=\"g-walleye\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#2f451c\"/>\n    <stop offset=\"30%\" stop-color=\"#6f8a32\"/>\n    <stop offset=\"65%\" stop-color=\"#c4a03a\"/>\n    <stop offset=\"100%\" stop-color=\"#f7f2e6\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-walleye)\" stroke=\"#2a3814\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M18 46 C22 40,28 34,36 32 C48 28,62 26,78 25 C100 24,122 26,142 30 C152 32,158 36,162 42\n     L188 22 L176 45 L190 68 L162 48 C158 54,150 58,140 60 C118 64,96 66,74 64 C58 62,44 58,34 54\n     C28 52,22 50,18 48 C16 47,16 46.5,18 46 Z\"/>\n<ellipse cx=\"86\" cy=\"36\" rx=\"11\" ry=\"7\" fill=\"#3d5220\" opacity=\".28\"/>\n<ellipse cx=\"112\" cy=\"34\" rx=\"10\" ry=\"6\" fill=\"#3d5220\" opacity=\".24\"/>\n<path fill=\"#5a6e28\" stroke=\"#2a3814\" stroke-width=\".8\" d=\"M72 26 C80 10,102 9,114 24 L108 26 C98 16,84 16,76 26 Z\"/>\n<ellipse cx=\"108\" cy=\"22\" rx=\"3.2\" ry=\"2.4\" fill=\"#1a1a1a\" opacity=\".85\"/>\n<path fill=\"#5a6e28\" stroke=\"#2a3814\" stroke-width=\".8\" d=\"M118 26 C128 14,142 16,148 28 L140 30 C134 22,124 22,118 28 Z\"/>\n<path fill=\"#f5f5f0\" stroke=\"#2a3814\" stroke-width=\".7\" d=\"M176 52 L190 68 L168 56 Z\"/>\n<circle cx=\"44\" cy=\"36\" r=\"6.2\" fill=\"#f7f4e8\" stroke=\"#2a3814\" stroke-width=\".7\"/>\n<circle cx=\"45\" cy=\"36\" r=\"4.1\" fill=\"#c9a227\"/>\n<circle cx=\"46\" cy=\"36.3\" r=\"2.1\" fill=\"#141414\"/>\n<path fill=\"none\" stroke=\"#2a3814\" stroke-width=\"1.05\" stroke-linecap=\"round\" d=\"M20 47 C30 50,40 51,52 48\"/>\n",
    walleye: "\n<defs>\n  <linearGradient id=\"g-walleye\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#2f451c\"/>\n    <stop offset=\"30%\" stop-color=\"#6f8a32\"/>\n    <stop offset=\"65%\" stop-color=\"#c4a03a\"/>\n    <stop offset=\"100%\" stop-color=\"#f7f2e6\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-walleye)\" stroke=\"#2a3814\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M18 46 C22 40,28 34,36 32 C48 28,62 26,78 25 C100 24,122 26,142 30 C152 32,158 36,162 42\n     L188 22 L176 45 L190 68 L162 48 C158 54,150 58,140 60 C118 64,96 66,74 64 C58 62,44 58,34 54\n     C28 52,22 50,18 48 C16 47,16 46.5,18 46 Z\"/>\n<ellipse cx=\"86\" cy=\"36\" rx=\"11\" ry=\"7\" fill=\"#3d5220\" opacity=\".28\"/>\n<ellipse cx=\"112\" cy=\"34\" rx=\"10\" ry=\"6\" fill=\"#3d5220\" opacity=\".24\"/>\n<path fill=\"#5a6e28\" stroke=\"#2a3814\" stroke-width=\".8\" d=\"M72 26 C80 10,102 9,114 24 L108 26 C98 16,84 16,76 26 Z\"/>\n<ellipse cx=\"108\" cy=\"22\" rx=\"3.2\" ry=\"2.4\" fill=\"#1a1a1a\" opacity=\".85\"/>\n<path fill=\"#5a6e28\" stroke=\"#2a3814\" stroke-width=\".8\" d=\"M118 26 C128 14,142 16,148 28 L140 30 C134 22,124 22,118 28 Z\"/>\n<path fill=\"#f5f5f0\" stroke=\"#2a3814\" stroke-width=\".7\" d=\"M176 52 L190 68 L168 56 Z\"/>\n<circle cx=\"44\" cy=\"36\" r=\"6.2\" fill=\"#f7f4e8\" stroke=\"#2a3814\" stroke-width=\".7\"/>\n<circle cx=\"45\" cy=\"36\" r=\"4.1\" fill=\"#c9a227\"/>\n<circle cx=\"46\" cy=\"36.3\" r=\"2.1\" fill=\"#141414\"/>\n<path fill=\"none\" stroke=\"#2a3814\" stroke-width=\"1.05\" stroke-linecap=\"round\" d=\"M20 47 C30 50,40 51,52 48\"/>\n",
    pike: "\n<defs>\n  <linearGradient id=\"g-pike\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#2d4a32\"/>\n    <stop offset=\"45%\" stop-color=\"#5a7a48\"/>\n    <stop offset=\"100%\" stop-color=\"#d8e0c8\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-pike)\" stroke=\"#1e3020\" stroke-width=\"1.1\" stroke-linejoin=\"round\"\n  d=\"M12 45 C20 38,32 34,48 33 C70 31,100 30,130 32 C148 34,160 38,168 44\n     L198 28 L184 45 L198 62 L168 46 C160 52,148 56,130 58 C100 60,70 59,48 57\n     C32 56,20 52,12 47 C10 46,10 45.5,12 45 Z\"/>\n<circle cx=\"58\" cy=\"40\" r=\"2.2\" fill=\"#e8f0d8\" opacity=\".7\"/>\n<circle cx=\"78\" cy=\"38\" r=\"2\" fill=\"#e8f0d8\" opacity=\".65\"/>\n<circle cx=\"98\" cy=\"41\" r=\"2.1\" fill=\"#e8f0d8\" opacity=\".65\"/>\n<circle cx=\"118\" cy=\"39\" r=\"1.9\" fill=\"#e8f0d8\" opacity=\".6\"/>\n<circle cx=\"138\" cy=\"42\" r=\"1.8\" fill=\"#e8f0d8\" opacity=\".55\"/>\n<path fill=\"#3d5a38\" stroke=\"#1e3020\" stroke-width=\".75\" d=\"M90 32 C100 18,120 18,132 32 L124 34 C114 26,102 26,94 34 Z\"/>\n<path fill=\"#3d5a38\" stroke=\"#1e3020\" stroke-width=\".75\" d=\"M100 58 L112 70 L124 58 Z\"/>\n<circle cx=\"36\" cy=\"38\" r=\"4.5\" fill=\"#eef2e4\" stroke=\"#1e3020\" stroke-width=\".6\"/>\n<circle cx=\"37\" cy=\"38\" r=\"2.6\" fill=\"#2a3a20\"/>\n<circle cx=\"37.8\" cy=\"38.2\" r=\"1.3\" fill=\"#111\"/>\n<path fill=\"none\" stroke=\"#1e3020\" stroke-width=\"1\" stroke-linecap=\"round\" d=\"M14 46 C24 50,34 50,44 46\"/>\n",
    muskie: "\n<defs>\n  <linearGradient id=\"g-muskie\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#243828\"/>\n    <stop offset=\"40%\" stop-color=\"#4a6840\"/>\n    <stop offset=\"100%\" stop-color=\"#c5d0b0\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-muskie)\" stroke=\"#152018\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M10 45 C18 36,34 32,52 31 C78 29,110 29,140 32 C156 34,166 38,172 44\n     L202 26 L188 45 L202 64 L172 46 C166 54,154 58,140 60 C110 63,78 62,52 60\n     C34 58,18 52,10 47 C8 46,8 45.5,10 45 Z\"/>\n<path stroke=\"#1a2818\" stroke-width=\"2.2\" fill=\"none\" opacity=\".35\" d=\"M70 34 L70 54\"/>\n<path stroke=\"#1a2818\" stroke-width=\"2.2\" fill=\"none\" opacity=\".35\" d=\"M92 32 L92 56\"/>\n<path stroke=\"#1a2818\" stroke-width=\"2.2\" fill=\"none\" opacity=\".35\" d=\"M114 33 L114 55\"/>\n<path stroke=\"#1a2818\" stroke-width=\"2.2\" fill=\"none\" opacity=\".35\" d=\"M136 34 L136 54\"/>\n<path fill=\"#345038\" stroke=\"#152018\" stroke-width=\".75\" d=\"M95 30 C108 14,130 14,142 30 L134 32 C124 22,110 22,100 32 Z\"/>\n<path fill=\"#345038\" stroke=\"#152018\" stroke-width=\".75\" d=\"M108 58 L122 74 L136 58 Z\"/>\n<circle cx=\"38\" cy=\"37\" r=\"5\" fill=\"#e8ecd8\" stroke=\"#152018\" stroke-width=\".65\"/>\n<circle cx=\"39\" cy=\"37\" r=\"3\" fill=\"#243020\"/>\n<circle cx=\"40\" cy=\"37.3\" r=\"1.5\" fill=\"#0e0e0e\"/>\n<path fill=\"none\" stroke=\"#152018\" stroke-width=\"1.1\" stroke-linecap=\"round\" d=\"M12 47 C24 52,36 52,48 47\"/>\n",
    bass: "\n<defs>\n  <linearGradient id=\"g-bass\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#2a3a22\"/>\n    <stop offset=\"40%\" stop-color=\"#5a7040\"/>\n    <stop offset=\"75%\" stop-color=\"#b8a050\"/>\n    <stop offset=\"100%\" stop-color=\"#f0ead8\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-bass)\" stroke=\"#1e2a16\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M28 46 C34 30,52 20,78 18 C104 16,130 22,150 32 C158 38,162 44,162 48\n     L188 30 L174 48 L188 66 L162 52 C158 60,148 68,130 72 C104 78,78 76,56 68\n     C42 62,32 54,28 48 C26 47,26 46.5,28 46 Z\"/>\n<path stroke=\"#1a2010\" stroke-width=\"3.5\" fill=\"none\" opacity=\".4\" stroke-linecap=\"round\" d=\"M58 46 C90 44,120 46,150 48\"/>\n<path fill=\"#3a4a28\" stroke=\"#1e2a16\" stroke-width=\".8\" d=\"M70 20 C88 4,118 6,132 22 L122 24 C110 14,90 12,76 22 Z\"/>\n<path fill=\"#3a4a28\" stroke=\"#1e2a16\" stroke-width=\".8\" d=\"M90 68 L108 84 L124 68 Z\"/>\n<circle cx=\"48\" cy=\"36\" r=\"5.5\" fill=\"#f2efe4\" stroke=\"#1e2a16\" stroke-width=\".65\"/>\n<circle cx=\"49\" cy=\"36\" r=\"3.3\" fill=\"#c9a227\"/>\n<circle cx=\"50\" cy=\"36.3\" r=\"1.7\" fill=\"#111\"/>\n<path fill=\"none\" stroke=\"#1e2a16\" stroke-width=\"1.2\" stroke-linecap=\"round\" d=\"M30 48 C40 56,52 56,62 48\"/>\n",
    trout: "\n<defs>\n  <linearGradient id=\"g-trout\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#3a5a48\"/>\n    <stop offset=\"35%\" stop-color=\"#7a9a78\"/>\n    <stop offset=\"55%\" stop-color=\"#d08090\"/>\n    <stop offset=\"100%\" stop-color=\"#e8e4d4\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-trout)\" stroke=\"#243828\" stroke-width=\"1.1\" stroke-linejoin=\"round\"\n  d=\"M20 46 C28 36,44 30,66 28 C92 26,120 28,146 34 C156 38,162 42,164 46\n     L192 28 L178 46 L192 64 L164 50 C160 56,150 60,136 62 C110 66,84 66,60 62\n     C42 58,28 52,20 48 C18 47,18 46.5,20 46 Z\"/>\n<path stroke=\"#c06078\" stroke-width=\"4\" fill=\"none\" opacity=\".55\" stroke-linecap=\"round\" d=\"M55 46 C90 44,125 46,155 48\"/>\n<circle cx=\"70\" cy=\"36\" r=\"1.4\" fill=\"#1a2018\"/>\n<circle cx=\"88\" cy=\"34\" r=\"1.3\" fill=\"#1a2018\"/>\n<circle cx=\"106\" cy=\"37\" r=\"1.4\" fill=\"#1a2018\"/>\n<circle cx=\"124\" cy=\"35\" r=\"1.2\" fill=\"#1a2018\"/>\n<circle cx=\"142\" cy=\"38\" r=\"1.2\" fill=\"#1a2018\"/>\n<path fill=\"#4a6850\" stroke=\"#243828\" stroke-width=\".75\" d=\"M85 28 C98 14,122 14,134 28 L126 30 C116 22,100 22,90 30 Z\"/>\n<path fill=\"#4a6850\" stroke=\"#243828\" stroke-width=\".75\" d=\"M100 60 L114 72 L128 60 Z\"/>\n<circle cx=\"42\" cy=\"38\" r=\"4.8\" fill=\"#f0ece0\" stroke=\"#243828\" stroke-width=\".6\"/>\n<circle cx=\"43\" cy=\"38\" r=\"2.8\" fill=\"#2a3830\"/>\n<circle cx=\"43.8\" cy=\"38.2\" r=\"1.4\" fill=\"#111\"/>\n<path fill=\"none\" stroke=\"#243828\" stroke-width=\"1\" stroke-linecap=\"round\" d=\"M22 47 C32 50,42 50,50 46\"/>\n",
    crappie: "\n<defs>\n  <linearGradient id=\"g-crappie\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#2a3038\"/>\n    <stop offset=\"50%\" stop-color=\"#6a7888\"/>\n    <stop offset=\"100%\" stop-color=\"#d8dce0\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-crappie)\" stroke=\"#1a2028\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M48 45 C52 22,72 10,100 10 C128 10,150 24,156 45 C150 66,128 78,100 78\n     C72 78,52 68,48 45 Z\"/>\n<path fill=\"#3a4450\" stroke=\"#1a2028\" stroke-width=\".8\" d=\"M78 14 C92 0,120 0,136 16 L126 20 C114 10,96 10,84 18 Z\"/>\n<path fill=\"#3a4450\" stroke=\"#1a2028\" stroke-width=\".8\" d=\"M80 74 C96 90,122 90,138 72 L128 68 C116 80,98 80,86 72 Z\"/>\n<path fill=\"#3a4450\" stroke=\"#1a2028\" stroke-width=\".8\" d=\"M154 45 L178 28 L168 45 L178 62 Z\"/>\n<circle cx=\"78\" cy=\"36\" r=\"1.6\" fill=\"#1a2028\"/>\n<circle cx=\"92\" cy=\"30\" r=\"1.5\" fill=\"#1a2028\"/>\n<circle cx=\"108\" cy=\"34\" r=\"1.6\" fill=\"#1a2028\"/>\n<circle cx=\"120\" cy=\"42\" r=\"1.4\" fill=\"#1a2028\"/>\n<circle cx=\"100\" cy=\"50\" r=\"1.5\" fill=\"#1a2028\"/>\n<circle cx=\"86\" cy=\"54\" r=\"1.3\" fill=\"#1a2028\"/>\n<circle cx=\"64\" cy=\"40\" r=\"5.2\" fill=\"#e8ecf0\" stroke=\"#1a2028\" stroke-width=\".65\"/>\n<circle cx=\"65\" cy=\"40\" r=\"3.1\" fill=\"#c9a227\"/>\n<circle cx=\"66\" cy=\"40.3\" r=\"1.6\" fill=\"#111\"/>\n<path fill=\"none\" stroke=\"#1a2028\" stroke-width=\"1\" stroke-linecap=\"round\" d=\"M50 48 C56 52,62 52,68 48\"/>\n",
    bluegill: "\n<defs>\n  <linearGradient id=\"g-bluegill\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n    <stop offset=\"0%\" stop-color=\"#3a5a28\"/>\n    <stop offset=\"45%\" stop-color=\"#7a9a40\"/>\n    <stop offset=\"75%\" stop-color=\"#d09040\"/>\n    <stop offset=\"100%\" stop-color=\"#f0d090\"/>\n  </linearGradient>\n</defs>\n<path fill=\"url(#g-bluegill)\" stroke=\"#2a3818\" stroke-width=\"1.15\" stroke-linejoin=\"round\"\n  d=\"M50 45 C54 20,76 8,106 8 C136 8,158 22,164 45 C158 68,136 80,106 80\n     C76 80,54 70,50 45 Z\"/>\n<path fill=\"#4a6830\" stroke=\"#2a3818\" stroke-width=\".8\" d=\"M82 12 C98 -2,128 -2,146 14 L136 18 C122 8,102 8,90 16 Z\"/>\n<path fill=\"#4a6830\" stroke=\"#2a3818\" stroke-width=\".8\" d=\"M84 76 C100 92,130 92,148 74 L138 70 C124 82,104 82,92 74 Z\"/>\n<path fill=\"#4a6830\" stroke=\"#2a3818\" stroke-width=\".8\" d=\"M162 45 L186 30 L176 45 L186 60 Z\"/>\n<!-- dark ear flap -->\n<path fill=\"#1a1a1a\" d=\"M58 40 C56 36,54 38,54 42 C54 46,56 48,60 46 C62 44,62 42,58 40 Z\"/>\n<path stroke=\"#2a3818\" stroke-width=\"1.4\" fill=\"none\" opacity=\".25\" d=\"M90 20 L90 70\"/>\n<path stroke=\"#2a3818\" stroke-width=\"1.4\" fill=\"none\" opacity=\".25\" d=\"M110 18 L110 72\"/>\n<path stroke=\"#2a3818\" stroke-width=\"1.4\" fill=\"none\" opacity=\".25\" d=\"M130 22 L130 68\"/>\n<circle cx=\"68\" cy=\"38\" r=\"5\" fill=\"#f4f0e0\" stroke=\"#2a3818\" stroke-width=\".65\"/>\n<circle cx=\"69\" cy=\"38\" r=\"3\" fill=\"#c9a227\"/>\n<circle cx=\"70\" cy=\"38.3\" r=\"1.5\" fill=\"#111\"/>\n<path fill=\"none\" stroke=\"#2a3818\" stroke-width=\"1\" stroke-linecap=\"round\" d=\"M52 48 C58 52,64 52,70 48\"/>\n",
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
        sy = Math.max(sy, lerp(0.75, 1.25, lenT));
      }
      if (speciesKey === "pike" || speciesKey === "muskie") {
        sy = Math.min(sy, sx * 0.5);
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
