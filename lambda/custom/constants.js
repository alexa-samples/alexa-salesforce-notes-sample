 /*
  * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

module.exports = Object.freeze({
    appId : process.env.SKILL_ID ||  '',

    // Salesforce variables
    INSTANCE_URL : process.env.INSTANCE_URL || '',
    
    CARD_HEADER: 'Salesforce Notes',

    // Table created through SAM 
    DDB_TABLE_NAME : 'alexa-skill-transcribe',

    // Constants used for session attributes
    ATTRIBUTES_ACCOUNT: 'account-id',
    ATTRIBUTES_COUNT: 'count',
    ATTRIBUTES_OPPORTUNITY_ID: 'opportunity-id',
    ATTRIBUTES_OPPORTUNITY_NAME: 'opportunity-name',
    ATTRIBUTES_SF_USER_ID : 'salesforceUserId',

    SALESFORCE_NOTE_OBJECT: 'Note',
    // For code debugging
    DEBUG : true

});
