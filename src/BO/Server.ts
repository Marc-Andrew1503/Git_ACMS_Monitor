import { IServer, ServerState } from "@/types/IServer";
import {UdpStateMessage} from "@/BO/UdpStateMessage"
import { AcmsMonitor } from "./AcmsMonitor";
import os from "os";
import dgram from "dgram";
import { EventEmitter } from "events";
import { BroadcastReceiver } from "./BroadcastReceiver";

type serverKeys = keyof Server;

function prop<T, K extends keyof T>(obj: T, key: K)
{
    return obj[key];
}

export class Server extends EventEmitter implements IServer{

    
    private _stateList :ServerState[] = [];
    private _addressList: string[] = [];
    private _systemTime = new Date();
    private _redundancy= Server._defaultString;
    private _version= Server._defaultString;
    private _upTime = Server._defaultString;
    private _cycleTime = Server._defaultString;
    private _host = Server._defaultString;
    private _priority = Server._defaultString;
    private _build = Server._defaultNumber;
    private _cpu = Server._defaultNumber;
    private _memory = Server._defaultNumber;
    private _id = Server._defaultNumber;
    private _isUpforced = false;
    private _isActive = false;
    private _isVersionDifferent = false;
    private _isBuildDifferent = false;
    private _isSystemTimeDifferent = false;
    private _isDemoActive = false;

    public toIServer (): IServer{
        let interfaceOnlyObject =
        {
            IsDemoActive: this.IsDemoActive,
            StateList: this.StateList,
            AddressList: this.AddressList,
            Redundancy: this.Redundancy,
            Version: this.Version,
            Build: this.Build,
            UpTime: this.UpTime,
            CycleTime: this.CycleTime,
            SystemTime: this.SystemTime,
            Cpu: this.Cpu,
            Memory: this.Memory,
            Host: this.Host,
            Priority: this.Priority,
            IsUpforced: this.IsUpforced,
            IsActive: this.IsActive,
            IsVersionDifferent: this.IsVersionDifferent,
            IsBuildDifferent: this.IsBuildDifferent,
            IsSystemTimeDifferent: this.IsSystemTimeDifferent,
            Id: this.Id,
            Show: true
        };
        return interfaceOnlyObject;
    }

    /// <summary>
    /// Convenience access to the first ip address.
    /// </summary>
    /// <returns>The first ip address or empty string if no address is defined</returns>
    public GetFirstAddress (): string
    {
        let address = "";

        if (this._addressList.length > 0)
        {
            address = this._addressList[0];
        }

        return address;
    }

    private NotifyPropertyChanged (propertyName: serverKeys)
    {        
        let propertyValue = prop(this, propertyName);
        this.emit("propertyChanged", this, propertyName, propertyValue);
    }

//#region get/set
    public get AddressList (): string[]
    {
        return this._addressList;
    }

    public get StateList (): ServerState[]
    {
        return this._stateList;
    }
    public set StateList (v: ServerState[])
    {
        let arrayIsUnequal = false;

        if(this._stateList.length !== v.length)
        {
            arrayIsUnequal = true;
        }
        else{
            for (const state of v) {
                if(this._stateList.indexOf(state) <0)
                {
                    arrayIsUnequal = true;
                    break;
                }                
            }
        }

        if(arrayIsUnequal){
            this._stateList = v;
            this.NotifyPropertyChanged("StateList");
        }
        
    }

    public get IsUpforced (): boolean
    {
        return this._isUpforced;
    }
    public set IsUpforced (v: boolean)
    {
        if (this._isUpforced !== v){
            this._isUpforced = v;
            this.NotifyPropertyChanged("IsUpforced");
        }
    }

    public get SystemTime (): Date
    {
        return this._systemTime;
    }
    public set SystemTime (v: Date)
    {
        if (this._systemTime !== v){
            this._systemTime = v;
            this.NotifyPropertyChanged("SystemTime");
        }
    }

    public get Build (): number
    {
        return this._build;
    }
    public set Build (v: number)
    {
        if (this._build !== v){
            this._build = v;
            this.NotifyPropertyChanged("Build");
        }
    }

