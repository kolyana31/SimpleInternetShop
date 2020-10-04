let xhr = [new XMLHttpRequest(),new XMLHttpRequest()];

document.getElementById("fillter-wraper").addEventListener("click", ()=>{
    document.getElementById("side-bar-wraper").hidden = !document.getElementById("side-bar-wraper").hidden;
})

function CreateCheckBox(key,id,Name) {
    let CheckBoxes = document.createElement("div");
    CheckBoxes.className="checkbox";
    CheckBoxes.innerHTML = `<label><input type="checkbox" key="${key}" dbID="${id}" value="" id="${key}-${id}">${Name}</label>`;
    return CheckBoxes;
}

function CreateProduct(id,name,price,stars,photo){
    let Prod = document.createElement("div");
    Prod.id= id;
    Prod.className ="flex-column flex-nowrap product-block box-shadow-item p-1 m-1 text-decor";
    Prod.innerHTML= 
    `
        <a href="/products/${id}">
            <div class="img-container">
                <img src="${photo}" alt="">
            </div>
            <div class="product-item-title text- ">
                <span>${name}</span>
            </div>
        </a>
        <div class="rate d-flex align-items-center">
            <span id="popular-rate-0">${stars}</span> 
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="rgb(233, 231, 119)" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
        </div>
        <div class="value d-flex align-items-center">
            <span id="popular-price-${id}">${price}</span>$
        </div>
        <div class="d-flex button-block text-dark">
            <button name="AddToBucket" AddId="${id}" type="button" class="btn btn-primary w-100 d-flex align-items-center justify-content-center" data-toggle="button" aria-pressed="false">
                Add to Cart
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-bag-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M5.5 3.5a2.5 2.5 0 0 1 5 0V4h-5v-.5zm6 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z"/>
                </svg>
            </button>
        </div>
    `
    Prod.addEventListener("click", (e)=>{
        let id;
        if(e.target.getAttribute("AddId")){
            id = e.target.getAttribute("AddId");
        } 
        else{
            id = (e.target.parentNode).parentNode.getAttribute("AddId");
        }
        if (localStorage.getItem("busket")) {
            let recop = []
            recop =  JSON.parse(localStorage.getItem("busket"));
            recop.push(id);
            localStorage.setItem("busket",JSON.stringify(recop));
        }
        else{
            let st = [];
            st.push(id);
            localStorage.setItem("busket",JSON.stringify(st));
        }
    })

    return Prod;
}

document.querySelectorAll("button[name=AddToBucket]")

function GetFilters() {
    let Result;
    xhr[0].open("POST", "/catalog", true);
    xhr[0].send(); 
    xhr[0].onload = function(){
        if (xhr[0].status == 200) {
            Result = JSON.parse(JSON.parse(xhr[0].responseText));
            for (const key in Result) {
                for (const itr of Result[key]) {
                    document.getElementById(`${key}-block`).append(CreateCheckBox(key,itr.id,itr[Object.keys(itr)[Object.keys(itr).length-1]]));
                }
            }
        } else {
            console.log('err', xhr[0].responseText)
        }
    }
}

function GetProds() {
    let Prods;
    xhr[1].open("POST", "/products", true);
    xhr[1].setRequestHeader("Content-Type", "application/json");
    xhr[1].send();
    xhr[1].onload = function(){
        if (xhr[1].status === 200) {
            Prods = JSON.parse(JSON.parse(xhr[1].responseText));
            let PriceArr = [];
            for (const itr of Prods) {
               document.getElementById("prod-list").append(CreateProduct(itr.productid,itr.name,itr.price,itr.avaragestar,itr.photoPath));
                PriceArr.push(+itr.price);
            }
            document.getElementById("minPrice").min =Math.min(...PriceArr);
            document.getElementById('minPrice').max =Math.max(...PriceArr);
            document.getElementById('minPrice').value = document.getElementById("minPrice").min;
            document.getElementById('maxPrice').min =document.getElementById("minPrice").min ;
            document.getElementById('maxPrice').max =document.getElementById('minPrice').max ;
            document.getElementById('maxPrice').value = document.getElementById('maxPrice').max;
            Prods= null;
            PriceArr = null;
        } else {
            console.log('err', xhr[1].responseText)
        }
    } 
}

function GetFilteredProds(name){
    let chosen = [] ;
    document.querySelectorAll("[dbid]").forEach(el => {
        if (el.checked) {
            chosen.push({
                "id": el.id.slice(el.id.indexOf("-")+1,el.id.length) ,
                "param": el.id.slice(0,el.id.indexOf("-"))
            })
        }
    });

    chosen.push({
            "minPrice": document.getElementById('minPrice').value,
            "maxPrice": document.getElementById('maxPrice').value
    })

    chosen = JSON.stringify(chosen);

    let Prods;
    
    if (name) {
        xhr[1].open("POST", `/products/${name}`, true);
    }else{
        xhr[1].open("POST", "/products", true);
    }
    

    xhr[1].setRequestHeader("Content-Type", "application/json");
    xhr[1].send(chosen);
    xhr[1].onload = function(){
        if (xhr[1].status === 200) {
            Prods = JSON.parse(JSON.parse(xhr[1].responseText));
            document.getElementById("prod-list").innerHTML = null;
            for (const itr of Prods) {
               document.getElementById("prod-list").append(CreateProduct(itr.productid,itr.name,itr.price,itr.avaragestar,itr.photoPath));
            }
            xhr[1].abort();

        } else {
            console.log('err', xhr[1].responseText)
        }
    } 
    
}

document.getElementById("FilterItems").addEventListener("click", ()=>{GetFilteredProds()});

document.addEventListener("DOMContentLoaded", GetFilters());

document.addEventListener("DOMContentLoaded", GetProds());

function lockMaxMin(tar) {
    if (tar.value >= tar.max) {
        tar.value = tar.max;
    }
    else if (tar.value <= tar.min) {
        tar.value=tar.min;
    }
}

document.getElementById("minPrice").oninput = (ev)=>{
    lockMaxMin(ev.target);
}

document.getElementById("maxPrice").oninput = (ev)=>{
    lockMaxMin(ev.target);
}

document.getElementById("search-button").onclick = (ev)=>{
    ev.preventDefault();
    GetFilteredProds(document.getElementById("search-field").value);
}



