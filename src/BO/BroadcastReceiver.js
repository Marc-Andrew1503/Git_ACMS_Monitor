import { __extends } from "tslib";
import { UdpBroadcastMessage } from "./UdpBroadcastMessage";
import { UdpStateMessage } from "./UdpStateMessage";
import { ServerManager } from "./ServerManager";
import { MessageManager } from "./MessageManager";
import dgram from "dgram";
import { EventEmitter } from "events";
import { UdpMessageFactory } from "./UdpMessageFactory";
export var ReceiverState;
(function (ReceiverState) {
    ReceiverState[ReceiverState["UdpReceiverStartFailed"] = 0] = "UdpReceiverStartFailed";
    ReceiverState[ReceiverState["UdpReceiverRunning"] = 1] = "UdpReceiverRunning";
    ReceiverState[ReceiverState["UdpReceiverStopped"] = 2] = "UdpReceiverStopped";
    ReceiverState[ReceiverState["UdpSocketAlreadyInUse"] = 3] = "UdpSocketAlreadyInUse";
    ReceiverState[ReceiverState["PcapNotLoaded"] = 4] = "PcapNotLoaded";
    ReceiverState[ReceiverState["UnknownException"] = 5] = "UnknownException";
})(ReceiverState || (ReceiverState = {}));
var BroadcastReceiver = /** @class */ (function (_super) {
    __extends(BroadcastReceiver, _super);
    /// <summary>
    /// Main constructor
    /// </summary>
    function BroadcastReceiver() {
        var _this = _super.call(this) || this;
        _this.ReceiverState = ReceiverState.UdpReceiverStopped;
        _this._udpClient = dgram.createSocket("udp4");
        return _this;
    }
    /// <summary>
    /// Starts for each network adapter which supports IP V4 an udp listener.
    /// </summary>
    /// <exception cref="System.IO.FileNotFoundException">Thrown if WinPcap is not found/not installed.</exception>
    BroadcastReceiver.prototype.Start = function (useStandardNetworkAccess) {
        if (this.ReceiverState == ReceiverState.UdpReceiverStopped) {
            if (useStandardNetworkAccess) {
                this.RunUdpListener();
            }
        }
    };
    BroadcastReceiver.prototype.ProcessMessage = function (bytes, sourceIp) {
        var newMessage = UdpMessageFactory.CreateMessage(bytes, sourceIp);
        if (newMessage !== null) {
            //process the different message types
            if (UdpStateMessage.isType(newMessage)) {
                //the state message belongs to a dedicated server object          
                ServerManager.Instance.DistributeMessage(newMessage);
            }
            else if (UdpBroadcastMessage.isType(newMessage)) {
                MessageManager.Instance.AddMesssage(newMessage);
            }
        }
        else {
            //todo
        }
    };
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
    BroadcastReceiver.prototype.Stop = function () {
        if (this.ReceiverState == ReceiverState.UdpReceiverRunning) {
            this.Halt();
        }
    };
    BroadcastReceiver.prototype.NotifyStateChanged = function (aState) {
        this.ReceiverState = aState;
        this.emit("stateChanged", aState);
    };
    /// <summary>
    /// Halts the communication loop.
    /// </summary>
    BroadcastReceiver.prototype.Halt = function () {
        var _this = this;
        this._udpClient.close(function () {
            _this._udpClient = dgram.createSocket("udp4");
            _this.NotifyStateChanged(ReceiverState.UdpReceiverStopped);
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
    };
    /// <summary>
    /// This method contains the main listener loop.
    /// It will be started from the class in its own thread.
    /// </summary>
    BroadcastReceiver.prototype.RunUdpListener = function () {
        var _this = this;
        this._udpClient.on("error", function (err) {
            console.log("udp error:" + err); //tb debug
            if (err.code && (err.code === "EADDRINUSE")) {
                console.log("State.UdpSocketAlreadyInUse"); //tb debug
                _this.NotifyStateChanged(ReceiverState.UdpSocketAlreadyInUse);
            }
            else {
                console.log("State.UnknownError"); //tb debug
                //tb debug this.NotifyErrorOcurred("UDP listener error: unknown error ocurred.");
            }
        });
        this._udpClient.on("message", function (msg, remoteInfo) {
            _this.ProcessMessage(msg, remoteInfo.address);
        });
        this._udpClient.bind(BroadcastReceiver.AcmsBroadcastPort, undefined, function () {
            _this.NotifyStateChanged(ReceiverState.UdpReceiverRunning);
        });
    };
    BroadcastReceiver.AcmsBroadcastPort = 8623;
    return BroadcastReceiver;
}(EventEmitter));
export { BroadcastReceiver };
//# sourceMappingURL=BroadcastReceiver.js.map