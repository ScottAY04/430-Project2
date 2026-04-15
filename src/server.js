const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponse.js');
const jsonHandler = require('./jsonResponse.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/allCountry': jsonHandler.getAllCountry,
    '/getCountry': jsonHandler.getCountry,
    '/getCountryByContinent': jsonHandler.byContinent,
    '/getCountryByLetter': jsonHandler.byLetter,
    '/getCurrency': jsonHandler.getCurrency,
    '/addFamousLocation': (request, response)=> parseBody(request, response, jsonHandler.addFamousLocation),
    '/rateCountry': (request, response)=> parseBody(request, response, jsonHandler.rateCountry),
    notFound: jsonHandler.notFound,
}

const parseBody = (request, response, handler) => {
    const answer = [];

    request.on('error', (err)=>{
        console.dir(err);
        response.statusCode = 400;
        response.end();
    })

    request.on('data', (chunk)=>{
        answer.push(chunk);
    })

    request.on('end', ()=>{
    const bodyString = Buffer.concat(answer).toString();
    const type = request.headers['content-type'];
    if(type === 'application/x-www-form-urlencoded') {
      request.body = query.parse(bodyString);
    } else if (type === 'application/json') {
      request.body = JSON.parse(bodyString);
    } else {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ error: 'invalid data format' }));
      return response.end();
    }

    handler(request, response);
    })
}

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    if(urlStruct[parsedUrl.pathname]){
        return urlStruct[parsedUrl.pathname](request, response, parsedUrl);
    }
    return urlStruct.notFound(request, response);
};

http.createServer(onRequest).listen(port, ()=>{
    console.log(`Listening on 127.0.0.1:${port}`);
})