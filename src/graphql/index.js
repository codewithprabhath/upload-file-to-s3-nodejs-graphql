import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'apollo-server';
import merge from 'lodash.merge';
import account from './account.js';

const defaultTypeDefs = gql`
    type Query {
        _empty: String
    }
    type Mutation {
        _empty: String
    }
`;

const createSchema = () => {
    return makeExecutableSchema({
        typeDefs: [
            defaultTypeDefs,
            account.typeDefs,
        ],
        resolvers: merge(
            {},
            account.resolvers,
        ),
    });
};

export default createSchema;