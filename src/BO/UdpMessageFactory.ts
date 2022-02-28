import { UdpBroadcastMessage } from "./UdpBroadcastMessage";
import { UdpStateMessage } from "./UdpStateMessage";
import { UdpBaseMessage } from "./UdpBaseMessage";

enum MessageTypes
{
    V3_status_broadcast = 0xd4,
    V3_broadcastmessage = 0xbe
}

export class UdpMessageFactory{

    public static CreateMessage (udpStream: Buffer, sourceAddress: string): UdpBaseMessage | null
    {
        let createdMessage: UdpBaseMessage | null = null;

        if (udpStream.length >= 3)
        {
            //decode the client id and create array of strings out of the stream
            let clientId = udpStream[1]
            let messageParts = UdpMessageFactory.SplitStreamIntoStrings(udpStream, 2);


            //message type recognition                
            switch (udpStream[0])
            {
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
    }

    private static SplitStreamIntoStrings (udpStream: Buffer, offset: number): string[]
    {
        let parts: string[] = [];

        let delimiter = 0;

        let currentStartIndex = offset;

        for (let i = offset; i < udpStream.length; i++)
        {
            if (udpStream[i] == delimiter)
            {
                //let part = Encoding.Default.GetString(udpStream, currentStartIndex, i - currentStartIndex);
                let part = udpStream.slice(currentStartIndex, i);
                parts.push(part.toString("ascii"));

                currentStartIndex = i + 1;
            }
        }

        return parts;
    }

}