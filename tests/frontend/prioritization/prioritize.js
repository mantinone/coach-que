const moment = require( 'moment' )
const { request, minutesAgo, DEFAULT_COACH_ID, OTHER_ID } = require( '../../fixtures/requests' )
cont testNow = moment()

describe( 'calculatePriority', () => {

  describe( 'Unescalated event created 1m ago' () => {
    it( 'returns priority of 60000', () => {

    })
  })

})

/*
priority: adds a priority to all requests
-- input: all requests, output: all requests, all with priority: integer
calculatePriority:
-- input: request ({ events }), output: integer


priority = now - ( from end of events: event[name=escalate] || event[name=create] ).created_at
*/
