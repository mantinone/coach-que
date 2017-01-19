const moment = require( 'moment-timezone' )

const waitTimeDurations = waitTimes => {
  return waitTimes.map( time => {
    const start = moment( time.startTime )
    const created_at = moment( time.created_at )

    return start.diff( created_at, 'minutes' )
  })
}

const appointmentWaitTimes = appointments => {
  const waitTimes = []
  appointments.map( appointment => {
    const apptObject = {
      id: appointment.id,
      created_at: appointment.created_at_timestamp,
      startTime: appointment.appointment_start
    }
    waitTimes.push( apptObject )
  })

  return waitTimes
}

const weeklyNumberOfAppointmentsByMentees = appointments => {
  const nameArray = appointments.reduce( ( result, appointment ) => {
    return result.concat( appointment.mentee_handles )
  }, [])

  return nameArray.reduce( ( menteeNames, name ) => {
    if ( name in menteeNames ) {
      menteeNames[ name ] ++
    }
    else {
      menteeNames[ name ] = 1
    }

    return menteeNames
  }, {})
}

const totalAppointmentsByWeek = appointments => appointments.length

const weeklyNumberOfAppointmentsByCoach = appointments => {
  const coachesNameArray = appointments.map( appointment => 
    appointment.coach_handle )

  return coachesNameArray.reduce( ( coachNames, name ) => {
    if ( name in coachNames ) {
      coachNames[ name ] ++
    } else {
      coachNames[ name ] = 1
    }

    return coachNames
  }, {} )
}

const findLongestWaitTime = appointments => {
  const waitTimes = appointmentWaitTimes( appointments )
  const minuteDifferentialArray = waitTimeDurations( waitTimes )
  const longestWaitTime = minuteDifferentialArray
    .reduce( ( element, secondElement ) =>
      ( element > secondElement ? element : secondElement )
    )

  return longestWaitTime
}

const getAverageWaitTime = appointments => {
  const waitTimes = appointmentWaitTimes( appointments )
  const durationsInMinutes = waitTimeDurations( waitTimes )
  const totalMinutes = durationsInMinutes
    .reduce( ( total, time ) => total + time, 0  )
  
  return totalMinutes / durationsInMinutes.length
} 

const amountofMentees = appointments => {
  let count = 0
  const appointmentArr = weeklyNumberOfAppointmentsByMentees( appointments )
  for( let names in appointmentArr ) {
    if( appointmentArr.hasOwnProperty( names ))
      ++count
  }
  
  return count
}

const averageRequestedSessionByMentee = appointments => {
  const totalAppointments = totalAppointmentsByWeek( appointments )
  const totalMentees = amountofMentees( appointments )

  return totalMentees / totalAppointments
}

module.exports = {
  totalAppointmentsByWeek,
  weeklyNumberOfAppointmentsByCoach,
  findLongestWaitTime,
  getAverageWaitTime,
  amountofMentees,
  averageRequestedSessionByMentee
}
