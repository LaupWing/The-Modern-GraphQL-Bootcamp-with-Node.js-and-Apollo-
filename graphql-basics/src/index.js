import { GraphQLServer } from 'graphql-yoga'
import {v4 as uuidv4} from 'uuid'

let users = [
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

let posts = [
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

let comments = [
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

   type Mutation {
      createUser(data: CreateUserInput): User!
      createPost(title: String!, author: ID!, text: String!, published: Boolean!): Post!
      deleteUser(id: ID!): User!
      deletePost(id: ID!): Post!
      deleteComment(id: ID!): Comment!
      createComment(text: String!, author: ID!, post: ID!): Comment!
   }

   input CreateUserInput {
      name: String!
      email: String!
      age: Int
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
   Mutation:{
      createUser(parent, args, ctx, info){
         const emailTaken = users.some(x=> x.email === args.data.email)
         if(emailTaken){
            throw new Error('Email is taken.')
         }
         const user = {
            id: uuidv4(),
            ...args.data
         }
         users.push(user)
         return user
      },
      deleteUser(parent, args, ctx, info){
         const userIndex = users.findIndex(x=>x.id === args.id)
         if(userIndex === -1){
            throw new Error('User is not found')
         }
         const deletedUser = uses.splice(userIndex, 1)

         posts = posts.filter(x=>{
            const match = post.author === args.id
            if(match){
               comments = comments.filter(y=>y.post !== x.id)
            }

            return !match
         })
         comments = comments.filter(x=>x.author !== args.id)
         return deletedUser[0]
      },
      createPost(parent, args, ctx, info){
         const userExists = users.some(x=> x.id === args.author)
         if(!userExists){
            throw new Error('User not found.')
         }
         const post = {
            id: uuidv4(),
            ...args
         }
         posts.push(post)
         return post
      },
      deletePost(parent, args, ctx, info){
         const postExists = posts.find(x=> x.id === args.id)
         if(!postExists){
            throw new Error('Post not found.')
         }
         posts = posts.filter(x=>x.id !== args.id)
         comments = comments.filter(x=>x.post !== args.id)
         console.log(postExists)
         return postExists
      },
      createPost(parent, args, ctx, info){
         const userExists = users.some(x=> x.id === args.author)
         if(!userExists){
            throw new Error('User not found.')
         }
         const post = {
            id: uuidv4(),
            ...args
         }
         posts.push(post)
         return post
      },
      createComment(parent, args, ctx, info){
         const userExists = users.some(x=> x.id === args.author)
         const postExists = posts.find(x=> x.id === args.post)
         if(!userExists){
            throw new Error('User not found.')
         }
         if(!postExists.published){
            throw new Error('Post not published.')
         }
         const comment = {
            id: uuidv4(),
            ...args
         }
         comments.push(comment)
         return comment
      },
      deleteComment(parent, args, ctx, info){
         const commentExists = comments.find(x=> x.id === args.id)
         if(!commentExists){
            throw new Error('User not found.')
         }
         
         comments = comments.filter(x=>x.id === args.id)

         return commentExists
      }
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