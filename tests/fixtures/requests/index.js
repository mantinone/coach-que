const moment = require( 'moment' )

const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSSSSS'
const DEFAULT_COACH_ID = 'test-user-id'
const OTHER_ID = 'not-the-default-coach-id'

const minutesAgo = minutes =>
  moment().subtract( minutes, 'minutes' ).format( TIMESTAMP_FORMAT )

const request = ({ created_at, escalations, coach_id, events }) => ({
  events: events || [],
  created_at: created_at || moment().format( TIMESTAMP_FORMAT ),
  escalations: escalations || 0,
  goal: { coach_id: coach_id || DEFAULT_COACH_ID }
})

const REQUESTS = [
  {
    created_at: minutesAgo( 15 ),
    events: [{ "by": "Bob Dole", "question": "0: my team requested, within threshold, Visible = true" }]
  },
  {
    created_at: minutesAgo( 60 ),
    events: [{ "by": "Bob Dole", "question": "1: my team requested, past threshold, Visible = true" }]
  },
  {
    created_at: minutesAgo( 15 ),
    events: [{ "by": "Bob Dole", "question": "2: other team requested, within threshold" }],
    coach_id: 'other-user-id'
  },
  {
    created_at: minutesAgo( 60 ),
    coach_id: 'other-user-id',
    events: [{ "by": "Bob Dole", "question": "3: other team requested, past threshold" }],
  },
  {
    created_at: minutesAgo( 60 ),
    coach_id: 'other-user-id',
    events: [
      {"by": "Bob Dole", "question": "4: other coach claimed, past threshold"},
      {"by": "Other Coach", "claimed_by": "other-user-id", "request_id": "6"}
    ]
  },
  {
    created_at: minutesAgo( 15 ),
    coach_id: 'other-user-id',
    events: [
      {"by": "Bob Dole", "question": "5: other coach claimed, under threshold"},
      {"by": "Other Coach", "claimed_by": "other-user-id", "request_id": "6"}
    ]
  },
  {
    created_at: minutesAgo( 60 ),
    escalations: 1,
    coach_id: 'other-user-id',
    events: [
      {"by": "Bob Dole", "question": "6: other coach escalated, past threshold, not claimed (most recently)"},
      {"by": "Other Coach", "claimed_by": "other-user-id", "request_id": "6"},
      {"by": "Other Coach", "request_id": "6", "escalated_by": "other-user-id"}
    ]
  },
  {
    created_at: minutesAgo( 60 ),
    escalations: 1,
    coach_id: 'other-user-id',
    events: [
      {"by": "Bob Dole", "question": "7: other coach escalated, past threshold, not claimed (most recently)"},
      {"by": "Other Coach", "claimed_by": "other-user-id", "request_id": "6"},
      {"by": "Other Coach", "request_id": "6", "escalated_by": "other-user-id"}
    ]
  },
  {
    created_at: minutesAgo( 60 ),
    escalations: 1,
    events: [
      {"by": "Bob Dole", "question": "8: claimed and escalated by me"},
      {"by": "Me", "claimed_by": DEFAULT_COACH_ID, "request_id": "6"},
      {"by": "Me", "request_id": "6", "escalated_by": DEFAULT_COACH_ID}
    ]
  },
  {
    created_at: minutesAgo( 60 ),
    escalations: 1,
    events: [
      {"by": "Bob Dole", "question": "9: escalated and claimed by someone else"},
      {"by": "Other Coach", "claimed_by": 'other-user-id', "request_id": "6"},
      {"by": "Other Coach", "request_id": "6", "escalated_by": 'other-user-id'},
      {"by": "third coach", "claimed_by": 'third-user-id', "request_id": "6"}
    ]
  }
].map( item => request( item ))

module.exports = { REQUESTS, request, minutesAgo, DEFAULT_COACH_ID, OTHER_ID }
