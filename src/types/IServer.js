export var ServerState;
(function (ServerState) {
    ServerState[ServerState["SYNCHRONIZED"] = 1] = "SYNCHRONIZED";
    ServerState[ServerState["CALMDOWN"] = 2] = "CALMDOWN";
    ServerState[ServerState["FORCEDVARIABLES"] = 4] = "FORCEDVARIABLES";
    ServerState[ServerState["FORCEDCONDITION"] = 8] = "FORCEDCONDITION";
    ServerState[ServerState["DEMOCONDITION"] = 16] = "DEMOCONDITION";
    ServerState[ServerState["ERROROBJECT"] = 256] = "ERROROBJECT";
    ServerState[ServerState["ERRORDRIVER"] = 512] = "ERRORDRIVER";
    ServerState[ServerState["BAD_CYCLETIME"] = 65536] = "BAD_CYCLETIME";
    ServerState[ServerState["WORSE_CYCLETIME"] = 131072] = "WORSE_CYCLETIME";
    ServerState[ServerState["WORST_CYCLETIME"] = 262144] = "WORST_CYCLETIME";
    ServerState[ServerState["LOST_MYSELF"] = 524288] = "LOST_MYSELF";
    ServerState[ServerState["LOST_ALL_OTHER"] = 1048576] = "LOST_ALL_OTHER";
})(ServerState || (ServerState = {}));
//# sourceMappingURL=IServer.js.map