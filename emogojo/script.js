const emojis = ["✌","😂", "🤓", "😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚"];
const emojiDescriptions = [
    "Peace sign",
    "Face with tears of joy",
    "Nerdy face",
    "Squinting face with tongue",
    "Grinning face with smiling eyes",
    "Face screaming in fear",
    "Backhand index pointing right",
    "Raising hands",
    "Clinking beer mugs",
    "Fire",
    "Rainbow",
    "Sun",
    "Balloon",
    "Rose",
    "Lipstick",
    "Ribbon",
    "Soccer ball",
    "Tennis ball",
    "Checkered flag",
    "Pouting face",
    "Angry face with horns",
    "Bear",
    "Dog",
    "Dolphin",
    "Fish",
    "Four leaf clover",
    "Eyes",
    "Car",
    "Red apple",
    "Heart with ribbon",
    "Blue heart",
    "OK hand",
    "Red heart",
    "Smiling face with heart-eyes",
    "Winking face",
    "Downcast face with sweat",
    "Flushed face",
    "Flexed biceps",
    "Pile of poo",
    "Cocktail glass",
    "Key",
    "Sparkling heart",
    "Glowing star",
    "Party popper",
    "Hibiscus",
    "Musical notes",
    "High-heeled shoe",
    "American football",
    "Baseball",
    "Trophy",
    "Alien",
    "Skull",
    "Monkey face",
    "Cow",
    "Poodle",
    "Horse",
    "Bomb",
    "Nose",
    "Ear",
    "Strawberry",
    "Heart with arrow",
    "Purple heart",
    "Oncoming fist",
    "Kiss mark",
    "Face blowing a kiss",
    "Winking face with tongue",
    "Dizzy face",
    "Folded hands",
    "Waving hand",
    "Toilet",
    "Woman dancing",
    "Gem stone",
    "Rocket",
    "Crescent moon",
    "Wrapped gift",
    "Snowman",
    "Water wave",
    "Sailboat",
    "Basketball",
    "Billiards",
    "Money bag",
    "Baby",
    "Princess",
    "Rabbit",
    "Pig",
    "Snake",
    "Camel",
    "Pistol",
    "Mouth",
    "Bicycle",
    "Watermelon",
    "Yellow heart",
    "Green heart"
  ];
  
const emojiP = document.getElementById("emoji");
const input = document.getElementById("inp");

var data = {
    emoji : null,
    desc : null
};

function getEmoji(emoji) {
    return emojiDescriptions[emojis.indexOf(emoji)]
}

function randomEmoji() {
    return emojis[Math.floor(Math.random()*emojis.length)];
}

async function nextCard() {
    const rand = randomEmoji();
    emojiP.innerText = rand;
    
    data.emoji = rand;
    data.desc = getEmoji(rand);
    
    console.log(data.desc);
}

function answer() {
    if(input.value.toLowerCase() == data.desc.toLowerCase()) {
        console.log("Correct!");
        
        nextCard();
    } else {
        console.log("Incorrect!");
    }
}

input.addEventListener("keypress", (e) => {
    if(e.key=="Enter") {
        console.log("Answered");
        
        answer();
    }
});

nextCard();