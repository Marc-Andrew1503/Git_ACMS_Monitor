import { UdpBroadcastMessage } from "./UdpBroadcastMessage";
import { UdpStateMessage} from "./UdpStateMessage";
import { ServerManager } from "./ServerManager";
import { MessageManager } from "./MessageManager";
import dgram from "dgram";
import { EventEmitter } from "events";
import { UdpMessageFactory } from "./UdpMessageFactory";

export enum ReceiverState
{
    UdpReceiverStartFailed,
    UdpReceiverRunning,
    UdpReceiverStopped,
    UdpSocketAlreadyInUse,
    PcapNotLoaded,
    UnknownException
}

export class BroadcastReceiver extends EventEmitter
{

    /// <summary>
    /// Starts for each network adapter which supports IP V4 an udp listener.
    /// </summary>
    /// <exception cref="System.IO.FileNotFoundException">Thrown if WinPcap is not found/not installed.</exception>
    public Start(useStandardNetworkAccess:boolean)
    {
        if (this.ReceiverState == ReceiverState.UdpReceiverStopped)
        {   
            if (useStandardNetworkAccess)
            {
                this.RunUdpListener();
            }            
        }
    }

    protected ProcessMessage( bytes:Buffer, sourceIp:string)
    {
        let newMessage = UdpMessageFactory.CreateMessage(bytes, sourceIp);

        if(newMessage !== null)
        {
            //process the different message types

            
            if (UdpStateMessage.isType(newMessage))
            {
                //the state message belongs to a dedicated server object          
                ServerManager.Instance.DistributeMessage(newMessage as UdpStateMessage);
            }
            else if (UdpBroadcastMessage.isType(newMessage))
            {
                MessageManager.Instance.AddMesssage(newMessage as UdpBroadcastMessage);
            }      
                
        }
        else
        {
            //todo
        }

    }

    /// <summary>
    /// Called from outside if winPcap loading failed.
    /// This could only determined from outside this class.
    /// The method will change the state and inform all listeners
    /// </summary>
    /*
    public static void StartFailed()
    {
        OnStateChanged(State.PcapNotLoaded);
    }
    */

    /// <summary>
    /// Stops all receiver if they are running.
    /// </summary>
    public Stop()
    {
        if (this.ReceiverState == ReceiverState.UdpReceiverRunning)
        {
            this.Halt();           
        }
    }


    public static readonly AcmsBroadcastPort = 8623;
    
    protected ReceiverState =  ReceiverState.UdpReceiverStopped;
    
    private _udpClient = dgram.createSocket("udp4");

    private NotifyStateChanged (aState: ReceiverState)
    {
        this.ReceiverState = aState;
        this.emit("stateChanged", aState);        
    }

    /// <summary>
    /// Main constructor
    /// </summary>
    public constructor()
    {
        super();
    }


    /// <summary>
    /// Halts the communication loop.
    /// </summary>
    protected Halt()
    {
        this._udpClient.close(()=>{
            this._udpClient = dgram.createSocket("udp4");
            this.NotifyStateChanged(ReceiverState.UdpReceiverStopped);
        });
        
        
        
        /*
        if (_listener != null)
        {
            try
            {
                _udpClient.Close();
                //StateChange?.Invoke(State.UdpReceiverStopped);
            }
            catch (SocketException e)
            {
                StateChange?.Invoke(State.UnknownException);
            }
        }
        */
    }

    /// <summary>
    /// This method contains the main listener loop.
    /// It will be started from the class in its own thread.
    /// </summary>
    protected RunUdpListener()
    {   
        this._udpClient.on("error", (err:any)=>{
            console.log("udp error:" + err);//tb debug

            if (err.code && (err.code === "EADDRINUSE"))
            {
                console.log("State.UdpSocketAlreadyInUse");//tb debug
                this.NotifyStateChanged(ReceiverState.UdpSocketAlreadyInUse)
            }
            else{
                console.log("State.UnknownError");//tb debug
                //tb debug this.NotifyErrorOcurred("UDP listener error: unknown error ocurred.");
            }
        });

        this._udpClient.on("message", (msg, remoteInfo)=>{
            this.ProcessMessage(msg, remoteInfo.address);
        });

        this._udpClient.bind(BroadcastReceiver.AcmsBroadcastPort,undefined,()=>{
            this.NotifyStateChanged(ReceiverState.UdpReceiverRunning);
        });        
    }

    


    }