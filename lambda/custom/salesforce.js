 /*
  * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
 **/
'use strict';

const constants = require('./constants');
const nforce = require('nforce');
const chatter = require('nforce-chatter')(nforce);

/*
 These are set to NA as they are not used, due to the fact that we are using
 Alexa's account linking process to obtain an acess token, not the default
 nforce createConnection and authenticate methods.
 */
const org = nforce.createConnection({
  clientId: "NA",
  clientSecret: "NA",
  redirectUri: "NA",
  plugins: ['chatter']
});

const sf = {
  getIdentity : function(accessToken, callback) {
    org.getIdentity({oauth: getOauthObject(accessToken)}, callback);
  },
  query : function(query, accessToken, callback) {
    console.log("query: %s", query);
    org.query({oauth: getOauthObject(accessToken), query: query}, callback);
  },
  postToOpportunityChatter: function (id, note, userId, accessToken, callback) {
    console.log("Parameters: " + JSON.stringify({id: id, text: note, oauth: getOauthObject(accessToken)}));
    org.chatter.postFeedItem({id: id, text: note, oauth: getOauthObject(accessToken)}, callback);
  },
  saveOpportunityNote : function(id, note, userId, accessToken, callback) {
    var add_note = nforce.createSObject(constants.SALESFORCE_NOTE_OBJECT);
    add_note.set("ParentId", id);
    add_note.set("OwnerId", userId);
    add_note.set("Title", "Note added from Alexa");
    add_note.set("Body", note);
    org.insert({sobject: add_note, oauth: getOauthObject(accessToken)}, callback);
  }
}

module.exports = sf;

function getOauthObject(accessToken) {
  // Construct our OAuth token based on the access token we were provided from Alexa
  var oauth = {};
  oauth.access_token = accessToken;
  oauth.instance_url = constants.INSTANCE_URL;
  return oauth;
}
