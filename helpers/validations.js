let emailRegExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
let passRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$/;
let numberRegExp =/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

checkEmail = (field)=>{
    return emailRegExp.test(field);
}

checkPass = (field)=>{
    return passRegExp.test(field);
}

checkNum = (field)=>{
    return numberRegExp.test(field);
}

module.exports={
    checkEmail,
    checkPass,
    checkNum
}