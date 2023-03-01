const axios = require('axios');

const config = require('./config.json');
const baseUrl = `https://${config.shop}.myshopify.com`;

const randomIntFromRange = (min, max) =>{ 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

const getCustomers = async () => {
    return await axios.get(`${baseUrl}/admin/customers.json`, { 
        params: {
            limit: 250
        },
        headers: {
            'X-Shopify-Access-Token': config.access_token
        } 
    })
};

const getProducts = async () => {
    return await axios.get(`${baseUrl}/admin/products.json`, { 
        params: {
            limit: 250
        },
        headers: {
            'X-Shopify-Access-Token': config.access_token
        } 
    })
};

const createOrder = async (order) => {
    return await axios.post(`${baseUrl}/admin/orders.json`, { 
        order: order 
    }, {
        headers: {
            'X-Shopify-Access-Token': config.access_token
        }
    });
};

const run = async () => {

    let response = await getCustomers();

    const customers = response.data.customers;

    response = await getProducts();

    const products = response.data.products;

    for (let i = 0; i < 5; i++) {
        const randNo = randomIntFromRange(1, 5);
        const customer = customers[Math.floor(Math.random() * customers.length )];
    
        const order = {
            inventory_behaviour: 'decrement_obeying_policy',
            financial_status: "paid",
            line_items: [],
            shipping_address: customer.addresses[0],
            billing_address: customer.addresses[0],
            customer: {
                id: customer.id
            }
        };
    
        for (let j = 0; j < randNo; j++) {
            const randomProduct = products[Math.floor(Math.random() * products.length )];
    
            order.line_items.push({
                variant_id: randomProduct.variants[0].id,
                quantity:  randomIntFromRange(1, 3)
            });
        }
    
        response = null;
    
        try {
            response = await createOrder(order);
        } catch(err) {
            console.log(err);
            continue;
        }
    
        console.log("Created order", response.data.order.id);
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