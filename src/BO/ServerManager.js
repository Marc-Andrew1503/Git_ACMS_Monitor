import { __extends } from "tslib";
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
var ServerManager = /** @class */ (function (_super) {
    __extends(ServerManager, _super);
    function ServerManager() {
        var _this = _super.call(this) || this;
        /// <summary>
        /// Stores all known server.
        /// Used also by the UI as data source.
        /// </summary>
        _this.ServerList = [];
        _this.HiddenServerList = [];
        return _this;
    }
    Object.defineProperty(ServerManager, "Instance", {
        get: function () {
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    /// <summary>
    /// Distributes the received message to the corresponding <see cref="Server"/> instance.
    /// If no Server exists a new one will be created <see cref="Server.Identifier"/>
    /// </summary>
    /// <param name="aMessage">The complete message received by an UCS/ACMS server</param>
    ServerManager.prototype.DistributeMessage = function (aMessage) {
        var server = this.GetServer(aMessage.Identifier);
        //create server if not available
        if (server == null) {
            server = new Server(aMessage.Identifier);
            server.UpdateState(aMessage);
            this.AddServerChangedListener(server);
            this.ServerList.push(server);
            this.NotifyServerListChanged();
        }
        else {
            server.UpdateState(aMessage);
        }
        this.DetectVersionDifferences(server);
        this.DetectBuildDifferences(server);
        this.DetectSystemTimeDifferences(server);
    };
    /// <summary>
    /// Detects address changes to sort the ServerList according to the first ip address
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    ServerManager.prototype.AddServerChangedListener = function (aServer) {
        var _this = this;
        aServer.addListener("propertyChanged", function (sender, property, value) {
            //AcmsMonitor.Log.Debug("this.ServerAddressChangedListener(" + e.PropertyName + ") BEGIN");
            _this.emit("serverPropertyChanged", sender, property, value);
            if (property === "Address") {
                var server = sender;
                if (server.AddressList.length > 0) {
                    var newAddress = server.GetFirstAddress();
                    //let the whole algorithm run in UI thread because auf access/change of teh ServerList
                    //AcmsMonitor.Log.Debug("this.ServerAddressChangedListener.UImethod BEGIN");
                    var serverIndex = _this.ServerList.indexOf(server);
                    if (serverIndex >= 0) {
                        //check if it should move upwards
                        var newIndex = serverIndex;
                        for (var i = serverIndex + 1; i < _this.ServerList.length; i++) {
                            if (newAddress < _this.ServerList[i].GetFirstAddress())
                                newIndex = i;
                        }
                        //the server should be moved upwards
                        if (newIndex != serverIndex) {
                            _this.ServerList.splice(serverIndex, 1);
                            _this.ServerList.splice(newIndex - 1, 0, server);
                            _this.NotifyServerListChanged();
                        }
                        else {
                            //check if it should move downwards
                            newIndex = serverIndex;
                            for (var i = serverIndex - 1; i >= 0; i--) {
                                if (newAddress > _this.ServerList[i].GetFirstAddress())
                                    newIndex = i;
                            }
                            //the server should be moved downwards
                            if (newIndex != serverIndex) {
                                _this.ServerList.splice(serverIndex, 1);
                                _this.ServerList.splice(newIndex, 0, server);
                                _this.NotifyServerListChanged();
                            }
                        }
                    }
                    //AcmsMonitor.Log.Debug ("this.ServerAddressChangedListener.UImethod END");
                }
            }
            //AcmsMonitor.Log.Debug("this.ServerAddressChangedListener END");
        });
    };
    /// <summary>
    /// Adds a fully defined server in the <see cref="ServerList"/> to the correct position.
    /// The list is sorted by the first IP address.
    /// It is used by moving servers from the hidden list to the visible server list.
    /// New server instances may not have a valid ip address and tehrefor this method can't be used
    /// </summary>
    /// <param name="aServer">The server to add</param>
    ServerManager.prototype.AddServerAtCorrectIndex = function (aServer) {
        var isServerAlreadyAdded = false;
        if (aServer.AddressList.length > 0) {
            for (var i = 0; i < this.ServerList.length; i++) {
                if (aServer.GetFirstAddress() < this.ServerList[i].GetFirstAddress()) {
                    this.ServerList.splice(i, 0, aServer);
                    isServerAlreadyAdded = true;
                    this.NotifyServerListChanged();
                    break;
                }
            }
        }
        if (!isServerAlreadyAdded) {
            this.ServerList.push(aServer);
            this.NotifyServerListChanged();
        }
    };
    ServerManager.prototype.DetectSystemTimeDifferences = function (server) {
        //check if the ACMS server software version is different in respect to the other visible servers
        var foundDifferentTime = false;
        var minTime = new Date(server.SystemTime.valueOf() - AcmsMonitor.Instance.MaxSystemTimeDelta);
        var maxTime = new Date(server.SystemTime.valueOf() + AcmsMonitor.Instance.MaxSystemTimeDelta);
        for (var _i = 0, _a = this.ServerList; _i < _a.length; _i++) {
            var s = _a[_i];
            if ((s.SystemTime < minTime) || (s.SystemTime > maxTime)) {
                foundDifferentTime = true;
                break;
            }
        }
        if (foundDifferentTime) {
            server.IsSystemTimeDifferent = true;
        }
        else {
            server.IsSystemTimeDifferent = false;
        }
    };
    ServerManager.prototype.DetectVersionDifferences = function (server) {
        //check if the ACMS server software version is different in respect to the other visible servers
        var foundDifferentVersion = false;
        for (var _i = 0, _a = this.ServerList; _i < _a.length; _i++) {
            var s = _a[_i];
            if (server.Version != s.Version) {
                foundDifferentVersion = true;
                break;
            }
        }
        if (foundDifferentVersion) {
            server.IsVersionDifferent = true;
        }
        else {
            server.IsVersionDifferent = false;
        }
    };
    ServerManager.prototype.DetectBuildDifferences = function (server) {
        //check if the ACMS server software version is different in respect to the other visible servers
        var foundDifferentVersion = false;
        for (var _i = 0, _a = this.ServerList; _i < _a.length; _i++) {
            var s = _a[_i];
            if (server.Build != s.Build) {
                foundDifferentVersion = true;
                break;
            }
        }
        if (foundDifferentVersion) {
            server.IsBuildDifferent = true;
        }
        else {
            server.IsBuildDifferent = false;
        }
    };
    /// <summary>
    /// Removes the passed server from the public list of servers.
    /// Will be called by UI, no special handling for ServerList access required.
    /// </summary>
    /// <param name="aServer">Server to hide.</param>
    ServerManager.prototype.HideServer = function (aServer) {
        //todo: maybe the hidden feature is better only in the UI implemented
        var idx = this.ServerList.indexOf(aServer);
        if (idx >= 0) {
            this.ServerList.splice(idx, 1);
            this.HiddenServerList.push(aServer);
            this.NotifyServerListChanged();
            AcmsMonitor.Instance.IsHiddenServerListEmpty = false;
        }
    };
    /// <summary>
    /// Removes the passed server from the hidden list of servers and makes it visible again.
    /// Will be called by UI, no special handling for ServerList access required.
    /// </summary>
    /// <param name="aServer"></param>
    ServerManager.prototype.UnhideServer = function (aServer) {
        //todo: maybe the hidden feature is better only in the UI implemented
        var idx = this.HiddenServerList.indexOf(aServer);
        if (idx >= 0) {
            this.HiddenServerList.splice(idx, 1);
            this.AddServerAtCorrectIndex(aServer);
            if (this.HiddenServerList.length == 0) {
                AcmsMonitor.Instance.IsHiddenServerListEmpty = true;
            }
        }
    };
    /// <summary>
    /// Clears all severs from all lists
    /// Will be called by UI, no special habdling for ServerList access required.
    /// </summary>
    ServerManager.prototype.ClearList = function () {
        this.HiddenServerList = [];
        this.ServerList = [];
        AcmsMonitor.Instance.IsHiddenServerListEmpty = true;
    };
    /// <summary>
    /// Test the activity of all managed servers.
    /// Will be invoked by an external timer
    /// </summary>
    ServerManager.prototype.CheckServerActivity = function () {
        var currentTime = new Date(Date.now());
        for (var _i = 0, _a = this.ServerList; _i < _a.length; _i++) {
            var s = _a[_i];
            s.CheckActivity(currentTime);
        }
    };
    /// <summary>
    /// Searches for a server in the list of servers and hidden servers.
    /// </summary>
    /// <param name="identifier">The identifier of the server to search for.</param>
    /// <returns>The server od NULL if not found.</returns>
    ServerManager.prototype.GetServer = function (identifier) {
        //AcmsMonitor.Log.Debug("this.GetServer(" + identifier + ") BEGIN");
        var server = null;
        for (var _i = 0, _a = this.ServerList; _i < _a.length; _i++) {
            var s = _a[_i];
            if (identifier == s.Id) {
                server = s;
                break;
            }
        }
        if (server == null) {
            for (var _b = 0, _c = this.HiddenServerList; _b < _c.length; _b++) {
                var s = _c[_b];
                if (identifier == s.Id) {
                    server = s;
                    break;
                }
            }
        }
        //if (server != null) AcmsMonitor.Log.Debug("this.GetServer(" + identifier + ") END: server"); else AcmsMonitor.Log.Debug("this.GetServer(" + identifier + ") END: null");
        return server;
    };
    ServerManager.prototype.NotifyServerListChanged = function () {
        this.emit("serverListChanged", this.ServerList);
    };
    ServerManager.prototype.NotifyServerChanged = function (identifier) {
        var server = this.GetServer(identifier);
        if (server) {
            this.emit("serverChanged", server);
        }
    };
    //#region singleton pattern
    ServerManager._instance = new ServerManager();
    return ServerManager;
}(EventEmitter));
export { ServerManager };
//# sourceMappingURL=ServerManager.js.map