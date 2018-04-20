# Testing

[![Salesforce Setup](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-1-done._TTH_.png)](./1-salesforce-setup.md)[![Deploy](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-2-done._TTH_.png)](./2-deploy.md)[![Account Linking](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-3-done._TTH_.png)](./3-account-linking.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-4-on._TTH_.png)](./4-testing.md)[![Distribute Private Skills](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-5-off._TTH_.png)](./5-distribute-private-skills.md)

## Part 4: Testing

Now that you completed most of the setup, let's make sure everything is working. You start by validating the account linking flow, then interact with the skill to create a voice code and access Salesforce data.

### Test the Linking Flow

1. Go to your Alexa app on your device (or go to https://alexa.amazon.com).
2. Click **Skills**. 
3. Click **Your Skills**.
4. Find the **Salesforce Transcribe Notes** skill and click it.
5. Click **Enable**.

Your browser or device will then open a window to the Salesforce login screen. 
Enter your Trailhead Playground user credentials, and you should see a page letting you know your skill was successfully linked.

### Use the Skill

1. Try out the following request: **“Alexa, open Salesforce Notes”**.
2. Alexa will welcome you and ask you for an opportunity name.
3. If you're using a Trailhead Playground, you should have an opportunity named United Oil Installations. Try that now: **"Find my opportunity named united oil installations"**.
4. Alexa will find the opportunity and tell you to begin speaking.
5. Try saying a few phrases and make sure Alexa captures each of those notes.
6. You can then say **"Save note"** and it will be saved as a Note attached to your opportunity. Alternatively, say **"Post to chatter"** will post your notes to Chatter for that opportunity.
7. Check that your Salesforce opportunity view also shows the details and that's it!

[![Next](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/button-next._TTH_.png)](./5-distribute-private-skills.md)
