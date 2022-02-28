import { UdpBroadcastMessage } from "./UdpBroadcastMessage";
import { UdpStateMessage } from "./UdpStateMessage";
var MessageTypes;
(function (MessageTypes) {
    MessageTypes[MessageTypes["V3_status_broadcast"] = 212] = "V3_status_broadcast";
    MessageTypes[MessageTypes["V3_broadcastmessage"] = 190] = "V3_broadcastmessage";
})(MessageTypes || (MessageTypes = {}));
var UdpMessageFactory = /** @class */ (function () {
    function UdpMessageFactory() {
    }
    UdpMessageFactory.CreateMessage = function (udpStream, sourceAddress) {
        var createdMessage = null;
        if (udpStream.length >= 3) {
            //decode the client id and create array of strings out of the stream
            var clientId = udpStream[1];
            var messageParts = UdpMessageFactory.SplitStreamIntoStrings(udpStream, 2);
            //message type recognition                
            switch (udpStream[0]) {
                case MessageTypes.V3_broadcastmessage:
                    createdMessage = UdpBroadcastMessage.CreateMessage(messageParts, clientId, sourceAddress);
                    //AcmsMonitor.Log.Debug("Created: UdpBroadcastMessage");
                    break;
                case MessageTypes.V3_status_broadcast:
                    createdMessage = UdpStateMessage.CreateMessage(messageParts, clientId, sourceAddress);
                    //AcmsMonitor.Log.Debug("Created: UdpStateMessage for " + createdMessage.SourceIPAddress.ToString());
                    break;
                default:
                    break;
            }
        }
        return createdMessage;
    };
    UdpMessageFactory.SplitStreamIntoStrings = function (udpStream, offset) {
        var parts = [];
        var delimiter = 0;
        var currentStartIndex = offset;
        for (var i = offset; i < udpStream.length; i++) {
            if (udpStream[i] == delimiter) {
                //let part = Encoding.Default.GetString(udpStream, currentStartIndex, i - currentStartIndex);
                var part = udpStream.slice(currentStartIndex, i);
                parts.push(part.toString("ascii"));
                currentStartIndex = i + 1;
            }
        }
        return parts;
    };
    return UdpMessageFactory;
}());
export { UdpMessageFactory };
//# sourceMappingURL=UdpMessageFactory.js.map