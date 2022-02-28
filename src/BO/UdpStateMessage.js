import { __extends } from "tslib";
import { UdpBaseMessage } from "./UdpBaseMessage";
var UdpStateMessage = /** @class */ (function (_super) {
    __extends(UdpStateMessage, _super);
    function UdpStateMessage(clientId, sourceIPAddress, version, identifier, redundancyState, redundancyStateText, priority1, priority2, priority3, fileSize, startTime, buildNumber, processId, fanState, voltageState, chassisState, upTimeText, idleTime, serverProcTime, procTimePerEvent, eventHandleCount, cycleTimeUsed, cyclePercentUsed, cycleTimeMax, cpuUsage, memUsage, now, nowMs, state) {
        var _this = _super.call(this, clientId, sourceIPAddress) || this;
        _this._myClass = UdpStateMessage.name;
        _this.Version = version;
        _this.Identifier = identifier;
        _this.RedundancyState = redundancyState;
        _this.RedundancyStateText = redundancyStateText;
        _this.Priority1 = priority1;
        _this.Priority2 = priority2;
        _this.Priority3 = priority3;
        _this.UpTimeText = upTimeText;
        _this.IdleTime = idleTime;
        _this.CycleTimeUsed = cycleTimeUsed;
        _this.CycleTimeMax = cycleTimeMax;
        _this.Now = now;
        _this.NowMs = nowMs;
        _this.BuildNumber = buildNumber;
        _this.CpuUsage = cpuUsage;
        _this.MemUsage = memUsage;
        _this.State = state;
        return _this;
    }
    UdpStateMessage.isType = function (obj) {
        return (obj._myClass !== undefined) && (obj._myClass === UdpStateMessage.name);
    };
    UdpStateMessage.CreateMessage = function (messageParts, clientId, sourceIPAddress) {
        var createdMessage = null;
        //if(messageParts.Count >= 32)//some server sent snot the full set of messages
        if (messageParts.length >= 28) {
            var version = messageParts[1];
            var identifier = Number.parseInt(messageParts[2]);
            var redundancyState = Number.parseInt(messageParts[3]);
            var redundancyStateText = messageParts[4];
            var priority1 = Number.parseInt(messageParts[5]);
            var priority2 = Number.parseInt(messageParts[6]);
            var priority3 = Number.parseInt(messageParts[7]);
            var fileSize = Number.parseInt(messageParts[8]);
            var startTime = new Date(Number.parseInt(messageParts[9]));
            var buildNumber = Number.parseInt(messageParts[10]);
            var processId = Number.parseInt(messageParts[11]);
            var fanState = messageParts[12].toLowerCase() === "true";
            var voltageState = messageParts[13].toLowerCase() === "true";
            var chassisState = messageParts[14].toLowerCase() === "true";
            var upTimeText = messageParts[15];
            var idleTime = Number.parseInt(messageParts[16]);
            var serverProcTime = Number.parseInt(messageParts[17]);
            var procTimePerEvent = Number.parseInt(messageParts[18]);
            var eventHandleCount = Number.parseInt(messageParts[19]);
            var cycleTimeUsed = Number.parseInt(messageParts[20]);
            var cyclePercentUsed = Number.parseInt(messageParts[21]);
            var cycleTimeMax = Number.parseInt(messageParts[22]);
            var cpuUsage = Number.parseFloat(messageParts[23]);
            var memUsage = Number.parseFloat(messageParts[24]);
            var now = new Date(Number.parseInt(messageParts[25]) * 1000); //unix time is in s not in ms
            var nowMs = Number.parseInt(messageParts[26]);
            var state = Number.parseInt(messageParts[27]);
            //todo add the the rest if needed
            //create now the message object
            createdMessage = new UdpStateMessage(clientId, sourceIPAddress, version, identifier, redundancyState, redundancyStateText, priority1, priority2, priority3, fileSize, startTime, buildNumber, processId, fanState, voltageState, chassisState, upTimeText, idleTime, serverProcTime, procTimePerEvent, eventHandleCount, cycleTimeUsed, cyclePercentUsed, cycleTimeMax, cpuUsage, memUsage, now, nowMs, state);
            /*
            check with
            Number.isSafeInteger(int)
            Number.isNaN(float)
            in constructor and throw exception

            catch (FormatException exp)
            {
                AcmsMonitor.Log.Error("UdpStateMessage.CreateMessage format exeption while parsing numbers: " + exp.Message);
            }
                catch (OverflowException exp)
            {
                AcmsMonitor.Log.Error("UdpStateMessage.CreateMessage overflow exeption while parsing numbers: " + exp.Message);
            }
            */
        }
        else {
            // AcmsMonitor.Log.Warn("Server state message contains less parts then expected. Expected: 28  received: " + messageParts.Count);
        }
        return createdMessage;
    };
    return UdpStateMessage;
}(UdpBaseMessage));
export { UdpStateMessage };
//# sourceMappingURL=UdpStateMessage.js.map