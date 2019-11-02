var express = require('express');
var router = express.Router();


router.get("/", (req, res) => {
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === "subscribe" && token === config.verifyToken) {
            // Responds with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

router.post("/", (req, res) => {
    let body = req.body;

    // Checks if this is an event from a page subscription
    if (body.object === "page") {
        // Returns a '200 OK' response to all requests
        res.status(200).send("EVENT_RECEIVED");

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            if ("changes" in entry) {
                // Handle Page Changes event
                let receiveMessage = new Receive();
                if (entry.changes[0].field === "feed") {
                    let change = entry.changes[0].value;
                    switch (change.item) {
                        case "post":
                            return receiveMessage.handlePrivateReply(
                                "post_id",
                                change.post_id
                            );
                            break;
                        case "comment":
                            return receiveMessage.handlePrivateReply(
                                "commentgity _id",
                                change.comment_id
                            );
                            break;
                        default:
                            console.log('Unsupported feed change type.');
                            return;
                    }
                }
            }

            // Gets the body of the webhook event
            let webhookEvent = entry.messaging[0];
            // console.log(webhookEvent);

            // Discard uninteresting events
            if ("read" in webhookEvent) {
                // console.log("Got a read event");
                return;
            }

            if ("delivery" in webhookEvent) {
                // console.log("Got a delivery event");
                return;
            }

            // Get the sender PSID
            let senderPsid = webhookEvent.sender.id;

            if (!(senderPsid in users)) {
                let user = new User(senderPsid);

                GraphAPi.getUserProfile(senderPsid)
                    .then(userProfile => {
                        user.setProfile(userProfile);
                    })
                    .catch(error => {
                        // The profile is unavailable
                        console.log("Profile is unavailable:", error);
                    })
                    .finally(() => {
                        users[senderPsid] = user;
                        i18n.setLocale(user.locale);
                        console.log(
                            "New Profile PSID:",
                            senderPsid,
                            "with locale:",
                            i18n.getLocale()
                        );
                        let receiveMessage = new Receive(users[senderPsid], webhookEvent);
                        return receiveMessage.handleMessage();
                    });
            } else {
                i18n.setLocale(users[senderPsid].locale);
                console.log(
                    "Profile already exists PSID:",
                    senderPsid,
                    "with locale:",
                    i18n.getLocale()
                );
                let receiveMessage = new Receive(users[senderPsid], webhookEvent);
                return receiveMessage.handleMessage();
            }
        });
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

module.exports = router;
