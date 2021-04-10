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
      author: '1'
   },
   {
      id: '11',
      title: 'Laup2',
      body: 'laup2@example.com',
      published: false,
      author: '1'
   },
]

// Type definitions (schemd)
const typeDefs = `
   type Query {
      post: Post!
      posts(query: String): [Post!]! 
      users(query: String): [User!]!
      me: User!
   }

   type Post {
      id: ID!
      body: String!
      title: String!
      published: Boolean!
      author: User!
   }

   type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
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
      posts(parent, args, ctx , info){
         if(!args.query){
            return posts
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
   },
   Post: {
      author(parent, args, ctx, info){
         return users.find(x=>x.id === parent.author)
      }
   },
   User: {
      posts(parent, args, ctx, info){
         return posts.filter(x=>x.author === parent.id)
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