import {
  mergeSchemas,
  makeExecutableSchema
} from 'graphql-tools';

import accountTypeDefs from './account/typeDefs.graphql';
import accountResolvers from './account/resolvers.js';

const AccountSchema = makeExecutableSchema({
  typeDefs: accountTypeDefs,
  resolvers: accountResolvers
});

export default mergeSchemas({
  schemas: [AccountSchema]
});
