let popupMenu = document.createElement("div");
popupMenu.className = "custom-menu";
popupMenu.setAttribute("style", "z-index:1000; position:absolute; padding: 2px;");

let plus_button = document.createElement("img");
plus_button.src = chrome.extension.getURL("../images/plus.png");

let cancle_button = document.createElement("img");
cancle_button.src = chrome.extension.getURL("../images/cancle.png");
cancle_button.setAttribute("style", "margin-left:5px;");

popupMenu.appendChild(plus_button);
popupMenu.appendChild(cancle_button);

document.body.appendChild(popupMenu);

// 포트 이름 정하고 background에 connect 시도
var myPort = chrome.runtime.connect({name: "port-from-cs"});

var toggle = false;
chrome.storage.sync.get("toggle", function(items){
    toggle = items.toggle;
});

// background로부터 Message Receive
myPort.onMessage.addListener(function(msg){
    // Api call
    if("summary" in msg){
        alert(msg.summary);
    }
    else if("toggle" in msg){
        toggle = msg.toggle;
    }
});

// 우클릭 Custom Menu
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

// 드래그된 텍스트
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

/*  마우스에 위치하는 HTML 요소를 가져와 PLUS 버튼 생성해서 붙이기.
    

    Get - hover html element
    let x = event.clientX, 
        y = event.clientY,
        elementMouseIsOver = document.elementFromPoint(x, y);

    let getElement = elementMouseIsOver.getElementsByClassName("ainize_logo");
    let getText = elementMouseIsOver.innerText;
    let hasAinizeLogo = false;

    // Check - 단락 Ainize Logo 
    for(let i=0; i<getElement.length; i++){
        if(getElement[i].className == "ainize_logo")
                hasAinizeLogo = true;
    }

    // 로고 없으면, Insert Ainize Logo
    if(hasAinizeLogo == false){
        let logo = document.createElement("img");

        logo.className = "ainize_logo";
        logo.src = chrome.extension.getURL("plus.png");
        logo.style.cursor = 'pointer';

        // 단락의 마지막 IMG 추가
        elementMouseIsOver.appendChild(logo);

        logo.onclick = function(){
            let text = getText;
            myPort.postMessage({addText: text});
        };
    }
*/