// complete board list along with cpu and package type definition
// any board added here will become a target for compilation however note that
// the names of each board should map to avrgirl or it won't be able to be
// flashed.

module.exports = {
    "uno" :{
        package: "arduino:avr:uno",
    },
    "nano": {
        cpu: "atmega328",
        package: "arduino:avr:nano:cpu=atmega328",
    },
    "pro-mini": {
        cpu: "16MHzatmega328",
        package: "arduino:avr:pro:cpu=16MHzatmega328",
    },
    "mega": {
        package: "arduino:avr:mega:cpu=atmega2560",
    },
    "diecimila": {
        package: "arduino:avr:diecimila:cpu=atmega328",
    },
    "leonardo": {
        package: "arduino:avr:leonardo",
    },
    "micro": {
        package: "arduino:avr:micro",
    },
};
