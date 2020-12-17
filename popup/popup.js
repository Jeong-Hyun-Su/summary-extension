// Popup은 Extension을 재실행 혹은 클릭할 때마다 실행.

// Extension의 백그라운드 페이지 콘솔
var console = chrome.extension.getBackgroundPage().console;

var app = {
    textData: "",
    idList: [],
    textList: [],
    init: 
        function(){
            const that = this;

            let data;
            let $paragraph = document.getElementById("paragraph");
            let $result = document.getElementById("result");
            let $empty = document.getElementById("empty");
            let $slider = document.getElementById("slider");

            $slider.onclick = function(){
                chrome.storage.sync.set({"toggle" : $slider.checked}, function() {
                    if (chrome.runtime.error) {
                        console.log("Runtime error.");
                    }
                });
                chrome.runtime.sendMessage({toggle: $slider.checked});
            }

            chrome.storage.sync.get("toggle", function(items){
                $slider.checked = items.toggle;
            });

            // 저장된 데이터를 바탕으로 팝업의 내용 추가
            chrome.storage.sync.get("data", function(items) {
                if (!chrome.runtime.error) {
                    data = items.data;

                    // 데이터의 유무에 따른, Empty 출력 / 데이터 출력
                    if(data.length != 0){
                        $empty.style.marginTop = '0px';
                        $empty.style.display = 'none'

                        // 저장된 데이터 출력
                        for(let i = 0; i < data.length; i++){
                            that.textData += data[i] + " ";
    
                            that.idList.push(i);
                            that.textList.push(data[i]);
    
                            // <p> 단락 추가
                            let sentenceHtml = document.createElement("p");
                            sentenceHtml.innerText = data[i];
                            sentenceHtml.className = "pg";
                            
                            if(i == 0) sentenceHtml.style.marginTop = '0px';
                            
                            // Minus 버튼 추가
                            let img_minus = document.createElement("img");
                            img_minus.src = "../images/minus.png";
                            img_minus.setAttribute("style","position:absolute; right:3px; bottom:1px; cursor:pointer;");
                            img_minus.onclick = function(){
                                const id = i;
                                sentenceHtml.remove();
                                that.textData = "";
    
                                if(that.idList.length == 1){
                                    $empty.style.marginTop = '80px';
                                    $empty.style.display = 'block';
                                }
                                
                                // 요소들 idList에서 제거 / Background에 전송하면서, 저장소에서 제거  => 싱크
                                for(let j = 0; j < that.idList.length; j++){
                                    if(id == that.idList[j]){
                                        that.idList.splice(j, 1);
                                        that.textList.splice(j, 1);
                                        chrome.runtime.sendMessage({delete: j});
                                        continue;
                                    }
                                    that.textData += that.textList[j] + " ";
                                }
                            }
                            sentenceHtml.appendChild(img_minus);
                            
                            $paragraph.appendChild(sentenceHtml);
                        }
                    }
                    else{
                        $empty.style.marginTop = '80px';
                        $empty.style.display = 'block';
                    }
                }
            });

            // Receive the Background Message.
            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
                if("summary" in request){
                    $result.innerText = request.summary;
                    $result.className = "summary"
                }
            });

            // Summary 버튼 기능 작동 
            let $summary = document.getElementById("summaryBtn");
            $summary.onclick = function(){
                chrome.runtime.sendMessage({summary: that.textData});
            }
        }
};

document.addEventListener("DOMContentLoaded", function(){
    app.init();
});

