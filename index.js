const express = require('express');
const path = require('path');
const {ApolloServer} = require('apollo-server-express');
const {gql} = require('apollo-server');
const {prisma} = require('./generated/prisma-client');

const app = express();

const PORT = process.env.PORT || 4000;

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
  }

  type Query {
    posts: [Post!]!
  }

  type Mutation {
    createPost(title: String!, content: String!): Post
    updatePost(id: ID!, title: String, content: String): Post
    deletePost(id: ID!): Post
  }
`;

const resolvers = {
  Query: {
    posts: async (root, args, context) => {
      const posts = await context.prisma.posts({orderBy: 'createdAt_DESC'});
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
    updatePost: async (root, args, context) => {
      const updatedPost = await context.prisma.updatePost({
        data: {
          title: args.title,
          content: args.content,
        },
        where: {
          id: args.id,
        },
      });
      return updatedPost;
    },
    deletePost: async (root, args, context) => {
      const deletedPost = await context.prisma.deletePost({
        id: args.id,
      });

      return deletedPost;
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

app.use(express.static(path.join(__dirname, 'client/build')));

server.applyMiddleware({app, path: '/api'});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
