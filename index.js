const { ApolloServer, gql } = require('apollo-server');
const firebase = require('./firebase');

const ref = firebase.database().ref('graphql-workshop');

const typeDefs = gql`
    type Query {
        "Get a list of all Instagram posts that uses the hashtag that we're interested in."
        posts: [Post]

        "Get a specific Instagram post by its ID."
        post(id: ID!): Post

        "Get a list of all users that authored an Instagram post using the hashtag that we're interested in."
        users: [User]

        "Get a specific Instagram user by its ID."
        user(id: ID!): User
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

        "A list of posts authored by the Instagram user."
        posts: [Post]
    }
`;

const resolvers = {
    Query: {
        async posts() {
            const snapshot = await ref.child('posts').once('value');
            return Object.values(snapshot.val());
        },
        async post(parent, args) {
            const snapshot = await ref.child(`posts/${args.id}`).once('value');
            return snapshot.val();
        },
        async users() {
            const snapshot = await ref.child('users').once('value');
            return Object.values(snapshot.val());
        },
        async user(parent, args) {
            const snapshot = await ref.child(`users/${args.id}`).once('value');
            return snapshot.val();
        }
    },

    User: {
        async posts(author) {
            const snapshot = await ref.child('posts').once('value');
            return Object.values(snapshot.val())
                .filter(post => post.author.id === author.id);
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
