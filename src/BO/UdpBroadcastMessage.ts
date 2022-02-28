import { IMessage } from "@/types/IMessage";
import {UdpBaseMessage} from "./UdpBaseMessage";

export class UdpBroadcastMessage extends UdpBaseMessage{

    private _myClass = UdpBroadcastMessage.name;
    
    public static isType (obj: any): obj is UdpBroadcastMessage
    {
        return (obj._myClass !== undefined) && (obj._myClass === UdpBroadcastMessage.name);
    }

    private static NextId = 0;

    public static CreateMessage (messageParts: string[], clientId: number, sourceIPAddress: string): UdpBroadcastMessage|null
    {
        let createdMessage: UdpBroadcastMessage|null = null;
        
        if (messageParts.length >= 4)
        {
            try
            {
                var messageText = messageParts[0];
                var messageId = ++UdpBroadcastMessage.NextId;
                var messageType = messageParts[3];
                //the time stamp of the packet is not used because the incoming time if for logging more interesting then the server time

                //create now the message object
                createdMessage = new UdpBroadcastMessage(sourceIPAddress, messageText, messageType,  new Date(Date.now()), messageId);
            }
            catch (exp)
            {
                //todo
                console.log("CreateBroadcastMessage exception");
                console.log(exp);
                throw exp;
            }
        }

        return createdMessage;
    }

    public toIMessage (): IMessage
    {
        let interfaceOnlyObject =
        {
            Message: this.Message,
            Timestamp: this.Timestamp,
            Server: this.Server,
            Level: this.Level,
            Id: this._messageId
        };
        return interfaceOnlyObject;
    }



    private constructor(sourceIPAddress: string,
                        messageText: string,
                        messageType: string,
                        timeStamp: Date,
                        messageId: number)
    {
        super(0, sourceIPAddress)
        this._message = messageText;
        this._timestamp = timeStamp;
        this._messageType = messageType;
        this._messageId = messageId;
    }

    private _messageId = 0;
    private _message = "-";
    private _timestamp:Date;
    private _messageType = "-";

     
    public get Timestamp():string
    {
        let ts = this._timestamp;

        //original return _timestamp.ToString("MM/dd/yyyy HH:mm:ss.fff");
        return ts.getMonth() + "/" + ts.getDate() + "/" + ts.getFullYear() + " " + ts.getHours() + ":" + ts.getMinutes() + ":" + ts.getSeconds() + "." + ts.getMilliseconds();
    }

    public get Server():string
    {
        return this.SourceIPAddress
        
    }
        
    public get Level(): string
    {
        return this._messageType;
    }

    public get Message (): string
    {
        return this._message;

    }
  
}