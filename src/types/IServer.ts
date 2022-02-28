
export interface IServer{
    IsDemoActive:boolean;
    StateList: ServerState[];
    AddressList: string[];
    Redundancy: string;
    Version: string;
    Build: number;
    UpTime: string;
    CycleTime: string;
    SystemTime: Date;
    Cpu: number;
    Memory: number;
    Host: string;
    Priority: string;
    IsUpforced: boolean;
    IsActive: boolean;
    IsVersionDifferent: boolean;
    IsBuildDifferent: boolean;
    IsSystemTimeDifferent: boolean;
    Id: number;
    Show: boolean;
}

export enum ServerState
{
    SYNCHRONIZED = 0x00000001,
    CALMDOWN = 0x00000002,
    FORCEDVARIABLES = 0x00000004,
    FORCEDCONDITION = 0x00000008,
    DEMOCONDITION = 0x00000010,
    ERROROBJECT = 0x00000100,
    ERRORDRIVER = 0x00000200,
    BAD_CYCLETIME = 0x00010000,
    WORSE_CYCLETIME = 0x00020000,
    WORST_CYCLETIME = 0x00040000,
    LOST_MYSELF = 0x00080000,
    LOST_ALL_OTHER = 0x00100000
}