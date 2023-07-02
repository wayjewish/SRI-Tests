export const port = Number(process.env.PORT) || 3000;
export const basename = '/hw/store';
export const url = `http://localhost:${port}${basename}`;
export const routes = {
    home: '/',
    catalog: '/catalog', 
    delivery: '/delivery',
    contacts: '/contacts',
    cart: '/cart',
};
