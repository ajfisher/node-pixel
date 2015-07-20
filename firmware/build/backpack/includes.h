// Base include for all the main things we need to set up.
#include <stdint.h>

#if defined( __AVR_ATtiny85__ )
    typedef uint8_t receiveint;
#else
    typedef int receiveint;
#endif

#ifndef _DEBUG
    #define _DEBUG true
#endif
