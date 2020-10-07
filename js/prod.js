
function CreateComent(Name,Rate,Good,Bad){
    let Com = document.createElement("div");
    Com.className ="comment w-100 p-2 d-flex  flex-column box-shadow my-2";
    Com.innerHTML = 
    `
        <div><span class="text-primary">Name:</span><span class="text-decor">${Name}</span></div>
        <div><span class="text-primary">Rate:</span><span class="text-decor"> ${Rate} </span></div>
        <span class="d-block text-primary text-decor">Good Things:</span>
        <div class="card card-body">
            ${Good}
        </div>
        <span class="d-block text-primary text-decor">Bad Things:</span>
        <div class="card card-body">
            ${Bad}
        </div>
    `
    return Com;
}

function addtoBusket(id) {
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
}

document.addEventListener("DOMContentLoaded", ()=>{
    let CommentsLoad = new XMLHttpRequest();
    CommentsLoad.open("POST",`/getcoments/${document.getElementById("element-id").getAttribute("DbId")}`, true);
    CommentsLoad.addEventListener("load", ()=>{
        let results = JSON.parse(CommentsLoad.response);
        for (const itr of results) {
            document.getElementById("commetsBlock").append(CreateComent(itr.FIO,itr.Stars,itr.GoodPart,itr.Badpart));
        }
        console.log(results);
    })
    CommentsLoad.send();
    if(!sessionStorage.getItem("user")){
        document.getElementById("AddComent").remove();
    }
})



document.getElementById("AddtoBus").addEventListener("click", ()=>{
    addtoBusket(document.getElementById("AddtoBus").getAttribute("prodId"));
})

document.forms["AddCommentForm"].submitcoment.addEventListener("click", (ev)=>{
    ev.preventDefault();
    if (confirm("U sure u want to add coment")) {
        let AddComent = new XMLHttpRequest();
        AddComent.open("POST","/addcoment",true);
        AddComent.setRequestHeader("Content-Type", "application/json");
        AddComent.onload = ()=>{
            let res = JSON.parse(AddComent.response);
            if (!res.err && res.status=="added") {
                alert("Your coment has been added");
                document.forms["AddCommentForm"].className = "remove-block"
                setTimeout(() => {
                    document.forms["AddCommentForm"].remove();
                }, 1100);
            }
            else{
                alert("There problem in adding ur coment try again later");
            }
        }
        AddComent.send(JSON.stringify({
            hash: sessionStorage.getItem("user"),
            prodId: document.getElementById("AddtoBus").getAttribute("prodId"),
            rate: document.getElementById("ChosenRate").value,
            good: document.getElementById("GoodAboutProd").value,
            bad: document.getElementById("BadAboutProd").value
          }));
    }

})
