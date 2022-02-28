import { __extends } from "tslib";
import { ServerState } from "@/types/IServer";
import { AcmsMonitor } from "./AcmsMonitor";
import os from "os";
import dgram from "dgram";
import { EventEmitter } from "events";
import { BroadcastReceiver } from "./BroadcastReceiver";
function prop(obj, key) {
    return obj[key];
}
var Server = /** @class */ (function (_super) {
    __extends(Server, _super);
    //#endregion get/set
    function Server(identifier) {
        var _this = _super.call(this) || this;
        _this._stateList = [];
        _this._addressList = [];
        _this._systemTime = new Date();
        _this._redundancy = Server._defaultString;
        _this._version = Server._defaultString;
        _this._upTime = Server._defaultString;
        _this._cycleTime = Server._defaultString;
        _this._host = Server._defaultString;
        _this._priority = Server._defaultString;
        _this._build = Server._defaultNumber;
        _this._cpu = Server._defaultNumber;
        _this._memory = Server._defaultNumber;
        _this._id = Server._defaultNumber;
        _this._isUpforced = false;
        _this._isActive = false;
        _this._isVersionDifferent = false;
        _this._isBuildDifferent = false;
        _this._isSystemTimeDifferent = false;
        _this._isDemoActive = false;
        _this._messageTimeStamp = new Date();
        _this._id = identifier;
        return _this;
    }
    Server.prototype.toIServer = function () {
        var interfaceOnlyObject = {
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
    };
    /// <summary>
    /// Convenience access to the first ip address.
    /// </summary>
    /// <returns>The first ip address or empty string if no address is defined</returns>
    Server.prototype.GetFirstAddress = function () {
        var address = "";
        if (this._addressList.length > 0) {
            address = this._addressList[0];
        }
        return address;
    };
    Server.prototype.NotifyPropertyChanged = function (propertyName) {
        var propertyValue = prop(this, propertyName);
        this.emit("propertyChanged", this, propertyName, propertyValue);
    };
    Object.defineProperty(Server.prototype, "AddressList", {
        //#region get/set
        get: function () {
            return this._addressList;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "StateList", {
        get: function () {
            return this._stateList;
        },
        set: function (v) {
            var arrayIsUnequal = false;
            if (this._stateList.length !== v.length) {
                arrayIsUnequal = true;
            }
            else {
                for (var _i = 0, v_1 = v; _i < v_1.length; _i++) {
                    var state = v_1[_i];
                    if (this._stateList.indexOf(state) < 0) {
                        arrayIsUnequal = true;
                        break;
                    }
                }
            }
            if (arrayIsUnequal) {
                this._stateList = v;
                this.NotifyPropertyChanged("StateList");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "IsUpforced", {
        get: function () {
            return this._isUpforced;
        },
        set: function (v) {
            if (this._isUpforced !== v) {
                this._isUpforced = v;
                this.NotifyPropertyChanged("IsUpforced");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "SystemTime", {
        get: function () {
            return this._systemTime;
        },
        set: function (v) {
            if (this._systemTime !== v) {
                this._systemTime = v;
                this.NotifyPropertyChanged("SystemTime");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "Build", {
        get: function () {
            return this._build;
        },
        set: function (v) {
            if (this._build !== v) {
                this._build = v;
                this.NotifyPropertyChanged("Build");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "Cpu", {
        get: function () {
            return this._cpu;
        },
        set: function (v) {
            if (this._cpu !== v) {
                this._cpu = v;
                this.NotifyPropertyChanged("Cpu");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "Memory", {
        get: function () {
            return this._memory;
        },
        set: function (v) {
            if (this._memory !== v) {
                this._memory = v;
                this.NotifyPropertyChanged("Memory");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "Id", {
        get: function () {
            return this._id;
        },
        set: function (v) {
            if (this._id !== v) {
                this._id = v;
                this.NotifyPropertyChanged("Id");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "Redundancy", {
        get: function () {
            return this._redundancy;
        },
        set: function (v) {
            if (this._redundancy !== v) {
                this._redundancy = v;
                this.NotifyPropertyChanged("Redundancy");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "Version", {
        get: function () {
            return this._version;
        },
        set: function (v) {
            if (this._version !== v) {
                this._version = v;
                this.NotifyPropertyChanged("Version");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "UpTime", {
        get: function () {
            return this._upTime;
        },
        set: function (v) {
            if (this._upTime !== v) {
                this._upTime = v;
                this.NotifyPropertyChanged("UpTime");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "CycleTime", {
        get: function () {
            return this._cycleTime;
        },
        set: function (v) {
            if (this._cycleTime !== v) {
                this._cycleTime = v;
                this.NotifyPropertyChanged("CycleTime");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "Host", {
        get: function () {
            return this._host;
        },
        set: function (v) {
            if (this._host !== v) {
                this._host = v;
                this.NotifyPropertyChanged("Host");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "Priority", {
        get: function () {
            return this._priority;
        },
        set: function (v) {
            if (this._priority !== v) {
                this._priority = v;
                this.NotifyPropertyChanged("Priority");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "IsActive", {
        get: function () {
            return this._isActive;
        },
        set: function (v) {
            if (this._isActive !== v) {
                this._isActive = v;
                this.NotifyPropertyChanged("IsActive");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "IsVersionDifferent", {
        get: function () {
            return this._isVersionDifferent;
        },
        set: function (v) {
            if (this._isVersionDifferent !== v) {
                this._isVersionDifferent = v;
                this.NotifyPropertyChanged("IsVersionDifferent");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "IsBuildDifferent", {
        get: function () {
            return this._isBuildDifferent;
        },
        set: function (v) {
            if (this._isBuildDifferent !== v) {
                this._isBuildDifferent = v;
                this.NotifyPropertyChanged("IsBuildDifferent");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "IsSystemTimeDifferent", {
        get: function () {
            return this._isSystemTimeDifferent;
        },
        set: function (v) {
            if (this._isSystemTimeDifferent !== v) {
                this._isSystemTimeDifferent = v;
                this.NotifyPropertyChanged("IsSystemTimeDifferent");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "IsDemoActive", {
        get: function () {
            return this._isDemoActive;
        },
        set: function (v) {
            if (this._isDemoActive !== v) {
                this._isDemoActive = v;
                this.NotifyPropertyChanged("IsDemoActive");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "Show", {
        get: function () {
            return true;
        },
        set: function (v) {
        },
        enumerable: false,
        configurable: true
    });
    Server.GetOwnHostName = function () {
        if (Server.OwnHostName == null) {
            Server.OwnHostName = os.hostname();
        }
        return Server.OwnHostName;
    };
    Server.prototype.UpdateState = function (aMessage) {
        this._messageTimeStamp = new Date(Date.now());
        this.IsActive = true;
        this.Version = aMessage.Version;
        this.Redundancy = aMessage.RedundancyStateText;
        this.UpTime = aMessage.UpTimeText;
        this.Build = aMessage.BuildNumber;
        this.SystemTime = aMessage.Now;
        this.Cpu = aMessage.CpuUsage;
        this.Memory = aMessage.MemUsage;
        this.CycleTime = aMessage.CycleTimeMax + ":" + aMessage.CycleTimeUsed; //create the cycle time text
        this.Priority = aMessage.Priority1 + ":" + aMessage.Priority2 + ":" + aMessage.Priority3;
        this.SetAddress(aMessage.SourceIPAddress);
        //create the current list of states        
        var newStateList = [];
        if (aMessage.State == ServerState.SYNCHRONIZED) {
            //synchronized is set most of the time but it should be only active if no other bits are set
            newStateList.push(ServerState.SYNCHRONIZED);
        }
        else {
            //added from highest numbers to the lowest to keep the errors(highest number) on top of the list
            if ((aMessage.State & ServerState.LOST_ALL_OTHER) > 0)
                newStateList.push(ServerState.LOST_ALL_OTHER);
            if ((aMessage.State & ServerState.LOST_MYSELF) > 0)
                newStateList.push(ServerState.LOST_MYSELF);
            if ((aMessage.State & ServerState.WORST_CYCLETIME) > 0)
                newStateList.push(ServerState.WORST_CYCLETIME);
            if ((aMessage.State & ServerState.WORSE_CYCLETIME) > 0)
                newStateList.push(ServerState.WORSE_CYCLETIME);
            if ((aMessage.State & ServerState.BAD_CYCLETIME) > 0)
                newStateList.push(ServerState.BAD_CYCLETIME);
            if ((aMessage.State & ServerState.ERRORDRIVER) > 0)
                newStateList.push(ServerState.ERRORDRIVER);
            if ((aMessage.State & ServerState.ERROROBJECT) > 0)
                newStateList.push(ServerState.ERROROBJECT);
            if ((aMessage.State & ServerState.FORCEDCONDITION) > 0)
                newStateList.push(ServerState.FORCEDCONDITION);
            if ((aMessage.State & ServerState.FORCEDVARIABLES) > 0)
                newStateList.push(ServerState.FORCEDVARIABLES);
            if ((aMessage.State & ServerState.CALMDOWN) > 0)
                newStateList.push(ServerState.CALMDOWN);
        }
        this.StateList = newStateList;
        //the demo mode state will be stored extra
        if ((aMessage.State & ServerState.DEMOCONDITION) > 0)
            this.IsDemoActive = true;
        //detect and the upforced master state
        if (aMessage.RedundancyStateText.startsWith("UPFORCED")) {
            this.IsUpforced = true;
        }
        else {
            this.IsUpforced = false;
        }
    };
    /// <summary>
    /// Used to set the address of the server.
    /// The server supports multiple addresses.
    /// Also the DNS name for the ip address will be retrieved here asynchronous.
    /// A already known address will not be added anymore and will have no effect.
    /// </summary>
    /// <param name="aAddress">The address to add to the list of addresses</param>
    Server.prototype.SetAddress = function (aAddress) {
        //AcmsMonitor.Log.Debug("Server.SetAddress(" + aAddress + ") BEGIN");
        var isAddressAvailable = false;
        //first check if address is already present
        for (var _i = 0, _a = this._addressList; _i < _a.length; _i++) {
            var address = _a[_i];
            if (address == aAddress) {
                isAddressAvailable = true;
                break;
            }
        }
        //if not present add address to list and look for the host name
        if (!isAddressAvailable) {
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
    };
    /// <summary>
    /// Sends the driver reset command to the ACMS server
    /// </summary>
    Server.prototype.SendDriverResetCommand = function () {
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
    };
    /// <summary>
    /// Sends the upforce command to the ACMS server
    /// </summary>
    Server.prototype.SendUpforceCommand = function () {
        this.SendUdpPacket(Buffer.from([0x12, 0x00]));
    };
    /// <summary>
    /// Sends the release command to the ACMS server to stop 'upforce'
    /// </summary>
    Server.prototype.SendReleaseCommand = function () {
        this.SendUdpPacket(Buffer.from([0x13, 0x00]));
    };
    /// <summary>
    /// Sends the passed data to the server first IP address if available
    /// </summary>
    /// <param name="dataToSend">BYtes to send.</param>
    Server.prototype.SendUdpPacket = function (dataToSend) {
        if (this.AddressList.length > 0) {
            console.log("data sending"); //tb debug
            var client_1 = dgram.createSocket('udp4');
            client_1.send(dataToSend, BroadcastReceiver.AcmsBroadcastPort, this.GetFirstAddress(), function (err, bytes) {
                if (err) {
                    //todo
                    //log error
                    console.log("SendUdpPacket error ocurred: " + err); //tb debug
                }
                client_1.close();
            });
        }
    };
    /// <summary>
    /// Checks the activity of the server.
    /// This is done by testing the time difference of passed current time an the timestamp of the last received message
    /// </summary>
    /// <param name="currentTime"></param>
    Server.prototype.CheckActivity = function (currentTime) {
        if ((this._messageTimeStamp.valueOf() + AcmsMonitor.Instance.ServerTimeout) < currentTime.valueOf()) {
            this.IsActive = false;
        }
    };
    /// <summary>
    /// A textual representation for the server.
    /// if the host name is available it is used, otherwise the first ip address.
    /// </summary>
    /// <returns>The host name of the server</returns>
    Server.prototype.ToString = function () {
        var serverAsText = Server._defaultString;
        if (this.Host !== Server._defaultString) {
            if (this.Host !== Server._defaultString)
                serverAsText = this.Host;
        }
        else {
            if (this.AddressList.length > 0) {
                serverAsText = this.AddressList[0];
            }
        }
        return serverAsText;
    };
    /// <summary>
    /// Send the get redundancy info package to a specific server
    /// </summary>
    Server.SendGetInfoCommand = function () {
        var dataToSend = Buffer.from([0x0e, 0x00]);
        //todo
        /*
            IPEndPoint target = new IPEndPoint(IPAddress.Parse("192.168.193.161"), BroadcastReceiver.AcmsBroadcastPort);
            UdpClient client = new UdpClient();

        client.SendAsync(dataToSend, dataToSend.Length, target);
        */
    };
    Server.OwnHostName = null;
    Server._defaultString = "-";
    Server._defaultNumber = 0;
    return Server;
}(EventEmitter));
export { Server };
//# sourceMappingURL=Server.js.map