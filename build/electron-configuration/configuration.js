const size = {
    defaultWidth: 1366,
    defaultHeight: 768,
    resizeWidthFactor: 0.5,
    resizeHeightFactor: 0.75,
};
const config = {
    mainWindow: {
        width: size.defaultWidth,
        height: size.defaultHeight,
        center: true,
        useContentSize: true,
        minWidth: Math.floor(size.defaultWidth * size.resizeWidthFactor),
        minHeight: Math.floor(size.defaultHeight * size.resizeHeightFactor),
        title: 'BitHide Business',
    },
    provider: 'generic',
    updaterCacheDirName: 'bithide-business-updater',
    storageNames: {
        lang: 'lang',
        domain: 'domain_server',
    },
    updatesPath: 'Updates/UI/',
    updatesLocalPath: '../../',
    updatesFileName: 'app-update.yml',
};

module.exports = {
    config,
};
