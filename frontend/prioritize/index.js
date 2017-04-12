const active = requests => requests

const isActive = ( request, userId ) =>
  request.events.some( ({ data }) => data.claimed_by === userId )

module.exports = {
  active,
  isActive
}