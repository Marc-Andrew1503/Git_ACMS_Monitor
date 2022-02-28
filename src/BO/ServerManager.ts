import { UdpStateMessage } from "./UdpStateMessage";
import { Server } from "./Server";
import { AcmsMonitor } from "./AcmsMonitor";
import { EventEmitter } from "events";

/// <summary>
/// Manages the ACMS server instances for tracking the state broadcast messages.
/// In detail:
/// deploys all incoming messages
/// created servers object if a new message will be detected
/// 
/// </summary>
export class ServerManager extends EventEmitter {

//#region singleton pattern
    private static readonly _instance = new ServerManager();

   
    private constructor()
    {
        super();
    }

    public static get Instance (): ServerManager
    {
        return this._instance;
    }

//#endregion

    /// <summary>
    /// Distributes the received message to the corresponding <see cref="Server"/> instance.
    /// If no Server exists a new one will be created <see cref="Server.Identifier"/>
    /// </summary>
    /// <param name="aMessage">The complete message received by an UCS/ACMS server</param>
    public DistributeMessage (aMessage: UdpStateMessage)
    {

        
        let server = this.GetServer(aMessage.Identifier);

        //create server if not available
        if (server == null)
        {
            server = new Server(aMessage.Identifier);
            server.UpdateState(aMessage);
            this.AddServerChangedListener(server);
            this.ServerList.push(server);
            this.NotifyServerListChanged();
        }
        else{
            server.UpdateState(aMessage);
        }
        
        this.DetectVersionDifferences(server);
        this.DetectBuildDifferences(server);
        this.DetectSystemTimeDifferences(server);    
    }

    /// <summary>
    /// Detects address changes to sort the ServerList according to the first ip address
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private AddServerChangedListener(aServer:Server){
        aServer.addListener("propertyChanged", (sender: Server, property: string, value:any) =>
        {
            //AcmsMonitor.Log.Debug("this.ServerAddressChangedListener(" + e.PropertyName + ") BEGIN");

            this.emit("serverPropertyChanged", sender, property, value);

            if (property === "Address")
            {
                let server = sender;

                if (server.AddressList.length > 0)
                {
                    let newAddress = server.GetFirstAddress();

                    //let the whole algorithm run in UI thread because auf access/change of teh ServerList
                    //AcmsMonitor.Log.Debug("this.ServerAddressChangedListener.UImethod BEGIN");

                    let serverIndex = this.ServerList.indexOf(server);

                    if (serverIndex >= 0)
                    {
                        //check if it should move upwards
                        let newIndex = serverIndex;
                        for (let i = serverIndex + 1; i < this.ServerList.length; i++)
                        {
                            if (newAddress < this.ServerList[i].GetFirstAddress()) newIndex = i;
                        }

                        //the server should be moved upwards
                        if (newIndex != serverIndex)
                        {
                            this.ServerList.splice(serverIndex, 1);
                            this.ServerList.splice(newIndex - 1, 0, server);
                            this.NotifyServerListChanged();
                        }
                        else
                        {
                            //check if it should move downwards
                            newIndex = serverIndex;
                            for (let i = serverIndex - 1; i >= 0; i--)
                            {
                                if (newAddress > this.ServerList[i].GetFirstAddress()) newIndex = i;
                            }
                            //the server should be moved downwards
                            if (newIndex != serverIndex)
                            {
                                this.ServerList.splice(serverIndex, 1);
                                this.ServerList.splice(newIndex, 0, server);
                                this.NotifyServerListChanged();
                            }
                        }
                    }

                    //AcmsMonitor.Log.Debug ("this.ServerAddressChangedListener.UImethod END");
                }
            }
            //AcmsMonitor.Log.Debug("this.ServerAddressChangedListener END");
        });    
    }


   

    /// <summary>
    /// Adds a fully defined server in the <see cref="ServerList"/> to the correct position.
    /// The list is sorted by the first IP address.
    /// It is used by moving servers from the hidden list to the visible server list.
    /// New server instances may not have a valid ip address and tehrefor this method can't be used
    /// </summary>
    /// <param name="aServer">The server to add</param>
    private AddServerAtCorrectIndex (aServer: Server)
    {
        let isServerAlreadyAdded = false;

        if (aServer.AddressList.length > 0)
        {
            for (let i = 0; i < this.ServerList.length; i++)
            {
                if (aServer.GetFirstAddress() < this.ServerList[i].GetFirstAddress())
                {
                    this.ServerList.splice(i, 0, aServer);
                    isServerAlreadyAdded = true;
                    this.NotifyServerListChanged();
                    break;
                }
            }
        }

        if (!isServerAlreadyAdded)
        {
            this.ServerList.push(aServer);
            this.NotifyServerListChanged();
        }
    
    }


