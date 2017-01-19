const express = require('express')
const router = express.Router()
const rp = require('request-promise')
const config = require('../config/config').readConfig()
const moment = require('moment-timezone')

const {
  totalAppointmentsByWeek,
  weeklyNumberOfAppointmentsByCoach,
  findLongestWaitTime,
  getAverageWaitTime,
  amountofMentees,
  averageRequestedSessionByMentee
} = require('../models/analytics')

const {
  findAllAppointmentsByWeek
} = require('../io/database/appointments')

router.get('/', (request, response) => {
  const week = moment()
  findAllAppointmentsByWeek(week)
    .then( weeklyAppointments => {
      return Promise.all([
        totalAppointmentsByWeek( weeklyAppointments ),
        weeklyNumberOfAppointmentsByCoach( weeklyAppointments ),
        findLongestWaitTime( weeklyAppointments ),
        getAverageWaitTime( weeklyAppointments ),
        amountofMentees( weeklyAppointments ),
        averageRequestedSessionByMentee( weeklyAppointments )
      ]).then( results => {
        const totalAppointments = results[0]
        const coachesNumberOfAppointments = results[1]
        const longestWaitTime = results[2]
        const averageWaitTime = results[3]
        const totalMentees = results[4]
        const averageSessionByMentee = results[5]

        response.json({
          totalAppointments,
          coachesNumberOfAppointments,
          longestWaitTime,
          averageWaitTime,
          totalMentees,
          averageSessionByMentee
        })
      })
    })
})

module.exports = router
