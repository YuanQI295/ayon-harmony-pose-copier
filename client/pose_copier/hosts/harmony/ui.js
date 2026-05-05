var mainWindow = null;
var widgets = QApplication.topLevelWidgets();
for (var i = 0 ; i < widgets.length; i++) {
    if (widgets[i] instanceof QMainWindow){
        mainWindow = widgets[i];
    }
}
var menuBar = mainWindow.menuBar();
var actions = menuBar.actions();
for (var i = 0 ; i < actions.length; i++) {
    label = System.getenv('AYON_MENU_LABEL');
    if (actions[i].text == label) {
        var menu = actions[i].menu();
    }
}
var self = this;
/** hostname or ip of server - should be localhost */
var host = '127.0.0.1';
/** port of the server */
var port = parseInt(System.getenv('AYON_HARMONY_PORT'));

// Attach the client to the QApplication to preserve.
var app = QCoreApplication.instance();

if (app.ayonClient == null) {
    app.ayonClient = new Client();
    app.ayonClient.socket.connectToHost(host, port);
}
// path of executed harmony
appPath = about.applicationPath

self.callPoseCopier = function() {
    app.ayonClient.send({
        'module': 'pose_copier',
        'method': 'open_pose_copier',
        'args': [appPath]
    }, false);
};

var action = menu.addAction('Pose Copier');
action.triggered.connect(self.callPoseCopier);
