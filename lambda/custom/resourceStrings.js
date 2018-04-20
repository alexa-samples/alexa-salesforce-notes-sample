 /*
  * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */
  
var languageString = {
  "en": {
    "translation": {
      /* General messaging */
      "PROMPT": "How else can I help?",
      "LIKE_TO_DO": "What would you like to do?",
      "STOP_MESSAGE": "Ok, Goodbye!",
      "WELCOME_MESSAGE": "Okay, go ahead and select an opportunity",
      "POSTED_MESSAGE": "Your message has been posted to chatter. Goodbye.",
      "SAVED_NOTE_MESSAGE": "Your notes have been saved to this opportunity. Goodbye.",
      "HELP_MESSAGE": "You can simply say Transcribe. When you're finished, just say I'm finished.",
      "HELP_REPROMPT": "Say something",
      "FIRST_TRANSCRIPTION": "Got it. For your next statements, you'll just hear this sound: <audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_electronic_beep_02.mp3'/> When you're finished, tell me to save to your notes or post to chatter.",
      "STILL_LISTENING": "I'm still listening. Remember, when you're finished, tell me to save it to your notes or post it to chatter. Otherwise, I'll keep recording.",

      /* Account/Voice Code Related messages */
      "ACCOUNT_RELINK_MESSAGE": "You need to relink your Salesforce account in order to use this skill. I've placed more information on a card in your Alexa app. ",
      "ACCOUNT_REQUIRED_MESSAGE": "A Salesforce account is required to use this skill. I've placed more information on a card in your Alexa app. ",
      "ACCOUNT_REQUIRED_CARD": "Relink your account. To relink your account, open the skill within the Alexa app and click re-link account. ",

      /* Salesforce related messages */
      "FOUND_OPPORTUNITY": "I found an opportunity: %s. Begin speaking your notes now.",
      "NO_OPPORTUNITY": "You don't have an opportunity in session yet. Try telling me by saying: find the opportunity named, and then the opportunity name.",
      "OPPORTUNITY_NOT_FOUND": "I didn't find any opportunities with that name. What else can I do?",
      "OPPORTUNITY_SELECTED": "Opportunity %s is selected",

      /* Error messages */
      "UNKNOWN_SALESFORCE_ERROR": "I encountered an error when trying reach Salesforce. Please try again later.",
      "UNKNOWN_ERROR": "I ran into a problem with that request. Please try again later. ",
    }
  }
};

module.exports = languageString;
