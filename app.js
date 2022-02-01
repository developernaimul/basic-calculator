var vars = {
    display: document.getElementsByClassName("display-main")[0],
    displayInfo: document.getElementsByClassName("display-operations")[0],
    displayInd: document.getElementsByClassName("display-indicate")[0],
    ac: document.getElementsByClassName("ac")[0],
    ce: document.getElementsByClassName("ce")[0],
    div: document.getElementsByClassName("div")[0],
    mult: document.getElementsByClassName("mult")[0],
    minus: document.getElementsByClassName("minus")[0],
    plus: document.getElementsByClassName("plus")[0],
    eq: document.getElementsByClassName("eq")[0],
    dot: document.getElementsByClassName("dot")[0],
    zero: document.getElementsByClassName("zero")[0],
    one: document.getElementsByClassName("one")[0],
    two: document.getElementsByClassName("two")[0],
    three: document.getElementsByClassName("three")[0],
    four: document.getElementsByClassName("four")[0],
    five: document.getElementsByClassName("five")[0],
    six: document.getElementsByClassName("six")[0],
    seven: document.getElementsByClassName("seven")[0],
    eight: document.getElementsByClassName("eight")[0],
    nine: document.getElementsByClassName("nine")[0]
  }
  //hundlers

for (var btn in vars) {
  if (btn === "display" || btn === "displayInfo" || btn === "displayInd") continue;
  (function(button) {
    vars[button].addEventListener("click", function() {
      calculate(button);
    });

    if (button === "ac" || button === "ce" || button === "eq") {
      document.addEventListener("keyup", function(event) {
        if(button === getChar(event, true)){
          calculate(getChar(event,true))
        }
      });
    } else {
      document.addEventListener("keypress", function(event) {
        if (toStr(button) === getChar(event)) {
          calculate(getChar(event), true);
        }
      });
    }
  })(btn);
}

function getChar(event, add) {
  var keyMap = {
    13 : "eq",
    35 : "ce",
    46 : "ac"
  };
  
  if (add) {
    return keyMap[event.which];
  } else {
    if (event.which == null) {
      if (event.keyCode < 32) return "eq"
      return String.fromCharCode(event.keyCode)
    }

    if (event.which != 0 && event.charCode != 0) {
      if (event.which < 32) return "eq"
      return String.fromCharCode(event.which);
    }
  }

  return ""
}

function toStr(btn) {
  var btns = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    zero: "0",
    div: "/",
    mult: "*",
    plus: "+",
    minus: "-",
    dot: "."
  }
  if (btn === "ce") return ""
  return btns[btn];
}

function removeZero(str) {
  var result = str;

  var senseOperators = ["+", "-"]

  var dotCond, firstZero, operZero;

  for (var i = 0; i < result.length - 1; i++) {

    dotCond = (result[i + 1] !== ".");
    firstZero = (i === 0) && (result[i] === "0") && dotCond;
    operZero = (senseOperators.indexOf(result[i - 1]) !== -1) && (result[i] === "0") && dotCond;

    if (firstZero || operZero) {
      result = result.slice(0, i) + result.slice(i + 1);
      ++i;
    }
  }

  return result

}

function fixOper(str) {
  var result = str;
  var operators1 = ["*", "/"];
  var operators2 = ["+", "-"];
  var cond, optCond;

  for (var i = 0; i < result.length - 1; i++) {
    cond = operators1.indexOf(result[i]) !== -1 && operators1.indexOf(result[i + 1]) !== -1;

    if (cond) {
      result = result.slice(0, i) + result.slice(i + 1);
    }
  }

  for (i = 0; i < result.length - 1; i++) {
    cond = operators2.indexOf(result[i]) !== -1 && (result[i] === result[i + 1]);
    optCond = (result[i] === "-") && (result[i + 1] === "+");

    if (cond) {
      result = result.slice(0, i) + result.slice(i + 1);
    } else if (optCond) {
      result = result.slice(0, i + 1) + result.slice(i + 2)
    }
  }

  for (i = 0; i < result.length - 2; i++) {
    if (operators1.indexOf(result[i]) !== -1 && operators2.indexOf(result[i + 1]) !== -1 && operators1.indexOf(result[i + 2]) !== -1) {
      result = result.slice(0, i + 2) + result.slice(i + 3);
    }
  }

  for (i = 0; i < result.length - 1; i++) {
    if (operators2.indexOf(result[i]) !== -1 && operators1.indexOf(result[i + 1]) !== -1) {
      result = result.slice(0, i + 1) + result.slice(i + 2)
    }
  }

  if (operators1.indexOf(result[0]) !== -1) {
    result = "0";
  }

  return result;
}

function removeLast(str) {
  var operators = ["+", "-", "*", "/"],
    cond, result = str;
  if (str.length === 1) {
    return "0";
  } else {
    for (var i = result.length - 1; i > 0; i--) {
      if (operators.indexOf(result[i]) !== -1) {
        return result.slice(0, i);
      } else if (operators.indexOf(result[i - 1]) !== -1) {
        return result.slice(0, i);
      } else continue;
    }
  }
}

var max = {
  add: function() {
    if (!vars.displayInd.classList.toggle("max")) {
      vars.displayInd.classList.toggle("max");
    }
  },
  remove: function() {
    if (vars.displayInd.classList.toggle("max")) {
      vars.displayInd.classList.toggle("max");
    }
  }
}

function calculate(btn, isFromKey) {
  var operators = ["minus", "plus", "div", "mult"];

  if (btn === "ac") {
    vars.display.innerText = "0";
    vars.displayInfo.innerText = "0";
    max.remove();
    return;
  }

  if (btn === "ce") {
    var result = removeLast(vars.displayInfo.innerText);
    if (!result) {
      vars.displayInfo.innerText = "0";
    } else {
      vars.displayInfo.innerText = result;
    }
    max.remove();
  }

  if (btn === "eq") {
    vars.displayInfo.innerText = vars.display.innerText;
    max.remove();
    return;
  }

  var operations = vars.displayInfo.innerText;

  if (operations.length < 32) {
    if (isFromKey) {
      operations += btn;
    } else {
      operations += toStr(btn);
    }
  } else {
    max.add();
  }

  operations = removeZero(operations);
  operations = fixOper(operations);
  vars.displayInfo.innerText = operations;

  var calc = "" + eval(vars.display.innerText);
  if (operators.indexOf(btn) === -1) {
    calc = "" + eval(operations);
  }

  if (calc.length < 14) {
    if (!calc) {
      vars.display.innerText = "0";
    } else {
      vars.display.innerText = calc;
    }

  } else if (calc < 1) {
    vars.display.innerText = (+calc).toPrecision(7);
  } else {
    vars.display.innerText = (+calc).toPrecision(9);
  }

}

var colors = ["pink", "lightblue"];
function getBinaryRnd (){
  var rnd = Math.random();
  if (rnd > 0.5) return 1;
  else return 0;
}
document.body.style.background = colors[getBinaryRnd()];