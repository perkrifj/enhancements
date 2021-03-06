var debug = require('debug')('kcapp-color-switcher:main');
var led = require("./led_util")(17, 22, 24);

function connectToMatch(data) {
    var match = data.match;
    if (match.venue.id === kcapp.DART_REIDAR_VENUE_ID) {
        var legId = match.current_leg_id;
        debug(`Connected to match ${match.id}`);

        kcapp.connectLegNamespace(legId, (socket) => {
            socket.on('score_update', (data) => {
                var player = socket.currentPlayer.player;
                debug("Setting color for " + player.name + " = " + player.color);
                led.setColor(players[0].player.color);
            });

            socket.on('leg_finished', (data) => {
                var match = data.match;
                if (match.is_finished) {
                    debug("Disabling lights in 5s");
                    setTimeout(() => led.turnOff(), 5000);
                } else {
                    debug("Blinking lights for 4s");
                    led.blink('#00ff00', 4000);
                }
            });

            var player = socket.currentPlayer.player;
            debug("Setting color for " + player.name + " = " + player.color);
            led.setColor(players[0].player.color);
        });
    }
}

var kcapp = require('kcapp-sio-client/kcapp')("localhost", 3000);
kcapp.connect(() => {
    kcapp.on('new_match', (data) => {
        connectToMatch(data);
    });
    kcapp.on('warmup_started', (data) => {
        connectToMatch(data);
    });
});