import { gql } from 'apollo-server';
import { DateTimeResolver, EmailAddressResolver } from 'graphql-scalars';
import { GraphQLUpload } from 'graphql-upload';
import successMessages from '../utils/successMessages.js';
import s3Helper from '../helpers/s3Helper.js';

const typeDefs = gql`
    scalar DateTime
    scalar EmailAddress
    scalar Upload

    type Account {
        userId: Int!
        email: String!
        createdAt: DateTime!
        updatedAt: DateTime
        profile: Profile!
    }
    type Profile {
        userId: Int!
        firstName: String!
        lastName: String!
        middleName: String
        createdAt: DateTime!
        updatedAt: DateTime
    }
    type ProfileImageUpload {
        message: String!
    }
    input CreateAccountInput {
        email: EmailAddress!
        password: String
        firstName: String!
        lastName: String!
        middleName: String
    }
    extend type Mutation {
        addAccountWithProfile(info: CreateAccountInput!): Account!
        uploadProfileImage(File: Upload!, email: EmailAddress!): ProfileImageUpload!
    }
    extend type Query {
        allAccounts: [Account]!
    }
`;

const resolvers = {
    DateTime: DateTimeResolver,
    EmailAddress: EmailAddressResolver,
    Upload: GraphQLUpload,
    Account: {
        async profile(account, __, { services }) {
            return services.account.findProfile(account.userId);
        },
    },
    Mutation: {
        async addAccountWithProfile(_, { info }, { services }) {
            return services.account.addAccount(info);
        },
        async uploadProfileImage(_, { file, email }, { services }) {
            const { createReadStream, filename, mimetype, encoding } = await file;
            const stream = createReadStream();
            const s3Url = await s3Helper.uploadFileToS3UsingStream(
                mimetype,
                filename.split('.').pop(),
                stream,
                {
                    bucket: process.env.S3_BUCKET,
                    region: S3_REGION,
                    path: `codewithprabhath/usersImages/${email}`,
                },
                filename.split('.')[0],
            );
            return {
                message: successMessages.userImageUpdated
            };
        },
    },
    Query: {
        async allAccounts(_, __, { services }) {
            return services.account.findAll();
        }
    },
};

export default {typeDefs, resolvers};