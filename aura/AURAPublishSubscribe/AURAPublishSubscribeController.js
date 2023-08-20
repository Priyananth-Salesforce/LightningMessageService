({
    handleMessage : function(component, message, helper) {
        console.log(message);
        if (message != null && message.getParam("message") != null
            && message.getParam("messageFrom") != 'AURA') {
            let messageList = component.get("v.messageList");
            messageList.push({
                message : message.getParam("message"),
                messageType : 'Inbound'
            });
            component.set("v.messageList", messageList);
        }
    },
    handleEnter : function(component, event, helper) {
        if(event.keyCode === 13){
            var a = component.get('c.sendMessage');
            $A.enqueueAction(a);
        }
    },
    sendMessage : function(component, event, helper) {
        if(component.get("v.messageText")){
            let messageList = component.get("v.messageList");
            messageList.push({
                message : component.get("v.messageText"),
                messageType : 'Outbound'
            });
            component.set("v.messageList", messageList);
            var payload = {
                message : component.get("v.messageText"),
                messageFrom : 'AURA'
            };
            component.find("messageMedium").publish(payload);
            component.set("v.messageText", "");
        }
    }
})