'use strict'

const Expo = require('expo-server-sdk')

console.log(Expo)

let expo = new Expo.Expo({ accessToken: 'sPeYqMFllerYXkJpHLKeUHjY4ZwlCXL_o20b40cc' });

module.exports = function(push_notifications) {
	let messages = []

	for (let notification of push_notifications) {
		// Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

		// Check that all your push tokens appear to be valid Expo push tokens
		//if (!Expo.isExpoPushToken(notification.token)) {
		//  	console.error(`Push token ${notification.token} is not a valid Expo push token`);
		//    continue;
		//}

		  // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
		messages.push({
		    to: notification.token,
		    sound: 'default',
		    body: 'You have a message waiting for you',
		    data: { 
		    	method: 'sync',
		    	url: notification.url,
		    	channel: notification.channel
		    },
		})

		let chunks = expo.chunkPushNotifications(messages);
		let tickets = [];
		(async () => {
		  // Send the chunks to the Expo push notification service. There are
		  // different strategies you could use. A simple one is to send one chunk at a
		  // time, which nicely spreads the load out over time:
		  for (let chunk of chunks) {
		    try {
		      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
		      console.log('ticket ->', ticketChunk);
		      tickets.push(...ticketChunk);
		      // NOTE: If a ticket contains an error code in ticket.details.error, you
		      // must handle it appropriately. The error codes are listed in the Expo
		      // documentation:
		      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
		    } catch (error) {
		      console.error(error);
		    }
		  }
		})();
	}


}