'use strict';
import { __awaiter, __generator } from "tslib";
import { app, protocol, BrowserWindow, Menu } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import { AcmsMonitor } from '@/BO/AcmsMonitor';
import { UiConnector } from './BO/UiConnector';
import { ServerManager } from './BO/ServerManager';
import { MessageManager } from './BO/MessageManager';
var isDevelopment = process.env.NODE_ENV !== 'production';
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
]);
function createWindow() {
    return __awaiter(this, void 0, void 0, function () {
        var win;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    win = new BrowserWindow({
                        width: 800,
                        height: 600,
                        webPreferences: {
                            // Use pluginOptions.nodeIntegration, leave this alone
                            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
                            nodeIntegration: process.env
                                .ELECTRON_NODE_INTEGRATION,
                            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
                        }
                    });
                    Menu.setApplicationMenu(null);
                    UiConnector.Instance.SetIpc(win.webContents);
                    UiConnector.Instance.SetBoComponents(AcmsMonitor.Instance, ServerManager.Instance, MessageManager.Instance);
                    AcmsMonitor.Instance.Run();
                    if (!process.env.WEBPACK_DEV_SERVER_URL) return [3 /*break*/, 2];
                    // Load the url of the dev server if in development mode
                    return [4 /*yield*/, win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)];
                case 1:
                    // Load the url of the dev server if in development mode
                    _a.sent();
                    if (!process.env.IS_TEST)
                        win.webContents.openDevTools();
                    return [3 /*break*/, 3];
                case 2:
                    createProtocol('app');
                    // Load the index.html when not in development
                    win.loadURL('app://./index.html');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(isDevelopment && !process.env.IS_TEST)) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, installExtension(VUEJS3_DEVTOOLS)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error('Vue Devtools failed to install:', e_1.toString());
                return [3 /*break*/, 4];
            case 4:
                createWindow();
                return [2 /*return*/];
        }
    });
}); });
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', function (data) {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    }
    else {
        process.on('SIGTERM', function () {
            app.quit();
        });
    }
}
//# sourceMappingURL=background.js.map