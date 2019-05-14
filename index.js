const { ApolloServer, gql } = require('apollo-server');
const firebase = require('./firebase');

const ref = firebase.database().ref('graphql-workshop');

const typeDefs = gql`
    type Query {
        posts: [Post],
        users: [User]
    }

    type Post {
        caption: String
        comments_count: Int
        id: String!
        like_count: Int
        media_type: String
        media_url: String
        permalink: String
        author: User!
    }

    type User {
        id: String!
        name: String
        handle: String!
    }
`;

const resolvers = {
    Query: {
        posts: async () => {
            const snapshot = await ref.child('posts').once('value');
            return Object.values(snapshot.val());
        },
        users: async () => {
            const snapshot = await ref.child('users').once('value');
            return Object.values(snapshot.val());
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
});

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`);
});
