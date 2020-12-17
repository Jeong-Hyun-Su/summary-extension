/* Global Chrome */

// 긴 라이프 사이클로의 통신 (PORT를 열어놓고 통신)

var background = {
    port: null,
    data: [],

    init: 
            function(){
                const that = this;

                /*-----------------
                    Popup과의 통신
                -------------------*/
                // Listen for any Messages, and Route them to functions
                chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
                    if("summary" in request){
                        // 쌓아둔 Content를 Summary로 보냄
                        background["apiCall"](request.summary);
                    }
                    else if("delete" in request){
                        let id = request.delete;
                        if(id != null)
                            that.data.splice(id, 1);

                        background["saveData"]();
                    }
                    else if("toggle" in request){
                        console.log("request.toggle : " + request.toggle);
                        background["toggle"](request.toggle);
                    }
                });

                /*-----------------
                    Content와의 통신 
                -------------------*/
                // content에서 포트로 connect할 때, 반응
                chrome.runtime.onConnect.addListener(function(p) {
                    that.port = p;
                    
                    // connect 후, content로부터 Message Receive.
                    that.port.onMessage.addListener(function(msg) {
                        if("addText" in msg){
                            that.data.push(msg.addText);

                            background["saveData"]();
                        }
                    });
                });
            },

    toggle:
            function(tog){
                if(typeof this.port !== 'undefined'){
                    this.port.postMessage({toggle: tog});
                }
            },

    saveData:
            function(){
                chrome.storage.sync.set({"data" : this.data}, function() {
                    if (chrome.runtime.error) {
                        console.log("Runtime error.");
                    }
                })
            },

    apiCall: 
            function(article){
                let apiLink = "https://master-summarize-jeong-hyun-su.endpoint.ainize.ai/summary?article=" + article;
                
                fetch(apiLink)
                .then(response => {
                    if ( response.status == 200 )   
                        return response;
                    else                            
                        throw Error("Summary Error");
                })
                .then(response => response.text())
                .then(response => {
                    response = response.substring(7, response.length - 4);
                    chrome.runtime.sendMessage({summary: response});
                })
                .catch(e =>{
                });
            },
};

background.init();
