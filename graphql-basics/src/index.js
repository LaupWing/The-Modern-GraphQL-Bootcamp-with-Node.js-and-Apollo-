import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schemd)
const typeDefs = `
   type Query {
      post: Post!
   }

   type Post {
      id: ID!
      body: String!
      title: String!
      published: Boolean!
   }
`

// Resolvers
const resolvers = {
   Query: {
      post(){
         return {
            id: '123',
            title: 'Laup',
            body: 'laup@example.com',
            published: true
         }
      }
   }
}

const server = new GraphQLServer({
   typeDefs,
   resolvers
})

server.start(()=>{
   console.log('The server is up!')
})