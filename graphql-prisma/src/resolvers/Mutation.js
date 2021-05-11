import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'

const Mutation = {
   async createUser(parent, args, {prisma}, info){
      if(args.data.password.length < 8){
         throw new Error('Password must be 8 characters or longer.')
      }
      const hashed = await bcrypt.hash(args.data.password, 10)

      const user = await prisma.mutation.createUser({
         data: {
            ...args.data,
            password: hashed
         }
      })

      return {
         user,
         token: jwt.sign({userId: user.id}, 'thisisasecret')
      }
   },
   async login(parent, args, {prisma}, info){
      const user = await prisma.query.user({
         where: {
            email: args.data.email
         }
      })

      if(!user){
         throw new Error('Unable to login')
      }
      const isMatch = await bcrypt.compare(args.data.password, user.password)

      if(!isMatch){
         throw new Error('Unable to login')
      }
      return {
         user,
         token: jwt.sign({userId: user.id}, 'thisisasecret')
      }
   },
   async deleteUser(parent, args, {prisma, request}, info){
      const userId = getUserId(request)
      return prisma.mutation.deleteUser({
         where: {
            id: userId
         }
      },info)
   },
   updateUser(parent, args, {prisma, request}, info){
      const userId = getUserId(request)

      return prisma.mutation.updateUser({
         where:{
            id: userId
         },
         data: args.data
      }, info)
   },
   createPost(parent, args, {prisma, request}, info){
      const userId = getUserId(request)

      return prisma.mutation.createPost({
         data: {
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author: {
               connect:{
                  id: userId
               }
            }
         }
      }, info)
   },
   updatePost(parent, {id, data}, {db, pubsub}, info){
      return prisma.mutation.updatePost({
         where:{
            id: args.id
         },
         data: args.data
      }, info)
   },
   async deletePost(parent, args, {prisma, request}, info){
      const userId = getUserId(request)
      const postExists = await prisma.exists.Post({
         id: args.id,
         author:{
            id: userId
         }
      })
      if(!postExists){
         throw new Error('Operation failed')
      }
      return prisma.mutation.deletePost({
         where:{
            id: args.id
         }
      }, info)
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
   createComment(parent, args, {prisma}, info){
      return prisma.mutation.createComment({
         data:{
            text:args.data.text,
            author:{
               connect:{
                  id: args.data.author
               }
            },
            post:{
               connect:{
                  id: args.data.post
               }
            }
         }
      }, info)
   },
   updateComment(parent, {data, id}, {prisma}, info){
      return prisma.mutation.updateComment({
         where:{
            id: id
         },
         data:args.data
      }, info)
   },
   deleteComment(parent, args, {prisma}, info){
      return prisma.mutation.deleteComment({
         where:{
            id: args.id
         }
      })
   }
}

export default Mutation