    private DetectSystemTimeDifferences (server: Server)
    {
        //check if the ACMS server software version is different in respect to the other visible servers

        let foundDifferentTime = false;
        let minTime = new Date(server.SystemTime.valueOf() - AcmsMonitor.Instance.MaxSystemTimeDelta);
        let maxTime = new Date(server.SystemTime.valueOf() + AcmsMonitor.Instance.MaxSystemTimeDelta);

        for (const s of this.ServerList) {
            if ((s.SystemTime < minTime) || (s.SystemTime > maxTime))
            {
                foundDifferentTime = true;
                break;
            }
        }
        if (foundDifferentTime)
        {
            server.IsSystemTimeDifferent = true;
        }
        else
        {
            server.IsSystemTimeDifferent = false;
        }

    }


    private DetectVersionDifferences (server: Server)
    {
        //check if the ACMS server software version is different in respect to the other visible servers
  
        let foundDifferentVersion = false;
        for (const s of this.ServerList)
        {
            if (server.Version != s.Version)
            {
                foundDifferentVersion = true;
                break;
            }
        }
        if (foundDifferentVersion)
        {
            server.IsVersionDifferent = true;
        }
        else
        {
            server.IsVersionDifferent = false;
        }
    }


    private DetectBuildDifferences (server: Server)
    {
    //check if the ACMS server software version is different in respect to the other visible servers
   
        let foundDifferentVersion = false;
        for (const s of this.ServerList)
        {
            if (server.Build != s.Build)
            {
                foundDifferentVersion = true;
                break;
            }
        }
        if (foundDifferentVersion)
        {
            server.IsBuildDifferent = true;
        }
        else
        {
            server.IsBuildDifferent = false;
        }
    }

    /// <summary>
    /// Removes the passed server from the public list of servers.
    /// Will be called by UI, no special handling for ServerList access required.
    /// </summary>
    /// <param name="aServer">Server to hide.</param>
    public HideServer (aServer: Server)
    {      
        //todo: maybe the hidden feature is better only in the UI implemented
        let idx = this.ServerList.indexOf(aServer);
        if (idx >=0)
        {
            this.ServerList.splice(idx,1);
            this.HiddenServerList.push(aServer);
            this.NotifyServerListChanged();
            AcmsMonitor.Instance.IsHiddenServerListEmpty = false;
        }
        
    }

    /// <summary>
    /// Removes the passed server from the hidden list of servers and makes it visible again.
    /// Will be called by UI, no special handling for ServerList access required.
    /// </summary>
    /// <param name="aServer"></param>
    public UnhideServer (aServer: Server)
    {
        //todo: maybe the hidden feature is better only in the UI implemented
        let idx = this.HiddenServerList.indexOf(aServer);
        if (idx >= 0)
        {
            this.HiddenServerList.splice(idx, 1);
            this.AddServerAtCorrectIndex(aServer);
            if (this.HiddenServerList.length == 0)
            {
                AcmsMonitor.Instance.IsHiddenServerListEmpty = true;
            }
        }
    }

    /// <summary>
    /// Clears all severs from all lists
    /// Will be called by UI, no special habdling for ServerList access required.
    /// </summary>
    public ClearList()
    {        
        this.HiddenServerList = [];
        this.ServerList =[];
        AcmsMonitor.Instance.IsHiddenServerListEmpty = true;        
    }


    /// <summary>
    /// Test the activity of all managed servers.
    /// Will be invoked by an external timer
    /// </summary>
    public CheckServerActivity()
    {
        let currentTime = new Date(Date.now());
        for (const s of this.ServerList) {
            s.CheckActivity(currentTime);
        }           
    }



    /// <summary>
    /// Searches for a server in the list of servers and hidden servers.
    /// </summary>
    /// <param name="identifier">The identifier of the server to search for.</param>
    /// <returns>The server od NULL if not found.</returns>
    public GetServer (identifier:number): Server|null
    {
        //AcmsMonitor.Log.Debug("this.GetServer(" + identifier + ") BEGIN");

        let server: Server | null = null;

        for (const s of this.ServerList) {            
            if (identifier == s.Id)
            {
                server = s;
                break;
            }
        }

        if (server == null)
        {
            for (const s of this.HiddenServerList)            
            {
                if (identifier == s.Id)
                {
                    server = s;
                    break;
                }
            }
        }
        
        //if (server != null) AcmsMonitor.Log.Debug("this.GetServer(" + identifier + ") END: server"); else AcmsMonitor.Log.Debug("this.GetServer(" + identifier + ") END: null");
        return server;
    }

    public NotifyServerListChanged(){
        this.emit("serverListChanged", this.ServerList);
    }

    public NotifyServerChanged (identifier:number)
    {
        const server = this.GetServer(identifier);
        if(server)
        {
            this.emit("serverChanged", server);
        }        
    }

    /// <summary>
    /// Stores all known server.
    /// Used also by the UI as data source.
    /// </summary>
    private ServerList: Server[] = [];

    private HiddenServerList: Server[] = [];


}