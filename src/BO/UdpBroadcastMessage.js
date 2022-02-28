import { __extends } from "tslib";
import { UdpBaseMessage } from "./UdpBaseMessage";
var UdpBroadcastMessage = /** @class */ (function (_super) {
    __extends(UdpBroadcastMessage, _super);
    function UdpBroadcastMessage(sourceIPAddress, messageText, messageType, timeStamp, messageId) {
        var _this = _super.call(this, 0, sourceIPAddress) || this;
        _this._myClass = UdpBroadcastMessage.name;
        _this._messageId = 0;
        _this._message = "-";
        _this._messageType = "-";
        _this._message = messageText;
        _this._timestamp = timeStamp;
        _this._messageType = messageType;
        _this._messageId = messageId;
        return _this;
    }
    UdpBroadcastMessage.isType = function (obj) {
        return (obj._myClass !== undefined) && (obj._myClass === UdpBroadcastMessage.name);
    };
    UdpBroadcastMessage.CreateMessage = function (messageParts, clientId, sourceIPAddress) {
        var createdMessage = null;
        if (messageParts.length >= 4) {
            try {
                var messageText = messageParts[0];
                var messageId = ++UdpBroadcastMessage.NextId;
                var messageType = messageParts[3];
                //the time stamp of the packet is not used because the incoming time if for logging more interesting then the server time
                //create now the message object
                createdMessage = new UdpBroadcastMessage(sourceIPAddress, messageText, messageType, new Date(Date.now()), messageId);
            }
            catch (exp) {
                //todo
                console.log("CreateBroadcastMessage exception");
                console.log(exp);
                throw exp;
            }
        }
        return createdMessage;
    };
    UdpBroadcastMessage.prototype.toIMessage = function () {
        var interfaceOnlyObject = {
            Message: this.Message,
            Timestamp: this.Timestamp,
            Server: this.Server,
            Level: this.Level,
            Id: this._messageId
        };
        return interfaceOnlyObject;
    };
    Object.defineProperty(UdpBroadcastMessage.prototype, "Timestamp", {
        get: function () {
            var ts = this._timestamp;
            //original return _timestamp.ToString("MM/dd/yyyy HH:mm:ss.fff");
            return ts.getMonth() + "/" + ts.getDate() + "/" + ts.getFullYear() + " " + ts.getHours() + ":" + ts.getMinutes() + ":" + ts.getSeconds() + "." + ts.getMilliseconds();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UdpBroadcastMessage.prototype, "Server", {
        get: function () {
            return this.SourceIPAddress;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UdpBroadcastMessage.prototype, "Level", {
        get: function () {
            return this._messageType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UdpBroadcastMessage.prototype, "Message", {
        get: function () {
            return this._message;
        },
        enumerable: false,
        configurable: true
    });
    UdpBroadcastMessage.NextId = 0;
    return UdpBroadcastMessage;
}(UdpBaseMessage));
export { UdpBroadcastMessage };
//# sourceMappingURL=UdpBroadcastMessage.js.map