    public get Cpu (): number
    {
        return this._cpu;
    }
    public set Cpu (v: number)
    {
        if (this._cpu !== v){
            this._cpu = v;
            this.NotifyPropertyChanged("Cpu");
        }
    }

    public get Memory (): number
    {
        return this._memory;
    }
    public set Memory (v: number)
    {
        if (this._memory !== v){
            this._memory = v;
            this.NotifyPropertyChanged("Memory");
        }
    }

    public get Id (): number
    {
        return this._id;
    }
    public set Id (v: number)
    {
        if (this._id !== v){
            this._id = v;
            this.NotifyPropertyChanged("Id");
        }
    }

    public get Redundancy (): string
    {
        return this._redundancy;
    }
    public set Redundancy (v: string)
    {
        if (this._redundancy !== v){
            this._redundancy = v;
            this.NotifyPropertyChanged("Redundancy");
        }
    }
    public get Version (): string
    {
        return this._version;
    }
    public set Version (v: string)
    {
        if (this._version !== v){
            this._version = v;
            this.NotifyPropertyChanged("Version");
        }
    }
    
    public get UpTime (): string
    {
        return this._upTime;
    }
    public set UpTime (v: string)
    {
        if (this._upTime !== v){
            this._upTime = v;
            this.NotifyPropertyChanged("UpTime");
        }
    }

    public get CycleTime (): string
    {
        return this._cycleTime;
    }
    public set CycleTime (v: string)
    {
        if (this._cycleTime !== v){
            this._cycleTime = v;
            this.NotifyPropertyChanged("CycleTime");
        }

    }

    public get Host (): string
    {
        return this._host;
    }
    public set Host (v: string)
    {
        if (this._host !== v){
            this._host = v;
            this.NotifyPropertyChanged("Host");
        }
    }

    public get Priority (): string
    {
        return this._priority;
    }
    public set Priority (v: string)
    {
        if (this._priority !== v){
            this._priority = v;
            this.NotifyPropertyChanged("Priority");
        }        
    }

    public get IsActive() : boolean {
        return this._isActive;
    }
    public set IsActive(v : boolean) {
        if (this._isActive !== v){
            this._isActive = v;
            this.NotifyPropertyChanged("IsActive");
        }
    }
    
    public get IsVersionDifferent (): boolean
    {
        return this._isVersionDifferent;
    }
    public set IsVersionDifferent (v: boolean)
    {
        if (this._isVersionDifferent !== v){
            this._isVersionDifferent = v;
            this.NotifyPropertyChanged("IsVersionDifferent");
        }        
    }

    public get IsBuildDifferent (): boolean
    {
        return this._isBuildDifferent;
    }
    public set IsBuildDifferent (v: boolean)
    {
        if (this._isBuildDifferent !== v){
            this._isBuildDifferent = v;
            this.NotifyPropertyChanged("IsBuildDifferent");
        }
    }

    public get IsSystemTimeDifferent (): boolean
    {
        return this._isSystemTimeDifferent;
    }
    public set IsSystemTimeDifferent (v: boolean)
    {
        if(this._isSystemTimeDifferent !== v){
            this._isSystemTimeDifferent = v;
            this.NotifyPropertyChanged("IsSystemTimeDifferent");
        }        
    }

    public get IsDemoActive (): boolean
    {
        return this._isDemoActive;
    }
    public set IsDemoActive (v: boolean)
    {
        if(this._isDemoActive !== v)
        {
            this._isDemoActive = v;
            this.NotifyPropertyChanged("IsDemoActive");
        }        
    }
    public get Show(): boolean
    {
        return true;
    }
    public set Show (v: boolean)
    {
    }
//#endregion get/set

    public constructor(identifier:number){  
        super();      
        this._id = identifier;
    }

    private static GetOwnHostName ():string
    {
        if (Server.OwnHostName == null)
        {
            Server.OwnHostName = os.hostname();
        }

        return Server.OwnHostName as string;
    }

    private static OwnHostName:string|null = null;

