
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


const BASE_TEXT = makeid(40);


/**
 * 
 * @param {String} text 
 */

function encryptText(text) {
    const baseText = BASE_TEXT;
    let output = "";
    
    for (let i = 0; i < text.length; i++) {
        //charCodeAt
        let num = baseText.charCodeAt(i%baseText.length) + text.charCodeAt(i);
        output = `${output}${num} `;
    }
    
    return output;
}
/**
 * 
 * @param {String} text 
 */



function decryptText(text) {
    const baseText = BASE_TEXT;
    let output = "";
    const charCodeArray = text.split(' ').map(function(str) { return parseInt(str); });
    var res = [];
    for (let i = 0; i < charCodeArray.length; i++) {
        //array.join
        let num = charCodeArray[i] - baseText.charCodeAt(i%baseText.length);
        res.push(String.fromCharCode(num));
    }
    output = res.join("");
    return output;
}