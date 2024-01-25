import graphql from 'graphql';
import { User, Post } from '../models/index.js';
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} = graphql;


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },  // зміна тут
        email: { type: GraphQLString },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({ userId: parent.id });
            }
        }
    })
});


const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Post.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            args: {
                username: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            resolve(parent, args) {
                if (args.username || args.email) {
                    let query = {};
                    if (args.username) {
                        query.username = { $regex: args.username, $options: 'i' };
                    }
                    if (args.email) {
                        query.email = { $regex: args.email, $options: 'i' };
                    }
                    return User.find(query);
                } else {
                    return User.find({});
                }
            }
        },

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let user = new User({
                    username: args.username,
                    email: args.email
                });
                return user.save();
            }
        }
    }
});



const Schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});


export default Schema;
