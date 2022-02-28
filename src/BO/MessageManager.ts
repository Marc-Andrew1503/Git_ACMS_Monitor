import { UdpBroadcastMessage } from "./UdpBroadcastMessage";
import { EventEmitter } from "events";

/// <summary>
/// Manages all common broadcast messages and provides a list with data binding for the UI
/// </summary>
export class MessageManager extends EventEmitter {

//#region singleton pattern
    private static readonly _instance = new MessageManager();

    private constructor()
    {
        super();
    }

    public static get Instance (): MessageManager
    {
        return this._instance;
    }

//#endregion

    //#region public methods and properties

    public AddMesssage (aMessage: UdpBroadcastMessage)
    {
        this.MessageList.push(aMessage);
        this.emit("newMessage",aMessage);

        //check if maximum logged, remove the 20% oldest logs
        if (this.MessageList.length > this._maxEntryCount)
        {
            let removeCount = Math.trunc(this._maxEntryCount * 0.2);
            this.MessageList.splice(0,removeCount);
            this.emit("messageListReduced", this.MessageList.length);
        }
    }

    /// <summary>
    /// Stores all broadcast messages
    /// Used also by the UI as data source.
    /// </summary>
    public MessageList: UdpBroadcastMessage[] = [];
      
    private _maxEntryCount = 1000;
}