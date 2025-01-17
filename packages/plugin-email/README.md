# Pipeline

- Pull batch of recent events from Splunk
- Classify the error (powered by LLM)
- Store it in Agent's memory
- Check pattern meets criteria to ignore, whitelist maintain by man in the middle (powered by LLM)
- Check if same error has been seen today and ignore (via hash)
- Report the error

# Man In the Loop

If reported event is:

- Ignore: save the event on whitelist
- Report: open DSH ticket
- Forget: do not do anything
