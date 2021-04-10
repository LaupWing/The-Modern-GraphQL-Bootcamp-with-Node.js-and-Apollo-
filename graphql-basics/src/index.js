import { GraphQLServer } from 'graphql-yoga'

const users = [
   {
      id: '1',
      name: 'Laup',
      email: 'laup@example.com',
      age: 26,
   },
   {
      id: '2',
      name: 'Hau',
      email: 'hau@example.com',
   },
]

// Type definitions (schemd)
const typeDefs = `
   type Query {
      post: Post!
      users: [Users!]!
      me: User!
   }

   type Post {
      id: ID!
      body: String!
      title: String!
      published: Boolean!
   }

   type User {
      id: ID!
      name: String!
      email: String!
      age: Int
   }
`

// Resolvers
const resolvers = {
   Query: {
      users(){
         return users
      },
      me(){
         return users[0]
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