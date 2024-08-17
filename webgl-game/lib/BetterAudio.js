export { AudioCollection }

class AudioCollection {
    constructor(urls) {
        this.urls = urls;
        this.files=[];
    }
    /**
     * 
     * @param {string} url Path to audio file
     * @param {AudioContext} audioContext the audio context
     */
    async getFile(audioContext) {
        for(const path of this.urls) {
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            this.files.push(audioBuffer);
        }
    }
    /**
     * 
     * @param {Number} index 
     * @param {AudioContext} audioContext 
     */
    playsound(index, audioContext) {
        const source = audioContext.createBufferSource();
        source.buffer = this.files[index];
        source.connect(audioContext.destination);
        source.start(0)
    }
}
