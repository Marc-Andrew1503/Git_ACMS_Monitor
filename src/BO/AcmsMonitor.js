import { __extends } from "tslib";
import { BroadcastReceiver, ReceiverState } from "./BroadcastReceiver";
import { ServerManager } from "./ServerManager";
import { EventEmitter } from "events";
function prop(obj, key) {
    return obj[key];
}
var AcmsMonitor = /** @class */ (function (_super) {
    __extends(AcmsMonitor, _super);
    function AcmsMonitor() {
        var _this = _super.call(this) || this;
        //#region public properties
        _this.ExpertPassword = "master";
        _this.ServerTimeout = 2 * 1000; //ms = 2s
        _this.MaxSystemTimeDelta = 1 * 60 * 1000; //ms =1min
        _this.UseStandardNetworkAccess = true;
        //#endregion
        _this._isReceiverRunning = false;
        _this._isHiddenServerListEmpty = true;
        _this._lastError = "";
        _this._udpReceiver = new BroadcastReceiver();
        return _this;
    }
    Object.defineProperty(AcmsMonitor, "Instance", {
        get: function () {
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    /// <summary>
    /// Start the application logic and return the flow of control immediately.
    /// Only requirement is the the <paramref name="UiControl"/> is set properly.
    /// </summary>
    AcmsMonitor.prototype.Run = function () {
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
    };
    AcmsMonitor.prototype.StartReceiver = function (useStandardNetworkAccess) {
        if (!this.IsReceiverRunning) {
            this._udpReceiver.Start(useStandardNetworkAccess);
        }
    };
    AcmsMonitor.prototype.StopReceiver = function () {
        if (this.IsReceiverRunning) {
            this._udpReceiver.Stop();
        }
    };
    AcmsMonitor.prototype.StartServerAliveTimer = function () {
        setInterval(function () {
            ServerManager.Instance.CheckServerActivity();
        }, this.ServerTimeout);
        /*
                    Timer t = new Timer(tServerTimeout.TotalMilliseconds);
                t.Elapsed += ServerAliveTimer;
                t.Start();
                */
    };
    AcmsMonitor.prototype.AddReceiverStateChangeListener = function () {
        var _this = this;
        this._udpReceiver.addListener("stateChanged", function (currentState) {
            console.log("AcmsMonitor.ProcessReceiverNotification: " + currentState);
            switch (currentState) {
                case ReceiverState.UdpReceiverStartFailed:
                    _this.IsReceiverRunning = false;
                    break;
                case ReceiverState.UdpReceiverRunning:
                    _this.IsReceiverRunning = true;
                    break;
                case ReceiverState.UdpReceiverStopped:
                    _this.IsReceiverRunning = false;
                    break;
                case ReceiverState.UdpSocketAlreadyInUse: //with pcap usages this case should not appear
                    _this.IsReceiverRunning = false;
                    _this.LastError = "UDP listener error: socket already in use.";
                    break;
                case ReceiverState.PcapNotLoaded:
                    _this.IsReceiverRunning = false;
                    //dialog.showErrorBox("Network issue appeared.", "Winpcap is not installed. (https://www.winpcap.org/install/)");
                    break;
                case ReceiverState.UnknownException:
                    break;
                default:
                    break;
            }
        });
    };
    AcmsMonitor.prototype.NotifyAllPropertiesChanged = function () {
        this.NotifyPropertyChanged("IsReceiverRunning");
        this.NotifyPropertyChanged("IsHiddenServerListEmpty");
        this.NotifyPropertyChanged("LastError");
    };
    AcmsMonitor.prototype.NotifyPropertyChanged = function (propertyName) {
        var propertyValue = prop(this, propertyName);
        this.emit("propertyChanged", propertyName, propertyValue);
    };
    Object.defineProperty(AcmsMonitor.prototype, "IsReceiverRunning", {
        //#region properties used by the UI
        get: function () {
            return this._isReceiverRunning;
        },
        set: function (value) {
            if (this._isReceiverRunning != value) {
                this._isReceiverRunning = value;
                this.NotifyPropertyChanged("IsReceiverRunning");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AcmsMonitor.prototype, "IsHiddenServerListEmpty", {
        /// <summary>
        /// Used by the UI for enabling buttons.
        /// The value will be set by <see cref="ServerManager"/>
        /// </summary>
        get: function () {
            return this._isHiddenServerListEmpty;
        },
        set: function (value) {
            if (this._isHiddenServerListEmpty != value) {
                this._isHiddenServerListEmpty = value;
                this.NotifyPropertyChanged("IsHiddenServerListEmpty");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AcmsMonitor.prototype, "LastError", {
        get: function () {
            return this._lastError;
        },
        set: function (value) {
            if (this._lastError != value) {
                this._lastError = value;
                this.NotifyPropertyChanged("LastError");
            }
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    //#region singleton pattern
    AcmsMonitor._instance = new AcmsMonitor();
    return AcmsMonitor;
}(EventEmitter));
export { AcmsMonitor };
//# sourceMappingURL=AcmsMonitor.js.map