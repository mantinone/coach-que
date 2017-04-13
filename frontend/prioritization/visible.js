const isMyGoal = ({ goal }, coachId ) =>
  goal.coach_id === coachId

const isUnclaimed = ({ events }, coachId ) =>
  ! events.some( event => event.name === 'claim' )

const isPastThreshold = ({ created_at }) =>
  moment.duration(
    moment().diff( moment( created_at ))
  ).get( 'minutes' ) > 30

const isEscalated = ({ events }) =>
  events.some( event => event.name === 'escalate' )

const lastEventIsNot = ({ events }, eventName ) =>
  events[ events.length - 1 ].name !== eventName

const notEscalatedByMe = ({ events }, coachId ) =>
  ! events.some( event => event.name === 'escalate' && event.data.escalatedBy === coachId )

const visible = () => {}

const isVisible = () => {}

module.exports = {
  visible, isVisible,
  isMyGoal, isUnclaimed, isPastThreshold,
  isEscalated, lastEventIsNot, notEscalatedByMe
}