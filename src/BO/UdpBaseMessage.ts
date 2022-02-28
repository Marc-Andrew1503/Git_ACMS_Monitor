
export class UdpBaseMessage
{
 
   

    /// <summary>
    /// Only for debugging
    /// </summary>
    /// <param name="udpStream"></param>
    /*
    private static void PrintToConsole(byte[] udpStream)
    {
                StringBuilder msg = new StringBuilder();
        foreach(byte b in udpStream)
        {
            msg.Append(b.ToString("X2"));
            msg.Append(',');
        }
        Console.WriteLine(msg.ToString());
    }
*/

    public constructor (clientId: number, sourceIPAddress: string)
    {
        this.ClientId = clientId;
        this.SourceIPAddress = sourceIPAddress;
    }

    public readonly ClientId: number;
    public readonly SourceIPAddress: string;
}