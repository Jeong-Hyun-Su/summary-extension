// Popup은 Extension을 재실행 혹은 클릭할 때마다 실행.

// Extension의 백그라운드 페이지 콘솔
var console = chrome.extension.getBackgroundPage().console;

var app = {
    init: 
        function(){
            let data;
            let $paragraph = document.getElementById("paragraph");
            let textData = "";

            // 저장된 데이터를 바탕으로 팝업의 내용 추가
            chrome.storage.sync.get("data", function(items) {
                if (!chrome.runtime.error) {
                    data = items.data;
                    
                    for(let i = 0; i < data.length; i++){
                        textData += data[i] + " ";

                        // <p> 단락 추가
                        let sentenceHtml = document.createElement("p");
                        sentenceHtml.innerText = data[i];
                        sentenceHtml.className = "pg";
                        
                        // Minus 버튼 추가
                        let img_minus = document.createElement("img");
                        img_minus.src = "../images/minus.png";
                        img_minus.style.cursor = 'pointer';
                        img_minus.onclick = function(){
                            const id = i;
                            sentenceHtml.remove();

                            chrome.runtime.sendMessage({delete: id});
                        }
                        sentenceHtml.appendChild(img_minus);
                        
                        $paragraph.appendChild(sentenceHtml);
                    }
                }
            });

            // Receive the Background Message.
            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
                if("summary" in request){
                    let summaryHtml = document.createElement("p");
                    summaryHtml.innerText = request.summary;
                    summaryHtml.className = "summary";

                    $paragraph.appendChild(summaryHtml);
                }
            });

            let $summary = document.getElementById("summaryBtn");
            $summary.onclick = function(){
                chrome.runtime.sendMessage({summary: textData});
            }
        }
};

document.addEventListener("DOMContentLoaded", function(){
    app.init();
});

