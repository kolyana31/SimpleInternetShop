document.getElementById("fillter-wraper").addEventListener("click", ()=>{
    document.getElementById("side-bar-wraper").hidden = !document.getElementById("side-bar-wraper").hidden;
})

function CreateCheckBox(id,Name) {
    let CheckBoxes = document.createElement("div");
    CheckBoxes.className="checkbox";
    CheckBoxes.innerHTML = `<label><input type="checkbox" value="" id="${id}">${Name}</label>`;
    return CheckBoxes;
}

document.addEventListener("DOMContentLoaded", ()=>{
    let xhr = new XMLHttpRequest();
    let Result;
    xhr.open("POST", "/catalog", true);
    xhr.send(); 
    xhr.onreadystatechange = (event)=>{
        if (xhr.readyState != 4) {
            return;
        }
        if (xhr.status === 200) {
            Result = JSON.parse(JSON.parse(xhr.responseText));
            //console.log(Result);
            for (const key in Result) {
                for (const itr of Result[key]) {
                    document.getElementById(`${key}-block`).append(CreateCheckBox(`${key}-item-${itr.id}`,itr[Object.keys(itr)[Object.keys(itr).length-1]]));
                }
            }
        } else {
            console.log('err', xhr.responseText)
        }
    }
});