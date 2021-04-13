import { GraphQLServer } from 'graphql-yoga'
import {v4 as uuidv4} from 'uuid'
import db from './db'

// Resolvers
const resolvers = {
   Query: {
      users(parent, args, {db} , info){
         if(!args.query){
            return db.users
         }
         return db.users.filter(user=>user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()))
      },
      posts(parent, args, {db} , info){
         if(!args.query){
            return db.posts
         }
         return db.posts.filter(post=>post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) || post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()))
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
      createUser(parent, args, {db}, info){
         const emailTaken = db.users.some(x=> x.email === args.data.email)
         if(emailTaken){
            throw new Error('Email is taken.')
         }
         const user = {
            id: uuidv4(),
            ...args.data
         }
         db.users.push(user)
         return user
      },
      deleteUser(parent, args, {db}, info){
         const userIndex = db.users.findIndex(x=>x.id === args.id)
         if(userIndex === -1){
            throw new Error('User is not found')
         }
         const deletedUser = db.users.splice(userIndex, 1)

         db.posts = db.posts.filter(x=>{
            const match = post.author === args.id
            if(match){
               comments = comments.filter(y=>y.post !== x.id)
            }

            return !match
         })
         db.comments = db.comments.filter(x=>x.author !== args.id)
         return deletedUser[0]
      },
      createPost(parent, args, {db}, info){
         const userExists = db.users.some(x=> x.id === args.author)
         if(!userExists){
            throw new Error('User not found.')
         }
         const post = {
            id: uuidv4(),
            ...args
         }
         db.posts.push(post)
         return post
      },
      deletePost(parent, args, {db}, info){
         const postExists = db.posts.find(x=> x.id === args.id)
         if(!postExists){
            throw new Error('Post not found.')
         }
         db.posts = db.posts.filter(x=>x.id !== args.id)
         db.comments = db.comments.filter(x=>x.post !== args.id)
         
         return postExists
      },
      createPost(parent, args, {db}, info){
         const userExists = db.users.some(x=> x.id === args.author)
         if(!userExists){
            throw new Error('User not found.')
         }
         const post = {
            id: uuidv4(),
            ...args
         }
         db.posts.push(post)
         return post
      },
      createComment(parent, args, {db}, info){
         const userExists = db.users.some(x=> x.id === args.author)
         const postExists = db.posts.find(x=> x.id === args.post)
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
         db.comments.push(comment)
         return comment
      },
      deleteComment(parent, args, {db}, info){
         const commentExists = db.comments.find(x=> x.id === args.id)
         if(!commentExists){
            throw new Error('User not found.')
         }
         
         db.comments = db.comments.filter(x=>x.id === args.id)

         return commentExists
      }
   },
   Post: {
      author(parent, args, {db}, info){
         return db.users.find(x=>x.id === parent.author)
      },
      comments(parent, args, {db}, info){
         return db.comments.filter(x=>x.post === parent.id)
      },
   },
   Comment: {
      author(parent, args, {db}, info){
         return db.users.find(x=>x.id === parent.author)
      },
      post(parent, args, {db}, info){
         return db.posts.find(x=>x.id === parent.post)
      },
   },
   User: {
      posts(parent, args, {db}, info){
         return db.posts.filter(x=>x.author === parent.id)
      },
      comments(parent, args, {db}, info){
         return db.comments.filter(x=>x.author === parent.id)
      },
   }
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