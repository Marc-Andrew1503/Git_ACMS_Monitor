export interface IUpdate
{
    UpdateType: UpdateType,
    UpdateData: any | null
}

export enum UpdateType
{   MonitorLog,
    MonitorPropertyChanged,
    ServerListChanged,
    ServerPropertyChanged,
    ServerChanged,
    NewMessage,
    MessageListReduced
}