import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schemd)
const typeDefs = `
   type Query {
      greeting(name: String): String!
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
      greeting(parent, args, ctx, info){
         return  args.name ? `Hello ${args.name}` : 'Heloo'
      },
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