    public UpdateState (aMessage: UdpStateMessage)
    {
        this._messageTimeStamp = new Date(Date.now());
        this.IsActive = true;

        this.Version = aMessage.Version;
        this.Redundancy = aMessage.RedundancyStateText;
        this.UpTime = aMessage.UpTimeText;
        this.Build = aMessage.BuildNumber;
        this.SystemTime = aMessage.Now;
        this.Cpu = aMessage.CpuUsage;
        this.Memory = aMessage.MemUsage;
        this.CycleTime = aMessage.CycleTimeMax + ":" + aMessage.CycleTimeUsed;//create the cycle time text
        this.Priority = aMessage.Priority1 + ":" + aMessage.Priority2 + ":" + aMessage.Priority3;

        this.SetAddress(aMessage.SourceIPAddress);

        //create the current list of states        
        let newStateList: ServerState[] = [];
        if (aMessage.State == ServerState.SYNCHRONIZED)
        {
            //synchronized is set most of the time but it should be only active if no other bits are set
            newStateList.push(ServerState.SYNCHRONIZED);
        }
        else
        {
            //added from highest numbers to the lowest to keep the errors(highest number) on top of the list
            if ((aMessage.State & ServerState.LOST_ALL_OTHER) > 0) newStateList.push(ServerState.LOST_ALL_OTHER);
            if ((aMessage.State & ServerState.LOST_MYSELF) > 0) newStateList.push(ServerState.LOST_MYSELF);
            if ((aMessage.State & ServerState.WORST_CYCLETIME) > 0) newStateList.push(ServerState.WORST_CYCLETIME);
            if ((aMessage.State & ServerState.WORSE_CYCLETIME) > 0) newStateList.push(ServerState.WORSE_CYCLETIME);
            if ((aMessage.State & ServerState.BAD_CYCLETIME) > 0) newStateList.push(ServerState.BAD_CYCLETIME);
            if ((aMessage.State & ServerState.ERRORDRIVER) > 0) newStateList.push(ServerState.ERRORDRIVER);
            if ((aMessage.State & ServerState.ERROROBJECT) > 0) newStateList.push(ServerState.ERROROBJECT);
            if ((aMessage.State & ServerState.FORCEDCONDITION) > 0) newStateList.push(ServerState.FORCEDCONDITION);
            if ((aMessage.State & ServerState.FORCEDVARIABLES) > 0) newStateList.push(ServerState.FORCEDVARIABLES);
            if ((aMessage.State & ServerState.CALMDOWN) > 0) newStateList.push(ServerState.CALMDOWN);           
        }

        this.StateList = newStateList;

        //the demo mode state will be stored extra
        if ((aMessage.State & ServerState.DEMOCONDITION) > 0) this.IsDemoActive = true;

        //detect and the upforced master state
        if (aMessage.RedundancyStateText.startsWith("UPFORCED"))
        {
            this.IsUpforced = true;
        }
        else
        {
            this.IsUpforced = false;
        }
    }

    /// <summary>
    /// Used to set the address of the server.
    /// The server supports multiple addresses.
    /// Also the DNS name for the ip address will be retrieved here asynchronous.
    /// A already known address will not be added anymore and will have no effect.
    /// </summary>
    /// <param name="aAddress">The address to add to the list of addresses</param>
    private SetAddress (aAddress:string)
    {
        //AcmsMonitor.Log.Debug("Server.SetAddress(" + aAddress + ") BEGIN");

        let isAddressAvailable = false;

        //first check if address is already present
        for (const address of this._addressList) {         
            if (address == aAddress)
            {
                isAddressAvailable = true;
                break;
            }
        }

        //if not present add address to list and look for the host name
        if (!isAddressAvailable)
        {
            this._addressList.push(aAddress);
            this.NotifyPropertyChanged("AddressList");            
        /*
        //get host name for address
        //done in a extra thread because time out if no host name is available lames the application
        ThreadPool.QueueUserWorkItem(((o) =>
        {
            try
            {
                    IPHostEntry entry = Dns.GetHostEntry(aAddress);
                if (entry != null)
                {
                    //check if the host name of this machine and the server are the same for the first part (until the .) The dns request seem to deliver for some server the own host name!
                    if (entry.HostName.Split('.')[0] != GetOwnHostName())
                    {
                        Host = entry.HostName;
                    }
                }
            }
            catch (SocketException ex)
                {
                AcmsMonitor.Log.Warn("Server.SetAddress SocketException occured for address " + aAddress + ": " + ex.Message);
            }
            }));
            */
        
        }   

        //AcmsMonitor.Log.Debug ("Server.SetAddress END");
    }

