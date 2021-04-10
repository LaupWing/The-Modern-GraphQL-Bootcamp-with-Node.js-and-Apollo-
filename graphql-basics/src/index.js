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

const comments = [
   {
      id: '100',
      text: 'test1',
      post: '10',
      author: '1'
   },
   {
      id: '200',
      text: 'test12',
      post: '10',
      author: '2'
   },
   {
      id: '300',
      text: 'test123',
      post: '11',
      author: '2'
   },
   {
      id: '400',
      text: 'test1234',
      post: '11',
      author: '2'
   },
]

// Type definitions (schemd)
const typeDefs = `
   type Query {
      post: Post!
      posts(query: String): [Post!]! 
      users(query: String): [User!]!
      me: User!
      comments: [Comment!]!
   }

   type Post {
      id: ID!
      body: String!
      title: String!
      published: Boolean!
      author: User!
      comments: [Comment!]!
   }

   type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
   }

   type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
      comments: [Comment!]!
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
      },
      comments(){
         return comments
      },
   },
   Post: {
      author(parent, args, ctx, info){
         return users.find(x=>x.id === parent.author)
      },
      comments(parent, args, ctx, info){
         return comments.filter(x=>x.post === parent.id)
      },
   },
   Comment: {
      author(parent, args, ctx, info){
         return users.find(x=>x.id === parent.author)
      },
      post(parent, args, ctx, info){
         return posts.find(x=>x.id === parent.post)
      },
   },
   User: {
      posts(parent, args, ctx, info){
         return posts.filter(x=>x.author === parent.id)
      },
      comments(parent, args, ctx, info){
         return comments.filter(x=>x.author === parent.id)
      },
   }
}

const server = new GraphQLServer({
   typeDefs,
   resolvers
})

server.start(()=>{
   console.log('The server is up!')
})