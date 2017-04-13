const moment = require( 'moment' )
const { CLAIM, ESCALATE } = require( '../../events/requests/constants' )

const THRESHOLD = 30
const THRESHOLD_UNIT = 'minute'

const isMyGoal = ({ goal }, coachId ) =>
  goal.coach_id === coachId

const isUnclaimed = ({ events }) =>
  ! events.some( event => event.name === CLAIM )

const isPastThreshold = ({ created_at }) =>
  moment.duration(
    moment().diff( moment( created_at ))
  ).get( THRESHOLD_UNIT ) > THRESHOLD

const isEscalated = ({ events }) =>
  events.some( event => event.name === ESCALATE )

const lastEventIsNot = ({ events }, eventName ) =>
  events[ events.length - 1 ].name !== eventName

const notEscalatedByMe = ({ events }, coachId ) =>
  ! events.some( event => event.name === ESCALATE && event.data.escalated_by === coachId )

const isMyUnclaimedGoal = ( request, coachId ) =>
  isMyGoal( request, coachId ) && isUnclaimed( request )

const isOldUnclaimedNotMyGoal = () =>
  ( ! isMyGoal( request, coachId ) ) && isPastThreshold( request ) && isUnclaimed( request )

const isClaimableEscalation = () =>
  isEscalated( request ) && notEscalatedByMe( request, coachId ) && lastEventIsNot( request, CLAIM )

const isVisible = ( request, coachId ) =>
  isMyUnclaimedGoal( request, coachId ) ||
  isOldUnclaimedNotMyGoal( request, coachId ) ||
  isClaimableEscalation( request, coachId )

const visible = ( requests, coachId ) =>
  requests.map( request => Object.assign( {}, request, { visible: isVisible( request, coachId ) }))

module.exports = {
  THRESHOLD,
  visible, isVisible,
  isMyGoal, isUnclaimed, isPastThreshold,
  isEscalated, lastEventIsNot, notEscalatedByMe
}
