import { CommandType } from "@/types/ICommand";
import { IpcChannel } from '@/types/IpcChannel';
import { UpdateType } from '@/types/IUpdate';
import { ipcMain } from "electron";
var UiConnector = /** @class */ (function () {
    function UiConnector() {
        this._ipcEmitter = null;
        this._serverManager = null;
        this._messageManager = null;
        this._acmsMonitor = null;
    }
    Object.defineProperty(UiConnector, "Instance", {
        get: function () {
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    UiConnector.prototype.SetIpc = function (aWebContents) {
        var _this = this;
        this._ipcEmitter = aWebContents;
        //listeners
        ipcMain.on(IpcChannel.UiCommand, function (evt, args) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var command = args;
            var server = null;
            switch (command.Cmd) {
                case CommandType.ForceServerListChangedUdpate:
                    (_a = _this._serverManager) === null || _a === void 0 ? void 0 : _a.NotifyServerListChanged();
                    break;
                case CommandType.ForceServerChangedUpdate:
                    (_b = _this._serverManager) === null || _b === void 0 ? void 0 : _b.NotifyServerChanged(command.Arg);
                    break;
                case CommandType.ForceMonitorChangedUpdate:
                    (_c = _this._acmsMonitor) === null || _c === void 0 ? void 0 : _c.NotifyAllPropertiesChanged();
                    break;
                case CommandType.StopReceiver:
                    (_d = _this._acmsMonitor) === null || _d === void 0 ? void 0 : _d.StopReceiver();
                    break;
                case CommandType.StartReceiver:
                    (_e = _this._acmsMonitor) === null || _e === void 0 ? void 0 : _e.StartReceiver(true);
                    break;
                case CommandType.DriverReset:
                    server = (_f = _this._serverManager) === null || _f === void 0 ? void 0 : _f.GetServer(command.Arg);
                    if (server)
                        server.SendDriverResetCommand();
                    break;
                case CommandType.UpforceServer:
                    server = (_g = _this._serverManager) === null || _g === void 0 ? void 0 : _g.GetServer(command.Arg);
                    if (server)
                        server.SendUpforceCommand();
                    break;
                case CommandType.ReleaseServer:
                    server = (_h = _this._serverManager) === null || _h === void 0 ? void 0 : _h.GetServer(command.Arg);
                    if (server)
                        server.SendReleaseCommand();
                    break;
                default:
                    console.log("UiCommand not supported: " + command.Cmd);
            }
        });
    };
    UiConnector.prototype.SetBoComponents = function (acmsMonitor, serverManager, messageManager) {
        var _this = this;
        if (this._ipcEmitter === null)
            throw ("No web communication set. Use SetIpc() before using this method.");
        this._serverManager = serverManager;
        this._messageManager = messageManager;
        this._acmsMonitor = acmsMonitor;
        acmsMonitor.addListener("propertyChanged", function (property, propertyValue) {
            var _a;
            var msg = {
                UpdateType: UpdateType.MonitorPropertyChanged,
                UpdateData: {
                    property: property,
                    value: propertyValue
                }
            };
            (_a = _this._ipcEmitter) === null || _a === void 0 ? void 0 : _a.send(IpcChannel.UpdateData, msg);
        });
        serverManager.addListener("serverPropertyChanged", function (sender, property, propertyValue) {
            var _a;
            var msg = {
                UpdateType: UpdateType.ServerPropertyChanged,
                UpdateData: {
                    serverId: sender.Id,
                    property: property,
                    value: propertyValue
                }
            };
            (_a = _this._ipcEmitter) === null || _a === void 0 ? void 0 : _a.send(IpcChannel.UpdateData, msg);
        });
        serverManager.addListener("serverChanged", function (server) {
            var _a;
            var msg = {
                UpdateType: UpdateType.ServerChanged,
                UpdateData: server.toIServer()
            };
            (_a = _this._ipcEmitter) === null || _a === void 0 ? void 0 : _a.send(IpcChannel.UpdateData, msg);
        });
        serverManager.addListener("serverListChanged", function (serverList) {
            var _a;
            var interfaceOnlyList = [];
            for (var _i = 0, serverList_1 = serverList; _i < serverList_1.length; _i++) {
                var s = serverList_1[_i];
                interfaceOnlyList.push(s.toIServer());
            }
            var msg = {
                UpdateType: UpdateType.ServerListChanged,
                UpdateData: { serverList: interfaceOnlyList }
            };
            (_a = _this._ipcEmitter) === null || _a === void 0 ? void 0 : _a.send(IpcChannel.UpdateData, msg);
        });
        messageManager.addListener("newMessage", function (aMessage) {
            var _a;
            var msg = {
                UpdateType: UpdateType.NewMessage,
                UpdateData: { message: aMessage.toIMessage() }
            };
            (_a = _this._ipcEmitter) === null || _a === void 0 ? void 0 : _a.send(IpcChannel.UpdateData, msg);
        });
        messageManager.addListener("messageListReduced", function (newListLength) {
            var _a;
            var msg = {
                UpdateType: UpdateType.MessageListReduced,
                UpdateData: { newLength: newListLength }
            };
            (_a = _this._ipcEmitter) === null || _a === void 0 ? void 0 : _a.send(IpcChannel.UpdateData, msg);
        });
    };
    //#region singleton pattern
    UiConnector._instance = new UiConnector();
    return UiConnector;
}());
export { UiConnector };
//# sourceMappingURL=UiConnector.js.map