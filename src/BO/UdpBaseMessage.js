var UdpBaseMessage = /** @class */ (function () {
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
    function UdpBaseMessage(clientId, sourceIPAddress) {
        this.ClientId = clientId;
        this.SourceIPAddress = sourceIPAddress;
    }
    return UdpBaseMessage;
}());
export { UdpBaseMessage };
//# sourceMappingURL=UdpBaseMessage.js.map