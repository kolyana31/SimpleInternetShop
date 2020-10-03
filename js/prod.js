
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