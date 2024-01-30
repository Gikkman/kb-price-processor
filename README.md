# Setup
To initiate the repository, clone it and then run:
```
npm install
```

# Run
To run the job, run the command:
```
npm run merx
```

If you wish to run the command from anywhere but the directory where the repository resides, you can use the `--prefix` flag to give node the path to the repository:
```
npm run merx --prefix /path/to/repo
```

# Config
There is a base config present in `config.base.json`. This acts as a base template. Secrets can be added to a 2nd json file called `config.override.json`. If both JSON files are present, they are read on program startup, and any value found in the override JSON has precedence over the base JSON. Otherwise, only the base JSON is used for config. 

The reason for this separation is that the override JSON can be kept out of version control.

## Logging
There are 5 possible log levels: `DEBUG`, `INFO`, `WARN`, `ERROR` and `OFF`. This can be set through `log.level` in config.