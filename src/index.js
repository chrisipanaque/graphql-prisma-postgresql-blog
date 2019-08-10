const {GraphQLServer} = require('graphql-yoga');

const PORT = process.env.PORT || 4000;

const typeDefs = `
  type Query {
    feed: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
  }
`;

const resolvers = {
  Query: {
    feed: async (parent, args, context, info) => {
      return {
        test: 'test',
      };
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log(`Server is running on port: ${PORT}`));
