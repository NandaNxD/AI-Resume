let API_URL='https://welcome-opalina-nodeproxy.koyeb.app'

const environment='prod'

if(environment==='dev'){
    API_URL='http://localhost:3000'
}

export {API_URL}
