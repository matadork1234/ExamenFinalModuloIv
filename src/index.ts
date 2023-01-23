import 'reflect-metadata';
import app from './config/app';
import AppDataSource from './config/database.config';
import dotenv from 'dotenv';
import passport from './strategies/jwt.strategy';

import ProductRoute from './routes/product.route';
import UserRoute from './routes/user.route';
import AuthRoute from './routes/auth.route';
import CarRoute from './routes/shopping-car.route';

dotenv.config();

const main = async() => {
    const PORT_SERVER: number = parseInt(process.env.PORT as string, 10) || 3000;

    try {
        await AppDataSource.initialize();
        console.log('Database connected!');
    } catch (error) {
        console.error(error);
    }

    app.use('/api/v1/products', ProductRoute);
    app.use('/api/v1/users', UserRoute);
    app.use('/api/v1/auth', AuthRoute);
    app.use('/api/v1/cart', passport.authenticate('jwt', { session: false }), CarRoute);
    
    app.listen(PORT_SERVER, () => {
        console.log(`Server is listennig in a port ${  PORT_SERVER }`);
    });
}

main();




