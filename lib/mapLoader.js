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
            return res.data.layers[0]
        }));
        
        
    }
}