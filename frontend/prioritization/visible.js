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
  ! events.some( event => event.name === ESCALATE && event.data.escalatedBy === coachId )

const visible = () => {   }

const isVisible = ( request, coachId ) =>
  ( isMyGoal( request, coachId ) && isUnclaimed( request ) ) ||
  ( ! isMyGoal( request, coachId ) && isPastThreshold( request ) && isUnclaimed( request )) ||
  ( isEscalated( request ) && notEscalatedByMe( request, coachId ) && lastEventIsNot( request, CLAIM ))

module.exports = {
  visible, isVisible,
  isMyGoal, isUnclaimed, isPastThreshold,
  isEscalated, lastEventIsNot, notEscalatedByMe
}
