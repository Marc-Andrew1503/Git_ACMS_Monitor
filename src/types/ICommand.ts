export interface ICommand
{
    Cmd: CommandType,
    Arg: any
}

export enum CommandType
{
    ForceServerListChangedUdpate,
    ForceServerChangedUpdate,
    ForceMonitorChangedUpdate,
    StopReceiver,
    StartReceiver,
    DriverReset,
    UpforceServer,
    ReleaseServer
}