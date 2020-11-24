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

// 우클릭 Custom Menu
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