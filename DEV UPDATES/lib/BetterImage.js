export { Images }
class Images {
    constructor(urls) {
        this.urls = urls;
        this.files = null;
    }
    async load() {
        let urls = this.urls;
        let results = await Promise.all(urls.map((url) => fetch(url).then((r) => r.blob())));
        results = await Promise.all(results.map((file) => createImageBitmap(file)));
        this.files=results;
    }
}