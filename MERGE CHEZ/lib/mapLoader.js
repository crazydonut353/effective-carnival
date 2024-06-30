export { MapLoader };

class MapLoader {
    constructor() {
        
    }
    async parse(url) {
        return fetch(url).then(response => 
            response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let a = res.data.layers[0];
            a.backgroundcolor = res.data.backgroundcolor;
            return res.data.layers[0]
            //"backgroundcolor"
        }));
        
        
    }
}