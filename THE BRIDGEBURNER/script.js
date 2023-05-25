var char = document.getElementById("char");
var charframe = document.querySelector("svg#charframe")
var defaultChars = document.getElementsByClassName("default-char-option");
var eyeOptions = ["chi Blue"];
/** @param {String} txt */
function format(txt) {
    return txt.replaceAll(' ', '');
}
function getMCoordinates(d){
  
    let dArray = d
    // remove new lines and tabs
    .replace(/[\n\r\t]/g, "")
    // replace comma with space
    .replace(/,/g, " ")
    // add space before minus sign
    .replace(/-/g, " -")
    // decompose multiple decimal delimiters like 0.5.5 => 0.5 0.5
    .replace(/(\.)(\d+)(\.)(\d+)/g, "$1$2 $3$4")
    // split multiple zero valuues like 0 05 => 0 0 5
    .replace(/( )(0)(\d+)/g, "$1 $2 $3")
    // add space between command letter and values
    .replace(/([mlcsqtahvz])/gi, "|$1 ")
    .trim()
    .split(" ")
    .filter(Boolean);
    
    let M = {x: +dArray[1], y: +dArray[2]}
    return M;
    
}
function makeTranformedPath(svg) {
    
}

//./bitmap.svg
window.onload = init;

  function init(){
    /** @type {DocumentFragment} */
    var cd = char.contentDocument;
    var eyes = [cd.getElementById("eye1"),cd.getElementById("eye2")]
    //console.log(eyes)
    fetch('eyes.svg')
        .then(response => response.text())
        .then(svgText => {
            const parser = new DOMParser();
            /** @type {DocumentFragment} */
            const eyesSVG = parser.parseFromString(svgText, 'image/svg+xml');
            //the M  in the "d" attribute tells where the element is.
            //eyesSVG.getElementById("chiBlueEye1")
            //
            
            eyesSVG.getElementById("chiBlueEye1").setAttribute("d", eyesSVG.getElementById("chiBlueEye1").getAttribute("d").replace(`M ${getMCoordinates(eyesSVG.getElementById("chiBlueEye1").getAttribute("d")).x},${getMCoordinates(eyesSVG.getElementById("chiBlueEye1").getAttribute("d")).y}`, 'M ' + getMCoordinates(eyes[0].getAttribute("d")).x + ',' + getMCoordinates(eyes[0].getAttribute("d")).y))
            console.log(getMCoordinates(eyes[0].getAttribute("d")))
            //console.log()
            eyesSVG.getElementById("chiBlueEye1").style.transformOrigin= ""
            eyes[0].replaceWith(eyesSVG.getElementById("chiBlueEye1"))
        });
    
    
  }
char.setAttribute("data", "./bitmap.svg");
char.width = 100;

