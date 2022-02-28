export var CommandType;
(function (CommandType) {
    CommandType[CommandType["ForceServerListChangedUdpate"] = 0] = "ForceServerListChangedUdpate";
    CommandType[CommandType["ForceServerChangedUpdate"] = 1] = "ForceServerChangedUpdate";
    CommandType[CommandType["ForceMonitorChangedUpdate"] = 2] = "ForceMonitorChangedUpdate";
    CommandType[CommandType["StopReceiver"] = 3] = "StopReceiver";
    CommandType[CommandType["StartReceiver"] = 4] = "StartReceiver";
    CommandType[CommandType["DriverReset"] = 5] = "DriverReset";
    CommandType[CommandType["UpforceServer"] = 6] = "UpforceServer";
    CommandType[CommandType["ReleaseServer"] = 7] = "ReleaseServer";
})(CommandType || (CommandType = {}));
//# sourceMappingURL=ICommand.js.map