import { Images } from "./BetterImage.js";
var urls = ["./horizon.jpg", "./cheese.png"];
var files = new Images(urls);

async function init() {
    await files.load();
    console.log(files.files);
}
init();