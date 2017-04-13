const moment = require( 'moment' )
const { request, minutesAgo, DEFAULT_COACH_ID, OTHER_ID } = require( '../../fixtures/requests' )
const { visible, isVisible } = require( '../../../frontend/prioritization/visible' )

describe( 'visible', () => {

})

describe( 'isVisible', () => {

})


/*
  Requests:

  item 1 (true): my team requests a session, never claimed
  item 2 (false): other coach team requests a session, under threshold, never claimed
  item 3 (true): other coach team requests a session, past threshold, never claimed
  item 4 (false): other coach team requests a session, past threshold, not escalated, claimed
  item 5 (false): other coach team request, not escalated, claimed
  item 6 (true): other coach team request, escalated, not claimed (most recent)
  item 7 (false): claimed and escalated by me

  visible: my goal && not claimed || other coach past threshold && not claimed || escalations > 0 && most recent event is not claimed
   || escalations > 0 && none of the escalations by me

   escalations > 0 && none of the escalations by me && most recent event is not claimed
  hidden: ! visible
  -- input: all requests, output: all requests, some with hidden: true
  priority: adds a priority to all requests
  -- input: all requests, output: all requests, all with priority: integer
  calculatePriority:
  -- input: request ({ events }), output: integer


  priority = now - ( from end of events: event[name=escalate] || event[name=create] ).created_at

  { age: 32 minutes, escalations: 0, age_since_last_escalation: 32 minutes }
  { age: 51 minutes, escalations: 1, last_escalated_at: 30 minutes, age_since_last_escalation: 21 minutes }
  { age: 51 minutes, escalations: 2, last_escalated_at: 40 minutes, age_since_last_escalation: 11 minutes }

  { age: 51 minutes, escalations: 1 }
  { age: 50 minutes, escalations: 0 }
  { age: 32 minutes, escalations: 0 }
  { age: 31 minutes, escalations: 2 }
  { age: 31 minutes, escalations: 1 }
  { age: 31 minutes, escalations: 0 }
  { age: 30 minutes, escalations: 0 }
  { age: 29 minutes, escalations: 1 }
  { age: 29 minutes, escalations: 0 }
  { age: 0 minutes, escalations: 1 }
  { age: 0 minutes, escalations: 0 }
*/
