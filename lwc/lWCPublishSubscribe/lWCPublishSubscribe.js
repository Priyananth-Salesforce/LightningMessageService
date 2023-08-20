import { LightningElement, track, wire } from 'lwc';
//import  Message Channel what we have created in previous step
import messageMedium from '@salesforce/messageChannel/messageMedium__c';
//import scoped message service
import { publish, 
        MessageContext,
        unsubscribe,
        APPLICATION_SCOPE,
        subscribe} from 'lightning/messageService';
const inboundList = 'slds-chat-listitem slds-chat-listitem_inbound';
const outboundList = 'slds-chat-listitem slds-chat-listitem_outbound';
const inbountext = 'slds-chat-message__text slds-chat-message__text_inbound';
const outbountext = 'slds-chat-message__text slds-chat-message__text_outbound';
export default class LWCPublish extends LightningElement {
    messageText = '';
    @track messageList = [];

    @wire(MessageContext)
    messageContext;

    @track subscription = null;

    sendMessage() {
        if(this.messageText) {
            this.messageList.push(
                {
                    message : this.messageText,
                    messageTypeList : outboundList,
                    messageTypeText : outbountext
                }
            );
            const payload = { 
                                message : this.messageText,
                                messageFrom : 'LWC'
                            };
            publish(this.messageContext, messageMedium, payload);
        }
        this.messageText = '';
    }
    handleMessageText(event) {
        this.messageText = event.target.value; 
    }
    handleEnter(event){
        if(event.keyCode === 13){
          this.sendMessage();
        }
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if(!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                messageMedium,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
    handleMessage(message) {
        if(message.messageFrom != 'LWC') {
            this.messageList.push(
                {
                    message : message.message,
                    messageTypeList : inboundList,
                    messageTypeText : inbountext
                }
            );
        }                      
    }
    
}