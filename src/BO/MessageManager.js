import { __extends } from "tslib";
import { EventEmitter } from "events";
/// <summary>
/// Manages all common broadcast messages and provides a list with data binding for the UI
/// </summary>
var MessageManager = /** @class */ (function (_super) {
    __extends(MessageManager, _super);
    function MessageManager() {
        var _this = _super.call(this) || this;
        /// <summary>
        /// Stores all broadcast messages
        /// Used also by the UI as data source.
        /// </summary>
        _this.MessageList = [];
        _this._maxEntryCount = 1000;
        return _this;
    }
    Object.defineProperty(MessageManager, "Instance", {
        get: function () {
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    //#region public methods and properties
    MessageManager.prototype.AddMesssage = function (aMessage) {
        this.MessageList.push(aMessage);
        this.emit("newMessage", aMessage);
        //check if maximum logged, remove the 20% oldest logs
        if (this.MessageList.length > this._maxEntryCount) {
            var removeCount = Math.trunc(this._maxEntryCount * 0.2);
            this.MessageList.splice(0, removeCount);
            this.emit("messageListReduced", this.MessageList.length);
        }
    };
    //#region singleton pattern
    MessageManager._instance = new MessageManager();
    return MessageManager;
}(EventEmitter));
export { MessageManager };
//# sourceMappingURL=MessageManager.js.map