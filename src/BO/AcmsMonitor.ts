import { BroadcastReceiver, ReceiverState } from "./BroadcastReceiver";
import { ServerManager} from "./ServerManager";
import { EventEmitter} from "events";

type AcmsMonitorKeys = keyof AcmsMonitor;

function prop<T, K extends keyof T> (obj: T, key: K)
{
    return obj[key];
}


export class AcmsMonitor extends EventEmitter {

//#region public properties

    public readonly ExpertPassword = "master";

    public readonly ServerTimeout = 2*1000;//ms = 2s

    public readonly MaxSystemTimeDelta = 1*60*1000//ms =1min

    public UseStandardNetworkAccess = true;

//#endregion


//#region singleton pattern
    private static readonly _instance = new AcmsMonitor();

    private constructor ()
    {
        super();
    }

    public static get Instance(): AcmsMonitor{
        return this._instance;
    }

//#endregion

    /// <summary>
    /// Start the application logic and return the flow of control immediately.
    /// Only requirement is the the <paramref name="UiControl"/> is set properly.
    /// </summary>
    public Run()
    {
        this.AddReceiverStateChangeListener();
        this.StartReceiver(this.UseStandardNetworkAccess);
        this.StartServerAliveTimer();

        //todo
        /*
        //setup log4net
        //var repository = (log4net.Repository.Hierarchy.Hierarchy)log4net.LogManager.GetRepository();
        //repository.Root.AddAppender(LogManager.Instance);
        //Log.Info("AcmsMonitor.Run BEGIN");

        var dialog = new SelectNetworkDialog();
        dialog.ShowDialog();
        */
    }


    public StartReceiver (useStandardNetworkAccess:boolean)
    {
        if (!this.IsReceiverRunning)
        {
            this._udpReceiver.Start(useStandardNetworkAccess);
        }
    }

    public StopReceiver ()
    {
        if (this.IsReceiverRunning)
        {
            this._udpReceiver.Stop();
        }
    }

    private StartServerAliveTimer ()
    {      
        setInterval( () => {
            ServerManager.Instance.CheckServerActivity();
        }, this.ServerTimeout);
        
/*
            Timer t = new Timer(tServerTimeout.TotalMilliseconds);
        t.Elapsed += ServerAliveTimer;
        t.Start();
        */
    }

  

    private AddReceiverStateChangeListener()
    {
        this._udpReceiver.addListener("stateChanged", (currentState: ReceiverState)=>{
            console.log("AcmsMonitor.ProcessReceiverNotification: " + currentState);
            switch (currentState)
            {
                case ReceiverState.UdpReceiverStartFailed:
                    this.IsReceiverRunning = false;
                    break;
                case ReceiverState.UdpReceiverRunning:
                    this.IsReceiverRunning = true;
                    break;
                case ReceiverState.UdpReceiverStopped:
                    this.IsReceiverRunning = false;
                    break;
                case ReceiverState.UdpSocketAlreadyInUse://with pcap usages this case should not appear
                    this.IsReceiverRunning = false;
                    this.LastError = "UDP listener error: socket already in use.";
                    break;
                case ReceiverState.PcapNotLoaded:
                    this.IsReceiverRunning = false;
                    //dialog.showErrorBox("Network issue appeared.", "Winpcap is not installed. (https://www.winpcap.org/install/)");
                    break;
                case ReceiverState.UnknownException:
                    break;
                default:
                    break;
            }
        });
    }

    public NotifyAllPropertiesChanged (){
        this.NotifyPropertyChanged("IsReceiverRunning");
        this.NotifyPropertyChanged("IsHiddenServerListEmpty");
        this.NotifyPropertyChanged("LastError");
    }

    private NotifyPropertyChanged (propertyName: AcmsMonitorKeys)
    {
        let propertyValue = prop(this, propertyName);
        this.emit("propertyChanged", propertyName, propertyValue);
    }

    

//#region properties used by the UI

    public get IsReceiverRunning():boolean{
        return this._isReceiverRunning;
    }


    public set IsReceiverRunning (value: boolean)    
    {
        if (this._isReceiverRunning != value)
        {
            this._isReceiverRunning = value;
            this.NotifyPropertyChanged("IsReceiverRunning");
        }

    }

    /// <summary>
    /// Used by the UI for enabling buttons.
    /// The value will be set by <see cref="ServerManager"/>
    /// </summary>
    public get IsHiddenServerListEmpty():boolean{
        return this._isHiddenServerListEmpty;
    }

    public set IsHiddenServerListEmpty (value: boolean)
    {
        if (this._isHiddenServerListEmpty != value)
        {
            this._isHiddenServerListEmpty = value;
            this.NotifyPropertyChanged("IsHiddenServerListEmpty");
        }
    }

    public get LastError():string{
        return this._lastError;
    }

    public set LastError (value: string)
    {
        if (this._lastError != value)
        {
            this._lastError = value;
            this.NotifyPropertyChanged("LastError");
        }

    }


//#endregion


    private _isReceiverRunning = false;
    private _isHiddenServerListEmpty = true;
    private _lastError = "";

    private _udpReceiver = new BroadcastReceiver();

    //public static readonly log4net.ILog Log = log4net.LogManager.GetLogger("AcmsMonitor");
}