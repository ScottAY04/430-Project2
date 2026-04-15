const fs = require('fs');
const rawDATA = fs.readFileSync(`${__dirname}/../countries.json`);
const countryData = JSON.parse(rawDATA);

const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    //if it is a head request or updates nothing it doesn't write a response
    if(request.method !== 'HEAD' && status !== 204){
        response.write(content);
    }
    response.end();
}

const getAllCountry = (request, response, parsedUrl) => {
    parsedUrl;
    const responseJSON = {
        countryData,
    }
    return respondJSON(request, response, 200, responseJSON);
}

const getCountry = (request, response, parsedUrl) => {
    const countryGiven = parsedUrl.searchParams.get('name');
    let responseJSON = {};

    //no parameters
    if(!countryGiven){
        responseJSON = {
            id: 'missingParams',
            message: 'Country is required.'
        }
        return respondJSON(request, response, 400, responseJSON);
    }



    let contentOutput = [];
    let exist = false;
    countryData.filter((country)=>{
        if(country.name.toLowerCase() === countryGiven.toLowerCase()){
            contentOutput.push(country);
            exist = true;
        }
    });

    if(!exist){
        responseJSON.message = 'No such country exists';
        return respondJSON(request, response, 404, responseJSON);
    }

    return respondJSON(request, response, 200, contentOutput);
}

const byContinent = (request, response, parsedUrl) => {
    //loops through every single country
    const regionGiven = parsedUrl.searchParams.get('region');
    let responseJSON = {};

    //missing params
    if(!regionGiven){
        responseJSON = {
            id: 'missingParams',
            message: 'Region is required.'
        }
        return respondJSON(request, response, 400, responseJSON);
    }

    let contentOutput = [];

    //filters out the json
    let exist = false;
    countryData.filter((country)=>{
        if(country.region.toLowerCase() === regionGiven.toLowerCase()){
            exist = true;
            contentOutput.push(country);
        }
    })
    if(!exist){
        responseJSON.message = 'No such region exists';
        return respondJSON(request, response, 404, responseJSON);
    }
    return respondJSON(request, response, 200, contentOutput);
}

const byLetter = (request, response, parsedUrl) => {
    const first = parsedUrl.searchParams.get('first');
    const last = parsedUrl.searchParams.get('last');
    let responseJSON = {};

    //requires inputs
    if(!first && !last){
        responseJSON = {
            id: 'missingParams',
            message: 'At least one field needs to be filled.'
        }
        return respondJSON(request, response, 400, responseJSON);
    }

    let contentOutput = [];

    if(first && !last){
        countryData.filter((country)=>{
            if(country.name.charAt(0).toLowerCase() === first.toLowerCase()){
                contentOutput.push(country.name);
            }
        })
    }else if(!first && last){
         countryData.filter((country)=>{
            if(country.name.charAt(country.name.length-1).toLowerCase() === last.toLowerCase()){
                contentOutput.push(country.name);
            }
        })  
    }else if(first && last){
        //filter the first letters then filter the last letters
        countryData.filter((country)=>{
            if(country.name.charAt(0).toLowerCase() === first.toLowerCase() && 
            country.name.charAt(country.name.length-1).toLowerCase() === last.toLowerCase()){
                contentOutput.push(country.name);
            }
        })
    }

    return respondJSON(request, response, 200, contentOutput);
}

const getCurrency = (request, response, parsedUrl) => {
    const country = parsedUrl.searchParams.get('country');
    let responseJSON = {};

    if(!country){
        responseJSON = {
            id: 'missingParams',
            message: 'Country is required.'
        }
        return respondJSON(request, response, 400, responseJSON);
    }

    let contentOutput = [];
    let exist = false;
    //adds to the output
    countryData.filter((index)=>{
        if(index.name.toLowerCase() === country.toLowerCase()){
            contentOutput.push(index.finance);
            exist = true;
        }
    })

    if(!exist){
        responseJSON.message = 'No such country exists';
        return respondJSON(request, response, 404, responseJSON);
    }
    return respondJSON(request, response, 200, contentOutput);
}

const addFamousLocation = (request, response) => {
    const responseJSON = {
        message: 'Both Country and Location required'
    }

    const { name, newData } = request.body;

    //if no input throw 400 error code
    if(!name || !newData){
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    //updated status
    let responseCode = 204;
    let dupName;

    //if there is a duplicate name updates that country and add a famous location
    countryData.filter((country)=> {
        if(country.name.toLowerCase() === name.toLowerCase()){
            dupName = true;

            country.famousLocation = newData;
        }
    });


    //if there isn't a duplicate name it makes a new country with the location in it
    if(!dupName){
        responseCode = 201;
        countryData[name] = {
            name:name,
            famousLocation: newData,
        }
    }

    if(responseCode === 201){
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSON(request, response, responseCode, {});
}

const rateCountry = (request, response) => {
    const responseJSON = {
        message: 'Both Country and Location required'
    }

    const { name, newData } = request.body;
    console.log(request.body);

    //if no input throw 400 error code
    if(!name || !newData){
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    //updated status
    let responseCode = 204;
    let dupName;

    //if there is a duplicate name updates that country and add a famous location
    countryData.filter((country)=> {
        if(country.name.toLowerCase() === name.toLowerCase()){
         
            country.rating = newData;
        }
    });
    
     //if there isn't a duplicate name it makes a new country with the location in it
    if(!dupName){
        responseCode = 201;
        countryData[name] = {
            name:name,
            rating: newData,
        }
    }

    if(responseCode === 201){
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSON(request, response, responseCode, {});
}

const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    respondJSON(request, response, 404, responseJSON);
};

module.exports = {
    getAllCountry,
    getCountry,
    byContinent,
    byLetter,
    getCurrency,
    addFamousLocation,
    rateCountry,
    notFound
}