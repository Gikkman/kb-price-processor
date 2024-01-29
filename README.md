#

# Config
There is a base config present in `config.base.json`. This acts as a base template. Secrets can be added to a 2nd json file called `config.override.json`. If both JSON files are present, they are read on program startup, and any value found in the override JSON has precedence over the base JSON. Otherwise, only the base JSON is used for config. 

The reason for this separation is that the override JSON can be kept out of version control.