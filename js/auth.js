
document.addEventListener("DOMContentLoaded",()=>{
    let SavedHash =sessionStorage.getItem("user");
    if (SavedHash) {
        let AuthProc = new XMLHttpRequest();
        AuthProc.open("POST", `/login/${SavedHash}`,true);
        AuthProc.addEventListener("load", ()=>{
            let resp =  JSON.parse(AuthProc.response);
            document.getElementById("LoginLink").href = "/user/";
            document.getElementById("LoginLink").innerText = resp.FIO;
            AuthProc.abort();
        });
        AuthProc.send();
    }
    
    let recop =  JSON.parse(localStorage.getItem("busket"));
    for (let i = 0; i < recop.length; i++) {
        if (recop[i] == null) {
            recop.splice(recop.indexOf(recop[i]),1);
            i=0;
        }   
    }
    localStorage.setItem("busket",JSON.stringify(recop));
});

document.getElementById("LoginLink").oncontextmenu = (e)=>{
    e.preventDefault();
    sessionStorage.clear();
    location.reload();
}