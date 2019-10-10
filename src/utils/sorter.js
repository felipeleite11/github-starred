export const Sorter = {
    sort: (array, prop, sense) => {
        sense = sense || 'asc'
    
        if(!['asc', 'desc'].includes(sense)) {
            throw new Error(`The third parameter must be a enum('asc', 'desc').`)
        }
    
        function compare(a, b) {
            if (a[prop] < b[prop]){
                return sense.toLowerCase() === 'asc' ? -1 : 1
            }
            if (a[prop] > b[prop]){
                return sense.toLowerCase() === 'asc' ? 1 : -1
            }
            return 0
        }
    
        return array.sort(compare)
    }
}
