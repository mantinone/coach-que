const path = require('path')
const fs = require('fs')

let config

const env = () => {
  return process.env.NODE_ENV || 'development'
}

const isProduction = () => {
  return env() === 'production';
}

const testEnv = () => {
  return process.env.NODE_ENV || 'test'
}

const readEnvFile = () => {
  if( fs.existsSync( '.env' ) ) {
    require( 'dotenv' ).config()
    console.log('process.env', process.env)
  } else {
    console.log( ".env not found, skipping dotenv config..." )
  }
}

const readConfig = () => {
  if(config){
    return config
  } else {
    const _env = env()
    const filepath = path.join(__dirname, `./${_env}.json`)

    try {
      config = JSON.parse(fs.readFileSync(filepath).toString())
      readEnvFile()
      return config
    } catch(e) {
      throw new Error(`Error reading config file : ${filepath}`)
    }
  }
}

module.exports = {env, testEnv, readConfig, isProduction}
