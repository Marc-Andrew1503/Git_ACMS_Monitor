import { ICommand, CommandType } from "@/types/ICommand";
import { IpcChannel } from '@/types/IpcChannel';
import { IUpdate, UpdateType } from '@/types/IUpdate';
import { IServer } from "@/types/IServer";
import { ipcMain, webContents } from "electron";
import { AcmsMonitor } from "./AcmsMonitor";
import { MessageManager } from "./MessageManager";
import { Server } from "./Server";
import { ServerManager } from "./ServerManager";
import { UdpBroadcastMessage } from "./UdpBroadcastMessage";


export class UiConnector{


//#region singleton pattern
    private static readonly _instance = new UiConnector();

    private constructor()
    {
    }

    public static get Instance (): UiConnector
    {
        return this._instance;
    }

//#endregion

    public SetIpc (aWebContents: webContents){
        this._ipcEmitter = aWebContents;

        //listeners
        ipcMain.on(IpcChannel.UiCommand, (evt, args) =>
        {
            let command = args as ICommand;
            let server:Server|null|undefined = null;

            switch (command.Cmd)
            {
                case CommandType.ForceServerListChangedUdpate:
                    this._serverManager?.NotifyServerListChanged();
                    break;
                case CommandType.ForceServerChangedUpdate:
                    this._serverManager?.NotifyServerChanged(command.Arg as number);
                    break;      
                case CommandType.ForceMonitorChangedUpdate:
                    this._acmsMonitor?.NotifyAllPropertiesChanged()
                    break;  
                case CommandType.StopReceiver:
                    this._acmsMonitor?.StopReceiver();
                    break;        
                case CommandType.StartReceiver:
                    this._acmsMonitor?.StartReceiver(true);
                    break;
                case CommandType.DriverReset:
                    server = this._serverManager?.GetServer(command.Arg as number);
                    if(server) server.SendDriverResetCommand();
                    break;
                case CommandType.UpforceServer:
                    server = this._serverManager?.GetServer(command.Arg as number);
                    if (server) server.SendUpforceCommand();
                    break;
                case CommandType.ReleaseServer:
                    server = this._serverManager?.GetServer(command.Arg as number);
                    if (server) server.SendReleaseCommand();
                    break;
                default:
                    console.log("UiCommand not supported: " + command.Cmd);
            }
        });
    }

    public SetBoComponents (acmsMonitor: AcmsMonitor, serverManager:ServerManager, messageManager:MessageManager)
    {
        if (this._ipcEmitter === null) throw ("No web communication set. Use SetIpc() before using this method.");

        this._serverManager = serverManager;
        this._messageManager = messageManager;
        this._acmsMonitor = acmsMonitor;

        acmsMonitor.addListener("propertyChanged", (property: string, propertyValue: any)=>{
            let msg: IUpdate = {
                UpdateType: UpdateType.MonitorPropertyChanged,
                UpdateData: {
                    property: property,
                    value: propertyValue
                }
            };
            this._ipcEmitter?.send(IpcChannel.UpdateData, msg);
        });

        serverManager.addListener("serverPropertyChanged", (sender:Server, property:string, propertyValue:any)=>{
            let msg:IUpdate = {
                UpdateType: UpdateType.ServerPropertyChanged,
                UpdateData: {
                    serverId: sender.Id,                    
                    property: property,
                    value: propertyValue
                }
            };
            this._ipcEmitter?.send(IpcChannel.UpdateData, msg);
        });

        serverManager.addListener("serverChanged", (server: Server) =>
        {
            let msg: IUpdate = {
                UpdateType: UpdateType.ServerChanged,
                UpdateData: server.toIServer()
            };
            this._ipcEmitter?.send(IpcChannel.UpdateData, msg);
        });

        serverManager.addListener("serverListChanged", (serverList: Server[]) =>
        {           
            let interfaceOnlyList:IServer[] =[];
            for (const s of serverList) {
                interfaceOnlyList.push(s.toIServer());
            }

            let msg: IUpdate = {
                UpdateType: UpdateType.ServerListChanged,
                UpdateData: { serverList: interfaceOnlyList}                
            };
            this._ipcEmitter?.send(IpcChannel.UpdateData, msg);
        });

        messageManager.addListener("newMessage", (aMessage: UdpBroadcastMessage) =>
        {
            let msg: IUpdate = {
                UpdateType: UpdateType.NewMessage,
                UpdateData: { message: aMessage.toIMessage() }
            };
            this._ipcEmitter?.send(IpcChannel.UpdateData, msg);
        });

        messageManager.addListener("messageListReduced", (newListLength:number) =>
        {
            let msg: IUpdate = {
                UpdateType: UpdateType.MessageListReduced,
                UpdateData: { newLength: newListLength }
            };
            this._ipcEmitter?.send(IpcChannel.UpdateData, msg);
        });
    }

    private _ipcEmitter: webContents|null = null ;
    private _serverManager: ServerManager | null = null;
    private _messageManager: MessageManager | null = null;
    private _acmsMonitor: AcmsMonitor | null = null;


}