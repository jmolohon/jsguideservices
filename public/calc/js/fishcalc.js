// JavaScript Document
var mySpecies = "0";
var myFishG = 4;
var myFishL = 8;

/** Species that use girth in the weight formula */
function speciesUsesGirth(specie) {
  switch (String(specie)) {
    case "2": // Northern Pike, Muskie — length only
    case "4": // Crappie, Bluegill — length only
      return false;
    case "1": // Walleye
    case "3": // Bass
    case "0": // Default / Trout
    default:
      return true;
  }
}

function setGirthVisible(visible) {
  var $girthSlider = $("#slider-vertical");
  var $girthRow = $("#jsx");
  if (visible) {
    $girthSlider.show();
    $girthRow.show();
  } else {
    $girthSlider.hide();
    $girthRow.hide();
  }
}

function fnSpeciesChange(specie) {
  mySpecies = specie;
  setGirthVisible(speciesUsesGirth(specie));
  $("#weight").val(toLbs(calcWgt()));
}

function calcWgt() {
  switch (mySpecies) {
    // 2010.05.25 JS - Walleye calc must use girth
    // case "1":
    //   return (myFishL * myFishL * myFishL) / 2700;
    case "2":
      return (myFishL * myFishL * myFishL) / 3500;
    case "3":
      return (myFishL * myFishL * myFishG) / 1200;
    case "4":
      return (myFishL * myFishL * myFishL) / 1200;
    default:
      // Walleye (1), Trout (0), and default — length + girth
      return (myFishG * myFishG * myFishL) / 800;
  }
}

function toLbs(wgt) {
  var lbs = Math.floor(wgt);
  var oz = Math.round((wgt - lbs) * 16);
  return lbs + " Lbs " + oz + " Oz";
}

$(function () {
  $("#slider-horizontal").slider({
    range: "min",
    min: 8,
    max: 42,
    step: 0.5,
    value: 8,
    slide: function (event, ui) {
      $("#amount").val(ui.value);
      myFishL = ui.value;
      $("#weight").val(toLbs(calcWgt()));
    },
  });
  $("#amount").val($("#slider-horizontal").slider("value"));

  $("#slider-vertical").slider({
    orientation: "vertical",
    range: "min",
    min: 4,
    max: 26,
    step: 0.5,
    value: 4,
    slide: function (event, ui) {
      $("#girth").val(ui.value);
      myFishG = ui.value;
      $("#weight").val(toLbs(calcWgt()));
    },
  });
  $("#girth").val($("#slider-vertical").slider("value"));

  // Match UI to the initially selected species
  setGirthVisible(speciesUsesGirth($("#Species").val()));
  $("#weight").val(toLbs(calcWgt()));
});
