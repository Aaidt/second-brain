export function random(len: number) {
    let randString = "adsdjhjhv9u90123sdfjkhcvvbcbvb";
    let hash = "";
    let length = randString.length;
    for(let i = 0; i<len; i++){
        hash += randString[Math.floor(Math.random() * length)]
    }
    return hash    
}
