 /*
  * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

'use strict';

const AWS = require('aws-sdk');
const Alexa = require('ask-sdk-v1adapter');
const languageStrings = require('./resourceStrings');
const constants = require('./constants');
const sf = require('./salesforce');
const ddb = new AWS.DynamoDB.DocumentClient();
const ddbTable = new AWS.DynamoDB({apiVersion: '2012-10-08'});
const region = process.env.AWS_REGION || 'us-east-1';

exports.handler = function (event, context, callback) {
  AWS.config.update({region: region});
  const alexa = Alexa.handler(event, context, callback);
  alexa.appId = constants.appId;
  alexa.debug = constants.DEBUG;
  alexa.registerHandlers(handlers);
  alexa.resources = languageStrings;

  if (alexa.debug) {
    console.log("\n******************* REQUEST **********************");
    console.log(`\n${JSON.stringify(event, null, 2)}`);
  }

  alexa.execute();
};

var handlers = {
  'LaunchRequest': function () {
    console.log("LaunchRequest Function");
    
    this.attributes[constants.ATTRIBUTES_COUNT] = 0;

    confirmValidUser.call(this);

  },
  'SaveChatterIntent': function() {

    queryDatabase(this.event.session.sessionId, (err, data) => {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
        const currentUserId = this.attributes[constants.ATTRIBUTES_SF_USER_ID];
        const accessToken = this.event.session.user.accessToken;
        const oppId = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID];
        const oppName = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_NAME];
        let cardNote = '';
        let finalText = '';

        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
          finalText += `${item.text}. `;
        });
        console.log(`Final text writing to chatter: ${finalText}`);

        sf.postToOpportunityChatter(oppId, finalText, currentUserId, accessToken, (err, resp) => {
          if (err) {
            // You should probably handle errors better, but for a demo, we are just logging it.
            console.log(err);
          }
          console.log(resp);
          cardNote = `Action: Saved to Chatter\nOpportunity Id: ${oppId}\nOpportunity Name: ${oppName}\nNotes:\n ${finalText}`;
          this.response.cardRenderer(constants.CARD_HEADER, cardNote);
          this.response.speak(this.t("POSTED_MESSAGE"));
          this.emit(':responseReady');
        });
      }
    });
  },
  'SaveNoteIntent': function() {

    queryDatabase(this.event.session.sessionId, (err, data) => {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
        console.log("Query succeeded.");
        const accessToken = this.event.session.user.accessToken;
        const oppId = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID];
        const oppName = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_NAME];
        const currentUserId = this.attributes[constants.ATTRIBUTES_SF_USER_ID];
        let finalText = '';
        let cardNote = '';

        data.Items.forEach(function(item) {
          finalText += `${item.text}. `;
        });
        console.log(`Final text writing to chatter: ${finalText}`);

        sf.saveOpportunityNote(oppId, finalText, currentUserId, accessToken, (err, resp) => {
          if (err) {
            // You should probably handle errors better, but for a demo, we are just logging it.
            console.log(err);
          }
          console.log(resp);
          cardNote = `Action: Saved to Notes\nOpportunity Id: ${oppId}\nOpportunity Name: ${oppName}\nNotes:\n ${finalText}`;
          this.response.cardRenderer(constants.CARD_HEADER, cardNote);
          this.response.speak(this.t("SAVED_NOTE_MESSAGE"));
          this.emit(':responseReady');
        });
      }
    });
  },
  'TranscribeIntent': function () { 
    const oppId = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID];
    const oppName = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_NAME];

    if (typeof oppId === 'undefined') {
      this.response.speak(this.t("NO_OPPORTUNITY")).listen(this.t("NO_OPPORTUNITY"));
      this.emit(':responseReady');
    } else {

      this.attributes[constants.ATTRIBUTES_COUNT] += 1;
      let sentencecnt = this.attributes[constants.ATTRIBUTES_COUNT];

      const query = this.event.request.intent.slots.Query.value;
      let output = query.charAt(0).toUpperCase() + query.substring(1);
      const params = {
        TableName: constants.DDB_TABLE_NAME,
        Item: {
          'sessionid' : this.event.session.sessionId,
          's_order': sentencecnt,
          'text': output
        }
      };
      // To fix in a non-demo environment, add more details to the user when there is an error.
      ddb.put(params, (err, data) => {
        if (err) {
          console.error(`Unable to add item. Error JSON: ${JSON.stringify(err, null, 2)}`);
        } else {
          console.log(`Added item: ${JSON.stringify(data, null, 2)}`);
        }
      });
      
      let tosay = '';
      if (sentencecnt == 1) {
        // First recording, give a special message
        tosay = this.t('FIRST_TRANSCRIPTION');
      } else {
        tosay = "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_electronic_beep_02.mp3'/>";
      }
      output = `Action: Spoken content\nOpportunity Id: ${oppId}\nOpportunity Name: ${oppName}\nNotes:\n ${output}`;  

      this.response.cardRenderer(constants.CARD_HEADER, output);
      this.response.speak(tosay).listen(this.t('STILL_LISTENING'));
      this.emit(':responseReady');
    }
  },
  'PrepareTranscribeIntent': function() {
    console.log(`Attributes: ${JSON.stringify(this.attributes)}`);
    console.log(`Opportunity: ${this.attributes[constants.ATTRIBUTES_OPPORTUNITY_NAME]}`);
    this.response.speak(this.t("FOUND_OPPORTUNITY", this.attributes[constants.ATTRIBUTES_OPPORTUNITY_NAME])).listen(this.t("LIKE_TO_DO"));
    this.emit(':responseReady');
  },
  'SelectOpportunityIntent': function() {
    console.log("SelectOpportunityIntent function");

    const opp_name = this.event.request.intent.slots.OppName.value;
    console.log("opportunity_name: %s", opp_name);
    const accessToken = this.event.session.user.accessToken;

    sf.query(`Select id, Name, StageName, CloseDate, Amount From Opportunity Where Name like '%${opp_name}%' AND isclosed=false LIMIT 1`, accessToken, (err, resp) => {
      console.log("findOpportunity function");
      if (!err) {
        console.log('Opportunity query succeeded! ' + JSON.stringify(resp));
        if (resp.records.length > 0) {
          this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID] = resp.records[0]._fields.id;
          this.attributes[constants.ATTRIBUTES_OPPORTUNITY_NAME] = resp.records[0]._fields.name;
          const opp = resp.records[0]._fields;
          this.response.cardRenderer(constants.CARD_HEADER, `Opportunity found!\nName: ${opp.name}\nCloseDate: ${opp.closedate}\nStage: ${opp.stagename}\nAmount: ${opp.amount}\n`)
          this.emit('PrepareTranscribeIntent');
        } else {
          const output = this.t("OPPORTUNITY_NOT_FOUND") + this.t("PROMPT");
          this.emit(":ask", output, this.t("PROMPT"));
        }
      } else {
        console.log(`Error in opportunity query call: ${JSON.stringify(err)}`);
        this.emit(":tell", this.t("UNKNOWN_SALESFORCE_ERROR"));
      }
    });
  },
  'StopTranscribeIntent': function() {
    queryDatabase(this.event.session.sessionId, (err, data) => {
      if (err) {
        console.error(`Unable to query. Error: ${JSON.stringify(err, null, 2)}`);
      } else {
        const oppId = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID];
        const oppName = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_NAME];
        let finalText = '';
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
          finalText += `${item.text}. `;
        });
        console.log(`Final text being dropped: ${finalText}`);
        let cardNote = `Action: Unsaved Note\nOpportunity Id: ${oppId}\nOpportunity Name: ${oppName}\nNotes:\n ${finalText}`;
        this.response.cardRenderer(constants.CARD_HEADER, cardNote);
        this.response.speak(this.t("STOP_MESSAGE"));
        this.emit(':responseReady');
      }
    });
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t("HELP_MESSAGE");
    const reprompt = this.t("HELP_REPROMPT");

    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak(this.t("STOP_MESSAGE"));
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function () {
    // If we have an opportunity in session, go to our stop transcribe intent instead of general stop handling
    let oppId = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID];
    if (oppId) {
      this.emit(":StopTranscribeIntent");
    }

    this.response.speak(this.t("STOP_MESSAGE"));
    this.emit(':responseReady');
  },
};

var confirmValidUser = function() {
  const accessToken = this.event.session.user.accessToken;
  let speechOutput = '';

  if (typeof accessToken === 'undefined') {
    console.log("DEBUG - in accessToken undefined block");
    speechOutput = this.t("ACCOUNT_REQUIRED_MESSAGE");
    this.emit(":tellWithLinkAccountCard", speechOutput);
    this.emit(":responseReady");
  }

  const salesforceUserId = this.attributes[constants.ATTRIBUTES_SF_USER_ID];

  if (typeof salesforceUserId === 'undefined') {
    sf.getIdentity(accessToken, (err, resp) => {
      console.log("Salesforce getIdentity callback");
      if (!err) {
        // get Salesforce User ID
        const splitString = resp.identity.split('/');
        const userId = splitString[splitString.length - 1]

        this.attributes[constants.ATTRIBUTES_SF_USER_ID] = userId;
        this.response.speak(this.t("WELCOME_MESSAGE")).listen(this.t("LIKE_TO_DO"));
        this.emit(":responseReady");
      } else {
        console.log(`Error in getIdentity call: ${JSON.stringify(err)}`);
        if (err.errorCode == "INVALID_SESSION_ID") {
          console.log("Invalid session ID, prompt to relink");
          speechOutput = this.t("ACCOUNT_RELINK_MESSAGE")
          this.emit(":tellWithLinkAccountCard", speechOutput);
        } else {
          console.log("Other unknown error during getIdentity call")
          speechOutput = this.t("UNKNOWN_SALESFORCE_ERROR");
          this.emit(":tell", speechOutput);
        }
      }
    });
  } else {
    this.response.speak(this.t("WELCOME_MESSAGE")).listen(this.t("LIKE_TO_DO"));
    this.emit(":responseReady");
  }
}

var queryDatabase = function(sessionId, callback) {
  const params = {
    TableName : constants.DDB_TABLE_NAME,
    KeyConditionExpression: "#sessionid = :sessionid",
    ExpressionAttributeNames:{
      "#sessionid": "sessionid"
    },
    ExpressionAttributeValues: {
      ":sessionid": sessionId
    }
  };
    
  ddb.query(params, callback);
}