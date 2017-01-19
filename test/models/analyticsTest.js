const { expect, app, chai, chaiDateTime } = require( '../setup' )
const moment = require( 'moment' )
const { week1Appointments } = require( './mock_data/analyticsTestData' )

const {
  totalAppointmentsByWeek,
  weeklyNumberOfAppointmentsByCoach,
  findLongestWaitTime,
  getAverageWaitTime,
  amountofMentees,
  averageRequestedSessionByMentee,
} = require( '../../models/analytics' )

const { createAppointment } = require( '../../io/database/appointments' )


describe( 'Analytics Models: ', () => {
  describe( 'totalAppointmentsByWeek', () => {
    it( 'returns total number of appointments in a specified week', () => {
      const totalAppointmentsResult = 
        totalAppointmentsByWeek( week1Appointments )
      expect( totalAppointmentsResult ).to.be.a( 'number' )
      expect( totalAppointmentsResult ).to.eql( 10 )
    })
  })

  describe( 'weeklyNumberOfAppointmentsByCoach', () => {
    it( 'returns total number of appointments in a week per coach', () => {
      const weeklyNumberOfAppointments = 
        weeklyNumberOfAppointmentsByCoach( week1Appointments )
      expect( weeklyNumberOfAppointments ).to.be.an( 'object' )
      expect( weeklyNumberOfAppointments )
        .to.eql( { coachQ: 5, secondCoach: 4, lazyCoach: 1 } )
    })
  })

  describe( 'findLongestWaitTime', () => {
    it( 'returns longest wait time for appointments', () => {
      const longestWaitTime = findLongestWaitTime( week1Appointments )
      expect( longestWaitTime ).to.be.a( 'number' )
      expect( longestWaitTime ).to.eql( 371 )
    })
  })

  describe( 'getAverageWaitTime', () => {
    it( 'returns average wait time for appointments', () => {
      const averageWaitTime = getAverageWaitTime( week1Appointments )
      expect( averageWaitTime ).to.be.a( 'number' )
      expect( averageWaitTime ).to.eql( 195.5 )
    })
  })

  describe( 'amountofMentees', () => {
    it( 'returns total number of mentees requesting a session', () => {
      const totalMentees = amountofMentees( week1Appointments )
      expect( totalMentees ).to.be.a( 'number' )
      expect( totalMentees ).to.eql( 11 )
    })
  })
  
  describe( 'averageRequestedSessionByMentee', () => {
    it( 'returns average number of sessions from total weekly sessions', () => {
      const averageRequestedSession = 
        averageRequestedSessionByMentee( week1Appointments )
      expect( averageRequestedSession ).to.be.a( 'number' )
      expect( averageRequestedSession ).to.eql( 1.1 )
    })
  })
})
