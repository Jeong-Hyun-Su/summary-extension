//=======================
// 우클릭 메뉴 동적html 생성
//=======================
let popupMenu = document.createElement("div");
popupMenu.className = "custom-menu";
popupMenu.setAttribute("style", "z-index:1000; position:absolute; padding: 4px 7px 0px 7px; background-color: #9f43cb; box-shadow: 2px 4px 4px 0px rgba(150, 0, 255, 0.7); border-radius: 10px;");

let plus_button = document.createElement("img");
plus_button.src = chrome.extension.getURL("../images/plus.png");
plus_button.style.cursor = "pointer";

let cancle_button = document.createElement("img");
cancle_button.src = chrome.extension.getURL("../images/cancle.png");
cancle_button.style.marginLeft = "5px";
cancle_button.style.cursor = "pointer";

popupMenu.appendChild(plus_button);
popupMenu.appendChild(cancle_button);

document.body.appendChild(popupMenu);

//===================
// 우클릭 Custom Menu
//===================
$(document).bind("contextmenu", function(event) { 
    if(toggle){
        event.preventDefault();
        
        let getText = selectText().trim();

        plus_button.onclick = function(){
            const text = getText;
            if(getText != ""){
                myPort.postMessage({addText: text});
            }
        }
        $(".custom-menu").css({top: (event.pageY + 5) + "px", left: (event.pageX + 11) + "px"});
        $("div.custom-menu").show();
    }    
})
.bind("click", function(event) {
        $("div.custom-menu").hide();
});

// 드래그된 텍스트 가져오기
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

//=======================================
//             백그라운드 통신
//=======================================
var myPort = chrome.runtime.connect({name: "port-from-cs"});  // 포트 이름 정하고 background에 connect 시도

var toggle = false;
chrome.storage.sync.get("toggle", function(items){            // 저장소로부터 토글 상태 불러오기
    toggle = items.toggle;      
});

// background로부터 Message Receive
myPort.onMessage.addListener(function(msg){
    if("toggle" in msg){
        toggle = msg.toggle;
    }
});