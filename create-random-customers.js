const axios = require('axios');

const config = require('./config.json');

const firstNames = require('./data/first-names.json');
const lastNames = require('./data/last-names.json');
const nouns = require('./data/nouns.json');
const postcodeData = require('./data/postcodes-and-cities.json');

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

const generateRandomName = () => {
    const first = firstNames[Math.floor(Math.random() * firstNames.length )];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return {first, last, full: `${first} ${last}`};
};

const generateEmailAddress = (name) => {
    const randomNumber = Math.floor(Math.random() * 9999);
    const useLastName = Math.floor(Math.random() * 2) === 1;
    
    let emailStr = name.first;

    if (useLastName) emailStr += `.${name.last}`;
    if (randomNumber > 1) emailStr += randomNumber;

    emailStr += "@tyronejroberts.co.uk";
 
    return emailStr.toLowerCase();
};

const generatePhoneNumber = () => {
    return '+447' + Math.floor(100000000 + Math.random() * 900000000);
};

const generatRandomAddress = () => {
    const number = Math.floor(Math.random() * (998) + 2);
    const streetSuffix = ['Street', 'Road', 'Place', 'Drive', 'Grove', 'Way', 'Close', 'Mews'];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length )];
    const randomSuffix = streetSuffix[Math.floor(Math.random() * streetSuffix.length )];
    const address1 = `${number} ${randomNoun} ${randomSuffix}`;

    const { uk_region, postcode, town } = postcodeData[Math.floor(Math.random() * postcodeData.length )]

    const postcodePrefix = Math.floor(Math.random() * (9) + 1) + alpha[Math.floor(Math.random() * alpha.length )] + alpha[Math.floor(Math.random() * alpha.length )];

    return {
        address1,
        province: uk_region,
        city: town,
        zip: postcode + ' ' + postcodePrefix,
        country: 'GB'
    }
};

const run = async () => {

    const baseUrl = `https://${config.shop}.myshopify.com`;

    for (let i = 0; i < 50; i++) {
        const name = generateRandomName();
        const email = generateEmailAddress(name);
        const phone = generatePhoneNumber();

        const address = generatRandomAddress();

        const customer = {
            first_name: name.first,
            last_name: name.last,
            email: email,
            phone: phone,
            addresses: [
                address
            ]
        };

        let response = null;
        
        try {
            response = await axios.post(`${baseUrl}/admin/api/2022-04/customers.json`, {
                customer
            }, { 
                headers: { 'X-Shopify-Access-Token': config.access_token } 
            });
        } catch(err) {
            console.log(err);
            continue;
        }
      
        console.log(response.data);

    }
};

run()
.then(() => {
    console.log('Task completed successfully');
})
.catch((err) => {
    console.log(err);
})
.finally(() => {
    process.exit(0);
});
