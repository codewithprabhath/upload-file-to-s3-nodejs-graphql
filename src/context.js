import Knex from 'knex';
import 'dotenv/config';
import AccountRepository from './domain/account/repository.js';
import AccountService from './domain/account/service.js';

const createContext = async () =>{
    const knex = Knex({
        client: 'mysql',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        },
        pool: { min: 0, max: 7 },
        useNullAsDefault: true,
    });
    const accountRepository = new AccountRepository(knex);
    const accountService = new AccountService(accountRepository);
    return {
        repositories: {
            account: accountRepository,
        },
        services: {
            account:accountService,
        }
    }
};

export default createContext;