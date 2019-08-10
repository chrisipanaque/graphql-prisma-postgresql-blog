const {ApolloServer, gql} = require('apollo-server');

const posts = [
  {
    title: 'How to Apollo Server',
    content: 'npm install apollo-server',
  },
  {
    title: 'How to GraphQL',
    content: 'npm install graphql',
  },
];

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
    posts: () => posts,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({url}) => {
  console.log(`Server running on ${url}`);
});
