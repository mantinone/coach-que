const moment = require( 'moment' )

const { active, isActive } = require( '../../../frontend/prioritize' )

const userId = 'test-user-id'

const TIMES = {
  now: moment().format('YYYY-MM-DD HH:mm:ss.SSSSSS'),
  '15minutesAgo': moment().subtract(15, 'minutes').format('YYYY-MM-DD HH:mm:ss.SSSSSS'),
  '60minutesAgo': moment().subtract(60, 'minutes').format('YYYY-MM-DD HH:mm:ss.SSSSSS')
}

const REQUESTS = [
  {
    events: [
      {"by": "Bob Dole", "question": "0: my team requested, within threshold"}
    ],
    created_at: TIMES['15minutesAgo'],
    escalations: 0,
    goal: {
      coach_id: userId
    }
  },
  {
    events: [
      {"by": "Bob Dole", "question": "1: my team requested, past threshold"}
    ],
    created_at: TIMES['60minutesAgo'],
    escalations: 0,
    goal: {
      coach_id: userId
    }
  },
  {
    events: [
      {"by": "Bob Dole", "question": "2: other team requested, within threshold"}
    ],
    created_at: TIMES['15minutesAgo'],
    escalations: 0,
    goal: {
      coach_id: 'other-user-id'
    }
  },
  {
    events: [
      {"by": "Bob Dole", "question": "3: other team requested, past threshold"}
    ],
    created_at: TIMES['60minutesAgo'],
    escalations: 0,
    goal: {
      coach_id: 'other-user-id'
    }
  },
  {
    events: [
      {"by": "Bob Dole", "question": "4: other coach claimed, past threshold"},
      {"by": "Other Coach", "claimed_by": "other-user-id", "request_id": "6"}
    ],
    created_at: TIMES['60minutesAgo'],
    escalations: 0,
    goal: {
      coach_id: 'other-user-id'
    }
  },
  {
    events: [
      {"by": "Bob Dole", "question": "5: other coach claimed, under threshold"},
      {"by": "Other Coach", "claimed_by": "other-user-id", "request_id": "6"}
    ],
    created_at: TIMES['15minutesAgo'],
    escalations: 0,
    goal: {
      coach_id: 'other-user-id'
    }
  },
  {
    events: [
      {"by": "Bob Dole", "question": "6: other coach escalated, past threshold, not claimed (most recently)"},
      {"by": "Other Coach", "claimed_by": "other-user-id", "request_id": "6"},
      {"by": "Other Coach", "request_id": "6", "escalated_by": "other-user-id"}
    ],
    created_at: TIMES['60minutesAgo'],
    escalations: 1,
    goal: {
      coach_id: 'other-user-id'
    }
  },
  {
    events: [
      {"by": "Bob Dole", "question": "7: other coach escalated, past threshold, not claimed (most recently)"},
      {"by": "Other Coach", "claimed_by": "other-user-id", "request_id": "6"},
      {"by": "Other Coach", "request_id": "6", "escalated_by": "other-user-id"}
    ],
    created_at: TIMES['60minutesAgo'],
    escalations: 1,
    goal: {
      coach_id: 'other-user-id'
    }
  },
  {
    events: [
      {"by": "Bob Dole", "question": "8: claimed and escalated by me"},
      {"by": "Me", "claimed_by": userId, "request_id": "6"},
      {"by": "Me", "request_id": "6", "escalated_by": userId}
    ],
    created_at: TIMES['60minutesAgo'],
    escalations: 1,
    goal: {
      coach_id: userId
    }
  },
  {
    events: [
      {"by": "Bob Dole", "question": "9: escalated and claimed by someone else"},
      {"by": "Other Coach", "claimed_by": 'other-user-id', "request_id": "6"},
      {"by": "Other Coach", "request_id": "6", "escalated_by": 'other-user-id'},
      {"by": "third coach", "claimed_by": 'third-user-id', "request_id": "6"}
    ],
    created_at: TIMES['60minutesAgo'],
    escalations: 1,
    goal: {
      coach_id: userId
    }
  }
]

describe( 'prioritize', () => {

  describe( 'active', () => {
    describe( 'when no requests are active', () => {
      it( 'returns array with no active requests', () => {
        // TODO: define input (array of requests)
        expect( active( input ).filter( request => request.active ).length ).to.equal( 0 )
      })
    })

    describe( 'when a request is active', () => {
      it( 'returns array with one active request', () => {
        // TODO: define input( array of requests )
        expect( active( input ).filter( request => request.active ).length ).to.equal( 1 )
      })
    })
  })

  describe( 'isActive', () => {
    describe( 'when request is claimed by me', () => {

      const request = {
        events: [
          {"by": "Bob Dole", "question": "what"},
          {"by": "Ethan Stark", "claimed_by": "test-user-id", "request_id": "6"}
        ]
      }

      it( 'returns true', () => {
        // TODO: define request
        expect( isActive( request, userId )).to.be.true
      })
    })

    describe( 'when request was escalated by me', () => {
      it( 'returns true', () => {
        // TODO: define request
        expect( isActive( request )).to.be.true
      })
    })

    describe( 'when request is not claimed by me and not escalated by me', () => {
      it( 'returns false', () => {
        // TODO: define request
        expect( isActive( request )).to.be.false
      })
    })
  })

  describe( 'hidden', () => {

  })

  describe( 'isHidden', () => {

  })
})

/*
  Requests:

  item 1 (true): my team requests a session, never claimed
  item 2 (false): other coach team requests a session, under threshold, never claimed
  item 3 (true): other coach team requests a session, past threshold, never claimed
  item 4 (false): other coach team requests a session, past threshold, not escalated, claimed
  item 5 (false): other coach team request, not escalated, claimed
  item 6 (true): other coach team request, escalated, not claimed (most recent)

  visible: my goal && not claimed || past threshold && not claimed || escalations > 0 && most recent event is not claimed
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