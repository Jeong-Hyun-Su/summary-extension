let popupMenu = document.createElement("div");
popupMenu.innerText = "Add";
popupMenu.className = "custom-menu";
popupMenu.setAttribute("style", "z-index:1000; position:absolute; background-color: #C0C0C0; border: 1px solid black; padding: 2px;");
document.body.appendChild(popupMenu);

// 포트 이름 정하고 background에 connect 시도
var myPort = chrome.runtime.connect({name: "port-from-cs"});

// background로부터 Message Receive
myPort.onMessage.addListener(function(msg){
    // Api call
    if("summary" in msg){
        alert(msg.summary);
    }
});

$(document).bind("contextmenu", function(event) { 
        event.preventDefault();
        
        let getText = selectText().trim();

        popupMenu.onclick = function(){
            const text = getText;
            if(getText != ""){
                myPort.postMessage({addText: text});
            }
        }
        $(".custom-menu").css({top: event.pageY + "px", left: event.pageX + "px"});
        $("div.custom-menu").show();
        
})
.bind("click", function(event) {
        
        $("div.custom-menu").hide();
});



// document.body.addEventListener("mousedown", function(event){
//     // Drage && Right mouse button
//     if((event.button == 2) || (event.which == 3)){
//         event.preventDefault();
//         let getText = selectText().trim();
        
//         if(getText != ""){
//             myPort.postMessage({addText: getText});
//         }
//     }
// });

$(document).bind("contextmenu", function(event) { 
    event.preventDefault();
    $("<div class='custom-menu'>Custom menu</div>")
        .appendTo("body")
        .css({top: event.pageY + "px", left: event.pageX + "px"});
}).bind("click", function(event) {
    $("div.custom-menu").hide();
});


function selectText() {
    var selectText = "";
    
    if (window.getSelection) 
        selectText = window.getSelection();
    else if (document.getSelection) 
        selectText = document.getSelection();
    else if (document.selection) 
        selectText = document.selection.createRange().text;
    else 
        return;
    
    return String(selectText);
}

// Get - hover html element
// let x = event.clientX, 
//     y = event.clientY,
//     elementMouseIsOver = document.elementFromPoint(x, y);

// let getElement = elementMouseIsOver.getElementsByClassName("ainize_logo");
// let getText = elementMouseIsOver.innerText;
// let hasAinizeLogo = false;

// // Check - 단락 Ainize Logo 
// for(let i=0; i<getElement.length; i++){
//     if(getElement[i].className == "ainize_logo")
//             hasAinizeLogo = true;
// }

// // 로고 없으면, Insert Ainize Logo
// if(hasAinizeLogo == false){
//     let logo = document.createElement("img");

//     logo.className = "ainize_logo";
//     logo.src = chrome.extension.getURL("plus.png");
//     logo.style.cursor = 'pointer';

//     // 단락의 마지막 IMG 추가
//     elementMouseIsOver.appendChild(logo);

//     logo.onclick = function(){
//         let text = getText;
//         myPort.postMessage({addText: text});
//     };
// }