import { GraphQLServer } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Comment from './resolvers/Comment'
import User from './resolvers/User'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'

// Resolvers
const resolvers = {
   Query,
   Mutation,
   Comment,
   User,
   Post
}

const server = new GraphQLServer({
   typeDefs: './src/schema.graphql',
   resolvers,
   context:{
      db
   }
})

server.start(()=>{
   console.log('The server is up!')
})