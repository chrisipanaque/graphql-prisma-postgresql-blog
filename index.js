const {ApolloServer, gql} = require('apollo-server');
const {prisma} = require('./generated/prisma-client');

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
  }

  type Query {
    posts: [Post!]!
  }

  type Mutation {
    createPost(title: String!, content: String!): Post
  }
`;

const resolvers = {
  Query: {
    posts: async (root, args, context) => {
      const posts = await context.prisma.posts();
      return posts;
    },
  },
  Mutation: {
    createPost: async (root, args, context) => {
      const newPost = await context.prisma.createPost({
        title: args.title,
        content: args.content,
      });

      return newPost;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({url}) => {
  console.log(`Server running on ${url}`);
});
