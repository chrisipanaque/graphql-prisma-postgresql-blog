const {ApolloServer, gql} = require('apollo-server');
const {prisma} = require('./generated/prisma-client');

const typeDefs = gql`
  type Post {
    title: String!
    content: String!
  }

  type Query {
    posts: [Post!]!
  }
`;

const resolvers = {
  Query: {
    posts: async () => {
      const posts = await prisma.posts();
      return posts;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({url}) => {
  console.log(`Server running on ${url}`);
});
