# auloup
A mobile application that helps you monitor your services on AWS ECS.

## Installation

    $ cd auloup-app
    $ yarn
    
## Development

### API
    
    $ cd auloup-api
    $ lein ring server-headless
    
### APP
    
    $ cd auloup-app
    $ npm start
    
## Todo

- [ ] Ability to select the cluster you want to see services from
- [ ] Ability to see Cloudwatch alarms linked to a service
