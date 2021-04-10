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

const posts = [
   {
      id: '10',
      title: 'Laup',
      body: 'laup@example.com',
      published: true,
   },
   {
      id: '11',
      title: 'Laup2',
      body: 'laup2@example.com',
      published: false,
   },
]

// Type definitions (schemd)
const typeDefs = `
   type Query {
      post: Post!
      posts(query: String): [Posts!]! 
      users(query: String): [Users!]!
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
      users(parent, args, ctx , info){
         if(!args.query){
            return users
         }
         return users.filter(user=>user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()))
      },
      users(parent, args, ctx , info){
         if(!args.query){
            return users
         }
         return posts.filter(post=>post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) || post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()))
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