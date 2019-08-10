const {prisma} = require('../generated/prisma-client/index');
const {GraphQLServer} = require('graphql-yoga');

const PORT = process.env.PORT || 4000;

const typeDefs = `
  type Query {
    posts: [Post!]!
  }

  type Mutation {
    addPost(title: String!, content: String!): Post
  }

  type Post {
    id: ID!
    title: String!
    content: String!
  }
`;

const resolvers = {
  Query: {
    posts: (root, args, context) => {
      return context.prisma.posts();
    },
  },
  Mutation: {
    addPost: (root, args, context) => {
      return context.prisma.createPost({
        title: args.title,
        content: args.content,
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
});

server.start(() => console.log(`Server is running on port: ${PORT}`));
