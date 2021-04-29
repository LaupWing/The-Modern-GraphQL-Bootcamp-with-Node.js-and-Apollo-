import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Comment from './resolvers/Comment'
import User from './resolvers/User'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import Post from './resolvers/Post'

const pubsub = new PubSub()

// Resolvers
const resolvers = {
   Query,
   Mutation,
   Comment,
   User,
   Post,
   Subscription
}

const server = new GraphQLServer({
   typeDefs: './src/schema.graphql',
   resolvers,
   context:{
      db,
      pubsub
   }
})

server.start(()=>{
   console.log('The server is up!')
})