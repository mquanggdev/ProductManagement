module.exports.generateRandomString = (length) => {
    const char = "ABCDEFGHIJKLMNOPQASTUVWXYZabcgdfghijklmnopqastuvwxyz012345678";
    let result = "";
    for(let i = 0 ; i < length ; i++ ){
        result += char.charAt(Math.floor(Math.random() * char.length)) ;
    } 

    return result ;
};

module.exports.generateRandomNumber = (length) => {
    const char = "0123456789" ;
    let result = "" ;
    for ( var i = 0 ; i < length ; i++ ){
        result += char.charAt(Math.floor(Math.random() * char.length))
    }
    return result ;
}