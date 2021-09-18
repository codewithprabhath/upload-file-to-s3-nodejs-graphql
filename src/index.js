import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import createSchema from './graphql/index.js';
import createContext from './context.js';
import { ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';

const port = /^\d+$/.test(process.env.PORT) ? Number(process.env.PORT) : 4000;
(async () => {
    const context = await createContext();
    const server = new ApolloServer({
        plugins: [
            process.env.NODE_ENV === 'production'
                ? ApolloServerPluginLandingPageDisabled()
                : ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
        schema: createSchema(),
        context: async () => {
            return {
                ...context
            };
        },
    });
    await server.start()
    const app = express();
    server.applyMiddleware({ app });
    // server.timeout = 15 * 60 * 1000;
    const svr = app.listen({ port }, () => {
        // eslint-disable-next-line no-console
        console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
    svr.setTimeout(600000);
})().catch(error => {
    /* eslint-disable no-console */
    console.log(error);
});
