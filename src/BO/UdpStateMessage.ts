import { UdpBaseMessage } from "./UdpBaseMessage";

export class UdpStateMessage extends UdpBaseMessage
{
    private _myClass = UdpStateMessage.name;

    public static isType (obj: any): obj is UdpStateMessage
    {
        return (obj._myClass !== undefined) && (obj._myClass === UdpStateMessage.name);
    }

    public static CreateMessage (messageParts: string[], clientId: number, sourceIPAddress: string): UdpStateMessage|null
    {
        let createdMessage: UdpStateMessage|null = null;
        //if(messageParts.Count >= 32)//some server sent snot the full set of messages
        if (messageParts.length >= 28)
        {
            
                let version = messageParts[1];
                let identifier = Number.parseInt(messageParts[2]);
                let redundancyState = Number.parseInt(messageParts[3]);
                let redundancyStateText = messageParts[4];
                let priority1 = Number.parseInt(messageParts[5]);
                let priority2 = Number.parseInt(messageParts[6]);
                let priority3 = Number.parseInt(messageParts[7]);
                let fileSize = Number.parseInt(messageParts[8]);
                let startTime = new Date(Number.parseInt(messageParts[9]));
                let buildNumber = Number.parseInt(messageParts[10]);
                let processId = Number.parseInt(messageParts[11]);
                let fanState =  messageParts[12].toLowerCase() === "true";
                let voltageState = messageParts[13].toLowerCase() === "true";
                let chassisState = messageParts[14].toLowerCase() === "true";
                let upTimeText = messageParts[15];
                let idleTime = Number.parseInt(messageParts[16]);
                let serverProcTime = Number.parseInt(messageParts[17]);
                let procTimePerEvent = Number.parseInt(messageParts[18]);
                let eventHandleCount = Number.parseInt(messageParts[19]);
                let cycleTimeUsed = Number.parseInt(messageParts[20]);
                let cyclePercentUsed = Number.parseInt(messageParts[21]);
                let cycleTimeMax = Number.parseInt(messageParts[22]);
                let cpuUsage = Number.parseFloat(messageParts[23]);
                let memUsage = Number.parseFloat(messageParts[24]);
                let now = new Date(Number.parseInt(messageParts[25])*1000);//unix time is in s not in ms
                let nowMs = Number.parseInt(messageParts[26]);
                let state = Number.parseInt(messageParts[27]);
                //todo add the the rest if needed

                //create now the message object
                createdMessage = new UdpStateMessage(clientId, sourceIPAddress,
                    version,
                    identifier,
                    redundancyState,
                    redundancyStateText,
                    priority1,
                    priority2,
                    priority3,
                    fileSize,
                    startTime,
                    buildNumber,
                    processId,
                    fanState,
                    voltageState,
                    chassisState,
                    upTimeText,
                    idleTime,
                    serverProcTime,
                    procTimePerEvent,
                    eventHandleCount,
                    cycleTimeUsed,
                    cyclePercentUsed,
                    cycleTimeMax,
                    cpuUsage,
                    memUsage,
                    now,
                    nowMs,
                    state);
            
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
        else
        {
           // AcmsMonitor.Log.Warn("Server state message contains less parts then expected. Expected: 28  received: " + messageParts.Count);
        }

        return createdMessage;
    }

    private constructor(clientId:number, 
        sourceIPAddress:string,
        version: string,
        identifier:number,
        redundancyState: number,
        redundancyStateText: string,
        priority1: number,
        priority2: number,
        priority3: number,
        fileSize: number,
        startTime : Date,
        buildNumber: number,
        processId: number,
        fanState:boolean,
        voltageState: boolean,
        chassisState: boolean,
        upTimeText: string,
        idleTime: number,
        serverProcTime: number,
        procTimePerEvent: number,
        eventHandleCount: number,
        cycleTimeUsed: number,
        cyclePercentUsed: number,
        cycleTimeMax: number,
        cpuUsage: number,
        memUsage: number,
        now: Date,
        nowMs: number,
        state: number) 
    {
        super(clientId, sourceIPAddress);
        this.Version = version;
        this.Identifier = identifier;
        this.RedundancyState = redundancyState;
        this.RedundancyStateText = redundancyStateText;
        this.Priority1 = priority1;
        this.Priority2 = priority2;
        this.Priority3 = priority3;
        this.UpTimeText = upTimeText;
        this.IdleTime = idleTime;
        this.CycleTimeUsed = cycleTimeUsed;
        this.CycleTimeMax = cycleTimeMax;
        this.Now = now;
        this.NowMs = nowMs;
        this.BuildNumber = buildNumber;
        this.CpuUsage = cpuUsage;
        this.MemUsage = memUsage;
        this.State = state;
    }

     
    public readonly Version:string;
    public readonly Identifier:number;
    public readonly RedundancyState: number;
    public readonly RedundancyStateText: string;
    public readonly Priority1: number;
    public readonly Priority2: number;
    public readonly Priority3: number;
    public readonly UpTimeText: string;
    public readonly IdleTime: number;
    public readonly CycleTimeUsed: number;
    public readonly CycleTimeMax: number;
    public readonly BuildNumber: number;
    public readonly State: number;
    public readonly Now:Date;
    public readonly NowMs: number;
    public readonly CpuUsage: number;
    public readonly MemUsage: number;
    //todo  add the rest of the members if needed

}