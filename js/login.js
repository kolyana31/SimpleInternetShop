
let emailRegExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
let passRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/;
let numberRegExp =/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

document.getElementById("submit").onclick = (event)=>{
    event.preventDefault();
    
    let form = document.forms["login-form"];
    let userLogin = form.elements["logfield"].value;
    let userPass = form.elements["passfield"].value;
    if (userLogin.length < 30 && passRegExp.test(userPass)) {
        let user = JSON.stringify({Login: userLogin, PASS: userPass});
        let request = new XMLHttpRequest();
        request.open("POST", "/login", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.addEventListener("load", ()=>{
            let receivedUser = JSON.parse(request.response);
            let span = document.createElement("span");
            if (receivedUser.status) {
                span.innerText = "Found";
                span.className = "LoginFound";
                sessionStorage.setItem('user', receivedUser.Hash);
                span.onload = 
                setTimeout(() => {
                    span.remove();
                    location.href= "/";
                }, 2000);
            }
            else{
                span.innerText = "Login/Password Is not correct";
                span.className = "LoginNotFound";
                span.onload = 
                setTimeout(() => {
                    span.remove();
                }, 2000);
            }
            form.elements["passfield"].after(span);
        });
        request.send(user);    
    }
    else{
        alert("Login: Must Be Less than 30 Symbols\nPassword is to simple or longer than 20 symbols ")
    }
}

document.getElementById("reg-submit").onclick = (e)=>{
    e.preventDefault();

    let form = document.forms["register-form"],
        userFIO = form.elements["FIOfield"].value,
        userLogin = form.elements["regfield"].value,
        userPass = form.elements["passfield"].value,
        userEmail = form.elements["Emailfield"].value,
        userPhone = form.elements["Phonefield"].value,
        isSeller = form.elements["seller"].checked,
        Organisation = form.elements["orgfield"].value;
        
    if (userFIO.length > 5 && userFIO.length < 45  && userLogin.length > 4 && userLogin.length < 30 &&
        passRegExp.test(userPass) && emailRegExp.test(userEmail)&&  !emailRegExp.test(userLogin)&&
        numberRegExp.test(userPhone)) {
        if (isSeller && (Organisation.length>50 && Organisation.length<5)) {
            alert("If u are a seller your organization name must be more than 5 symbols");
            return;
        }
        let user = JSON.stringify({
            userFIO: userFIO,
            userLogin: userLogin,
            userPass: userPass,
            userEmail: userEmail,
            userPhone: userPhone,
            isSeller: isSeller,
            Organisation: Organisation
        });
        let request = new XMLHttpRequest();
        request.open("POST", "/register", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.addEventListener("load", ()=>{
            let resp = JSON.parse(request.response);
            let span = document.createElement("span");

            if (resp.added && resp.err === undefined) {
                span.innerText = "You have been registered now u can use login form to enter";
                span.className = "register-ok";
                
                span.onload = setTimeout(()=>{
                    if (!form.hidden) {
                        ChangeForm();   
                    }
                    span.remove();
                },4500);
            }
            else if(!resp.added || resp.err == 1062){
                span.innerText = "Such data already registered check input information";
                span.className = "register-err";
                
                span.onload = setTimeout(()=>{
                    span.remove();
                },4000);
            }
            else{
                span.innerText = "Unnkown err, pls reload page o try again later";
                span.className = "register-err";
                
                span.onload = setTimeout(()=>{
                    span.remove();
                },4000);
            }
            document.getElementById("OrganizationField").after(span);
        });
        request.send(user);    
    }
    else{
        alert("Check fields and try again:\n-FIO: 5-45 symbols\n-Login: 4-30 symbols\n-Pass:Hard pass with 8-20 symbols\n-Dont use Email adress as login");
    }
}




document.getElementById("seller").addEventListener("change", (event)=>{
    let orgst = document.getElementById("OrganizationField").style;
    if (event.target.checked) {
        orgst.display = "flex"; 
    }
    else{
        orgst.display = "";
    }
})


function ChangeForm(){
    document.forms["login-form"].hidden = !document.forms["login-form"].hidden;
    document.forms["register-form"].hidden = !document.forms["register-form"].hidden;
}

function ForgotChangeForm(){
    document.forms["login-form"].hidden = !document.forms["login-form"].hidden;
    document.forms["pass-renew-form"].hidden = !document.forms["pass-renew-form"].hidden;
}

document.getElementById("go-to-reg").addEventListener("click", ()=>{
    ChangeForm();
})

document.getElementById("back-to-log").addEventListener("click", ()=>{
    ChangeForm();
})

document.getElementById("pass-renew-form").addEventListener("click", ()=>{
    ForgotChangeForm();
})

document.getElementById("return-log").addEventListener("click", ()=>{
    ForgotChangeForm();
})