    /// <summary>
    /// Sends the driver reset command to the ACMS server
    /// </summary>
    public SendDriverResetCommand ()
    {        
        this.SendUdpPacket(Buffer.from([0xcb, 0x00, 0x31, 0x30, 0x34, 0x38, 0x35, 0x37, 0x36, 0x00, 0x61, 0x63, 0x6d, 0x73, 0x20, 0x6d, 0x6f, 0x6e, 0x69, 0x74, 0x6f, 0x00]));
        // if (this.AddressList.length > 0)
        // {
        //     console.log("data sending");//tb debug
        //     const client = dgram.createSocket('udp4');
        //     const data = Buffer.from([0xcb, 0x00, 0x31, 0x30, 0x34, 0x38, 0x35, 0x37, 0x36, 0x00, 0x61, 0x63, 0x6d, 0x73, 0x20, 0x6d, 0x6f, 0x6e, 0x69, 0x74, 0x6f, 0x00]);
        //     client.send(data, BroadcastReceiver.AcmsBroadcastPort,this.GetFirstAddress(), (err, bytes)=>{
        //         if(err)
        //         {
        //             //todo
        //             //log error
        //             console.log("SendDriverResetCommand error ocurred: " + err);//tb debug
        //         }
        //         console.log("data sent");//tb debug
        //         client.close();
        //     });            
        // }
    }

    /// <summary>
    /// Sends the upforce command to the ACMS server
    /// </summary>
    public SendUpforceCommand ()
    {
        this.SendUdpPacket(Buffer.from([0x12, 0x00]));
    }

    /// <summary>
    /// Sends the release command to the ACMS server to stop 'upforce'
    /// </summary>
    public SendReleaseCommand ()
    {
        this.SendUdpPacket(Buffer.from([0x13, 0x00]));
    }


    /// <summary>
    /// Sends the passed data to the server first IP address if available
    /// </summary>
    /// <param name="dataToSend">BYtes to send.</param>
    private SendUdpPacket (dataToSend:Buffer)
    {
        if (this.AddressList.length > 0)
        {
            console.log("data sending");//tb debug
            const client = dgram.createSocket('udp4');            
            client.send(dataToSend, BroadcastReceiver.AcmsBroadcastPort, this.GetFirstAddress(), (err, bytes) =>
            {
                if (err)
                {
                    //todo
                    //log error
                    console.log("SendUdpPacket error ocurred: " + err);//tb debug
                }
                client.close();
            });
        }
    }

    /// <summary>
    /// Checks the activity of the server.
    /// This is done by testing the time difference of passed current time an the timestamp of the last received message
    /// </summary>
    /// <param name="currentTime"></param>
    public CheckActivity (currentTime:Date)
    {
        if ((this._messageTimeStamp.valueOf() + AcmsMonitor.Instance.ServerTimeout) < currentTime.valueOf())
        {
            this.IsActive = false;
        }
    }

    /// <summary>
    /// A textual representation for the server.
    /// if the host name is available it is used, otherwise the first ip address.
    /// </summary>
    /// <returns>The host name of the server</returns>
    public ToString (): string
    {
        let serverAsText = Server._defaultString;

        if (this.Host !== Server._defaultString)
        {
            if (this.Host !== Server._defaultString)
                serverAsText = this.Host;
        }
        else
        {
            if (this.AddressList.length > 0)
            {
                serverAsText = this.AddressList[0];
            }
        }

        return serverAsText;
    }


    /// <summary>
    /// Send the get redundancy info package to a specific server
    /// </summary>
    public static SendGetInfoCommand ()
    {
        let dataToSend =  Buffer.from([ 0x0e, 0x00 ]);

        //todo
        /*
            IPEndPoint target = new IPEndPoint(IPAddress.Parse("192.168.193.161"), BroadcastReceiver.AcmsBroadcastPort);
            UdpClient client = new UdpClient();

        client.SendAsync(dataToSend, dataToSend.Length, target);
        */
    }


    private _messageTimeStamp:Date = new Date();
      

    private static _defaultString = "-";
    private static _defaultNumber = 0;


}