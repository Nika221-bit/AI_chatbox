const chatMessages = document.getElementById('chagmessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById("sendBtn");
const apiKeyInput = document.getElementById('apiKey');

async function  sendmessae(){
    const apiKey = apiKeyInput.Value.trim();
    const message = userInput.Value.trim();

    if(!apiKey){
        showError("ჩასვი API KEY!")
        return
    }
    if(!message){
        showError("შეიყანე ტექსტი")
        return
    }

// მომხმარებლის შეტყობინების გამოტანა

addMessage(message,"user")
    userInput.Value=""
     sendButton.disabled=true

// typing indicator

const typing=showTyping()

try{
      const MODEL = "gemini-2.5-flash";
   const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    

  const response = await fetch(API_URL,{
    method:"POST",
    headers: {
 
        "Content-Type":"application/json",
    },
        body: JSON.stringify({
contents:[
    {
        parts:[
            {
                text:message,
            }
        ]
    }
]
        })
 
    })
 
const data = await response.json()
 
typing.remove()
 
if(!response.ok){
    const errorMsg=data.error?.message || "მოხდა შეცდომა"
    showError(errorMsg)
    return
}else{
 
    const botReply= data.candidates?.[0]?.content?.parts?.[0]?.text || "მოხდა შეცდომა პასუხის მიღებისას"
    addMessage(botReply,"bot")
}
}catch(error){
    typing.remove()
    showError("მოხდა შეცდომა: " + error.message)
}
sendButton.disabled=false
userInput.focus()
 
 
 
}

// დამხმარე ფუნქციები