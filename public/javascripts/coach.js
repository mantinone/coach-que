const socket = io.connect()

const THRESHOLD = 30
const THRESHOLD_UNIT = 'minutes'

const params = (method, body) => ({
  credentials: 'include',
  method,
  body: JSON.stringify( body ),
  headers: new Headers({ 'Content-Type': 'application/json' })
})

const load = () =>
  Promise.all([
    fetch( '/coach/teams', params( 'get' ) ).then( result => result.json() ),
    fetch( '/coach/requests', params( 'get' ) ).then( result => result.json() ),
  ]).then( ([ teams, requests ]) => [ teams, requests, teams[ 0 ].coach_id ] )

const isPastThreshold = created_at =>
  moment().subtract( THRESHOLD, THRESHOLD_UNIT ).isAfter( moment( created_at ))

const byCreatedAt = ( a, b ) =>
  moment( a.created_at ).valueOf() - moment( b.created_at ).valueOf()

const byEscalations = ( a, b ) => b.escalations - a.escalations

const prioritize = ( requests, goals ) => {
  const pastThreshold = requests.filter( request => isPastThreshold( request.created_at ))
    .sort( byCreatedAt )

  const escalated = requests.filter( ({ created_at, escalations }) =>
    ! isPastThreshold( created_at ) && escalations > 0
  )
  .sort( firstBy( byEscalations ).thenBy( 'created_at' ) )

  const removedIds = [
    ...pastThreshold.map( request => request.id ),
    ...escalated.map( request => request.id )
  ]
  const goalIds = goals.map( goal => goal.id )

  const assignedToMe = requests
    .filter( request => ! removedIds.includes( request.id ) )
    .filter( request => goalIds.includes( request.goal.id ))
    .sort( byCreatedAt )

  return [ ...pastThreshold, ...escalated, ...assignedToMe ]
}

const renderGoals = goals => {
  const groupedGoals = goals.reduce( (memo, goal) => {
    if( memo[ goal.title ] === undefined ) {
      memo[ goal.title ] = []
    }

    if( ! memo[ goal.title ].includes( goal.name )) {
      memo[ goal.title ].push( goal.name )
    }

    return memo
  }, {} )

  document.querySelector( '.team-list' ).innerHTML =
    Object.keys( groupedGoals ).map( title => goalTemplate( title, groupedGoals[ title ])).join( '\n' )
}

const render = ( goals, userId ) => {

  renderGoals( goals )

  return requests => {
    removeEvents()

    const activeRequests = requests.filter( ({ events }) =>
      events.some( ({ data }) => data.escalated_by === userId || data.claimed_by === userId )
    ).map( request => Object.assign( {}, request, { escalatable:
      !request.events.some( ({ data }) => data.escalated_by === userId )}
    ))

    const claimableRequests = requests.filter( request =>
      ! request.events.some( ({ data }) => data.claimed_by === userId )
    )

    const decorateClaimable = (request, index) =>
      Object.assign( {}, request, { claimable: index === 0 && activeRequests.length === 0 })

    document.querySelector( '.active-requests' )
      .innerHTML = activeRequests.map( request => activeRequestTemplate( request )).join( '\n' )

    document.querySelector( '.ticket-list' ).innerHTML =
      prioritize( claimableRequests, goals )
        .map( decorateClaimable )
        .map( request => queueTemplate( request )).join( '\n' )

    addEvents()
    ageRequests()
  }
}

const ageRequests = () => {
  const requests = Array.from( document.querySelectorAll( '.panel' ) )

  requests.forEach( request => {
    if( isPastThreshold( request.dataset.createdAt )) {
      request.classList.remove( 'panel-default', 'panel-success' )
      request.classList.add( 'panel-danger' )
    }
  })
}

load()
  .then( ([ goals, requests, userId ]) => {
    const renderRequests = render( goals, userId )

    renderRequests( requests )

    socket.emit( 'join', '/events' )
    socket.emit( 'join', '/goals' )

    socket.on( 'event', data => renderRequests( data.requests ))
    socket.on( 'goal', data => renderGoals( data.goals ))

    setInterval( ageRequests, 60000 )
  })

const buttons = className => {
  const elements = document.querySelectorAll( className )

  if( elements !== null ) {
    return Array.from( elements )
  } else {
    return []
  }
}

const removeEvents = () => {
  buttons( 'button.claim' ).forEach( button =>
    button.removeEventListener( 'click', claimClick )
  )

  buttons( 'button.escalate' ).forEach( button =>
    button.removeEventListener( 'click', escalationClick )
  )
}

const escalationClick = event => {
  event.preventDefault()

  const { request_id } = event.target.dataset

  fetch( '/events', params( 'post', { request_id, name: 'escalate' }))
}

const claimClick = event => {
  event.preventDefault()

  const { request_id } = event.target.dataset

  fetch( '/events', params( 'post', { request_id, name: 'claim' }))
}

const addEvents = () => {
  buttons( 'button.claim' ).forEach( button =>
    button.addEventListener( 'click', claimClick )
  )

  buttons( 'button.escalate' ).forEach( button =>
    button.addEventListener( 'click', escalationClick )
  )
}