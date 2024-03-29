const debug = require('debug')('coach-queue:dispatch:escalate');
const io = require( '../socketio/' )
const db = require( '../../database/' )
const { ESCALATE } = require( './constants' )
const { Request, Event } = db

const escalate = ({ learner_id, request_id }) => {
  const data = { request_id, escalated_by: learner_id }

  debug( data )

  return Event.create( request_id, data, ESCALATE )
}

module.exports = escalate
