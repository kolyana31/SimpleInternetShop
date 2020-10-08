let emailRegExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
let passRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/;
let numberRegExp =/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

function createProduct(prodId,name,rate,Organization,price,photo){
    let elem = document.createElement("div");
    elem.className = "d-flex flex-column justify-content-around card-body";
    elem.innerHTML = 
    `
    <div class="box-shadow w-100 d-flex p-1 my-2">
        <div class="photo-block">
            <img src="./.${photo}" class="store-item"  alt="">
        </div>
        <div class="description-block w-100 d-flex flex-column justify-content-center px-2">
            <div class="title-desc text-decor text-primary">
                <span>Name: ${name} </span>
            </div>
            <div class="text-decor text-primary w-100 d-flex flex-wrap desc-info">
                <span>Price: ${price}$</span>
                <span>Rate: ${rate}</span>
                <span>Organization: ${Organization}</span>
            </div>
        </div>
        <div class="delete-block d-flex">
            <button class="btn deleter btn-primary w-100 h-100" type="submit" data-deleteid="${prodId}">Delete</button>
        </div>
    </div>
    `
    return elem;
}

function ReturnOption(key,id,Name) {
    let div = document.createElement("option");
    div.setAttribute("key",key);
    div.setAttribute("dbID", id);
    div.id=`${key}-${id}`;
    div.innerText = Name;
    return div;
}

function GetFilters() {
    let Result;
    xhr = new XMLHttpRequest();
    xhr.open("POST", "/catalog", true);
    xhr.send(); 
    xhr.onload = function(){
        if (xhr.status == 200) {
            Result = JSON.parse(JSON.parse(xhr.responseText));
            for (const key in Result) {
                for (const itr of Result[key]) {
                    document.getElementById(`${key}-Select`).append(ReturnOption(key,itr.id,itr[Object.keys(itr)[Object.keys(itr).length-1]]));
                }
            }
        } else {
            console.log('err', xhr.responseText)
        }
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    if (sessionStorage.getItem("user")) {
        let GetUser = new XMLHttpRequest();
    
        GetUser.open("POST","/getuserinfo", true);
        GetUser.setRequestHeader("Content-Type", "application/json");
        GetUser.onload = ()=>{
            let res = JSON.parse(GetUser.response);
            document.getElementById("UserFIO").setAttribute("placeHolder",res.UserFIO);
            document.getElementById("EMAIL").setAttribute("placeHolder",res.EMAIL);
            document.getElementById("Login").setAttribute("placeHolder",res.Login);
            document.getElementById("Pass").setAttribute("placeHolder",res.Pass);
            document.getElementById("Phone").setAttribute("placeHolder",res.Phone);
            if (res.Role != "seller") {
                document.getElementById("AddProdBlock").remove();
            }
        }
        GetUser.send(JSON.stringify({hash: sessionStorage.getItem("user")}));

        let GetBasket = new XMLHttpRequest();
        GetBasket.open("POST","/getbascket", true);
        GetBasket.setRequestHeader("Content-Type", "application/json");
        GetBasket.onload = ()=>{
            let res = JSON.parse(GetBasket.response);
            if (res.err == 2020) {
                return;
            }
            let loc = JSON.parse(localStorage.getItem("busket"));
            for (const prod of loc){
                for (const itr of res) {
                    if (itr.ProductId == prod) {
                        el = createProduct(itr.ProductId,itr.Name,itr.AvarageStar,itr.Organization,itr.Price,itr.PhotoPath);
                        document.getElementById("collapseTwo").append(el);
                        el.getElementsByClassName("deleter")[0].addEventListener("click", (ev)=>{
                            recop =  JSON.parse(localStorage.getItem("busket"));
                            if (recop.indexOf(ev.target.dataset.deleteid) > -1) {
                                recop.splice(recop.indexOf(ev.target.dataset.deleteid),1);
                                localStorage.setItem("busket", JSON.stringify(recop));
                                ((ev.target.parentNode).parentNode).parentNode.remove();
                            }
                        })
                    }
                }
            }
        }
        GetBasket.send(localStorage.getItem("busket"));
    }
    else{
        document.location.href = "/";
    }
    GetFilters();
})

document.getElementById("SubmitAccountChanges").addEventListener("click",(ev)=>{
    ev.preventDefault();
    AtLeastOneChosen = false;
    if(document.getElementById("EMAIL").value){
        if (!emailRegExp.test(document.getElementById("EMAIL").value)) {
            alert("EMAIL is invalid pls enter another");
            return
        }
        AtLeastOneChosen = true;
    }
    else if (document.getElementById("UserFIO").value) {
        if (document.getElementById("UserFIO").value.length < 5 && document.getElementById("UserFIO").value.length > 45) {
            alert("UserFIO Must Be 5-45 symbols length");
            return
        }
        AtLeastOneChosen = true;
    }
    else if (document.getElementById("Login").value) {
        if (document.getElementById("Login").value.length < 4 && document.getElementById("Login").value.length > 30) {
            alert("Login Must Be 4-30 symbols length");
            return
        }
        AtLeastOneChosen = true;
    }
    else if (document.getElementById("Pass").value) {
        if (passRegExp.test(document.getElementById("Pass").value)) {
            alert("Pass is invalid pls enter another");
            return
        }
        AtLeastOneChosen = true;
    }
    else if (document.getElementById("Phone").value) {
        if (numberRegExp.test(document.getElementById("Phone").value)) {
            alert("Phone is invalid pls enter like +380000000000");
            return
        }
        AtLeastOneChosen = true;
    }
    if (!AtLeastOneChosen) {
        alert("I didnt change data");
        return;
    }
    let Changes = {
        hash: sessionStorage.getItem("user"),
        UserFIO : document.getElementById("UserFIO").value,
        EMAIL : document.getElementById("EMAIL").value,
        Login : document.getElementById("Login").value,
        Pass : document.getElementById("Pass").value,
        Phone : document.getElementById("Phone").value
    };

    let ChangeInfo = new XMLHttpRequest();
    ChangeInfo.open("POST","/changeinfo", true);
    ChangeInfo.setRequestHeader("Content-Type", "application/json");
    ChangeInfo.onload = () =>{
        let resp  = JSON.parse(ChangeInfo.response);
        if (!resp.err) {
            document.getElementById("card-place").classList.add("change-ok");
            setTimeout(() => {
                document.getElementById("card-place").classList.remove("change-ok");
                alert("Data changed");
            }, 1000);    
        }
        else{
            document.getElementById("card-place").classList.add("change-failed");
            setTimeout(() => {
                document.getElementById("card-place").classList.remove("change-failed");
                alert("This data cant be set pls choose smth else");
            }, 1000);
        }
    }
    ChangeInfo.send(JSON.stringify(Changes));

})

document.getElementById("addProduct").addEventListener("click",(ev)=>{
    ev.preventDefault();
    let formdata = new FormData(document.forms["formAdder"]);
    console.log(formdata);
    // let IMGAndJsonLoader = new XMLHttpRequest();
    // IMGAndJsonLoader.open("POST","/addProd", true);
    // IMGAndJsonLoader.setRequestHeader('Content-Type', 'multipart/form-data');
})