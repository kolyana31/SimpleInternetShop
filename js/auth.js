
document.addEventListener("DOMContentLoaded",()=>{
    let SavedHash =sessionStorage.getItem("user");
    if (SavedHash) {
        let AuthProc = new XMLHttpRequest();
        AuthProc.open("POST", `/login/${SavedHash}`,true);
        AuthProc.addEventListener("load", ()=>{
            let resp =  JSON.parse(AuthProc.response);
            document.getElementById("LoginLink").href = "/user/"+resp.Id;
            document.getElementById("LoginLink").innerText = resp.FIO;
        });
        AuthProc.send();
    }
});