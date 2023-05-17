# Testing

[![Salesforce Setup](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-1-done._TTH_.png)](./1-salesforce-setup.md)[![Deploy](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-2-done._TTH_.png)](./2-deploy.md)[![Account Linking](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-3-done._TTH_.png)](./3-account-linking.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-4-on._TTH_.png)](./4-testing.md)[![Distribute Private Skills](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-5-off._TTH_.png)](./5-distribute-private-skills.md)

## Part 4: Testing

Now that you completed most of the setup, let's make sure everything is working. We'll show you first how to test using the command line, then validate the account linking flow, finally interact with the skill to access Salesforce data.

### Simulate

1. Run the following command to execute a command against your skill:

```
$ ask dialog -l en-US
========================================== Welcome to ASK Dialog 
========================================== In interactive mode, type your utterance text onto the console and hit enter 
========================================== Alexa will then evaluate your input and give a response! 
========================================== Use ".record <fileName>" or ".record <fileName> --append-quit" to save list of utterances to a file. 
========================================== You can exit the interactive mode by entering ".quit" or "ctrl + c". 

User  > Open Salesforce Notes
...
```

2. Check for the output message to also see what Alexa would have said. In this case, the message just indicates you need to link a Salesforce account since the skill requires authentication against Salesforce to get started. 

```
Alexa > You need to link a Salesforce account before you can use this skill. I've sent a card to your Alexa app to help.
```

### Test the Linking Flow

1. Go to your Alexa app on your device (or go to https://alexa.amazon.com).
2. Click **Skills**. 
3. Click **Your Skills**.
4. Click the **Dev Skills** header.
5. Find the **Salesforce Transcribe Notes** skill and click it.
6. Click **Enable**.

Your browser or device will then open a window to the Salesforce login screen. 
Enter your Trailhead Playground user credentials, and you should see a page letting you know your skill was successfully linked.

### Use the Skill

Now it's time to use the skill out on an Alexa-enabled device.

1. Try out the following request: **“Alexa, open Salesforce Notes”**.
2. Alexa will welcome you and ask you for an opportunity name.
3. If you're using a Trailhead Playground, you should have an opportunity named United Oil Installations. Try that now: **"Find my opportunity named united oil installations"**.
4. Alexa will find the opportunity and tell you to begin speaking.
5. Try saying a few phrases and make sure Alexa captures each of those notes.
6. You can then say **"Save to notes"** and it will be saved as a Note attached to your opportunity. Alternatively, say **"Post to chatter"** will post your notes to Chatter for that opportunity.
7. Check that your Salesforce opportunity view also shows the details and that's it!

[![Next](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/button-next._TTH_.png)](./5-distribute-private-skills.md)
