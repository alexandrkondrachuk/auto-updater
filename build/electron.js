const path = require('path');

const { app, BrowserWindow, shell, dialog } = require('electron');
const isDev = require('electron-is-dev');
// Auto updater
const fs = require('fs');
const { localStorage } = require('electron-browser-storage');
const { t } = require('./electron-configuration/messages');
const { config } = require('./electron-configuration/configuration');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const getLang = async () => localStorage.getItem(config.storageNames.lang);

const isEnableDevTools = true;

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        ...config.mainWindow,
        webPreferences: {
            devTools: isEnableDevTools,
            nodeIntegration: true,
        }
    });

    win.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        shell.openExternal(url)
    });

    if (!isEnableDevTools) {
        win.removeMenu();
    }

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    // Open the DevTools.
    if (isEnableDevTools) {
        win.webContents.openDevTools({ mode: 'detach' });
    }

    // Check up for updates

    const generateUpdateConfig = async () => {
        return true;
        let status = true;
        const domainURL = await localStorage.getItem(config.storageNames.domain);
        if(!domainURL) {
            status = false;
            return status;
        }
        const updatesPath = `${domainURL}${config.updatesPath}`;
        const content = `provider: ${config.provider}
url: ${updatesPath}
updaterCacheDirName: ${config.updaterCacheDirName}`;
        log.info('domain: ', domainURL);
        log.info('updates path: ', updatesPath);
        log.info('update content: ', content);
        localStorage.setItem(`log-update-domain-${Date.now()}`, domainURL);
        localStorage.setItem(`log-update-path-${Date.now()}`, updatesPath);
        try {
            fs.writeFileSync(path.join(__dirname, config.updatesLocalPath, config.updatesFileName), content);
            log.info(`${config.updatesFileName} updated`);
            localStorage.setItem(`log-update-status-${Date.now()}`, `${config.updatesFileName} updated`);
        } catch (err) {
            log.error(err);
            localStorage.setItem(`log-update-error-${Date.now()}`, err);
            status = false;
        }
        return status;
    };


    if (app.isPackaged) {
        generateUpdateConfig().then((status) => {
            if (status) {
                autoUpdater.logger = log;
                autoUpdater.checkForUpdates();
                localStorage.setItem(`log-update-log-${Date.now()}`, log);
            }
        }).catch((e) => log.error(e));
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Auto updater events

/*
autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
    const showTranslatedDialog = (lang) => {
        const dialogOpts = {
            type: 'info',
            buttons: [t('Ok', lang), t('Later', lang)],
            title: t('Update is available', lang),
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: t('Now application will start updating and restart.', lang),
        };
        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        });
    };
    getLang().then((lang) => {
        showTranslatedDialog(lang);
    }).catch(() => {
        log.error('Unable get language');
        showTranslatedDialog();
    });
});
*/

autoUpdater.on('update-downloaded', updateInfo => {
    setTimeout(() => {
        autoUpdater.quitAndInstall();
        app.exit();
    }, 10000);
});

autoUpdater.on('error', (message) => {
    log.error(t('There was a problem updating the application'));
    log.error(message);
});
