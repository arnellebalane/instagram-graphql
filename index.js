const { ApolloServer, gql } = require('apollo-server');
const firebase = require('./firebase');

const ref = firebase.database().ref('graphql-workshop');

const typeDefs = gql`
    type Query {
        "A list of all Instagram posts that uses the hashtag that we're interested in."
        posts: [Post],

        "A list of all users that authored an Instagram post using the hashtag that we're interested in."
        users: [User]
    }

    enum PostMediaType {
        CAROUSEL_ALBUM
        IMAGE
        VIDEO
    }

    "This type represents an Instagram post that uses the hashtag that we're interested in."
    type Post {

        "The caption of the Instagram post."
        caption: String

        "The number of comments for the Instagram post."
        comments_count: Int

        "The unique identifier for the Instagram post."
        id: ID!

        "The number of likes for the Instagram post."
        like_count: Int

        "The type of media contained in the Instagram post."
        media_type: PostMediaType

        "The URL to the media contained in the Instagram post."
        media_url: String

        "The permanent URL to this Instagram post."
        permalink: String

        "The user that authored this Instagram post."
        author: User!
    }

    "This type represents an Instagram user that authored a post."
    type User {

        "The unique identifier of the Instagram user."
        id: ID!

        "The display name of the Instagram user."
        name: String

        "The handle or username of the Instagram user."
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
