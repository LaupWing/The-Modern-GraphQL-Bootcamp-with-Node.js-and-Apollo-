import bcrypt, { hash } from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
   async createUser(parent, args, {prisma}, info){
      const hashed = await hashPassword(args.data.password)

      const user = await prisma.mutation.createUser({
         data: {
            ...args.data,
            password: hashed
         }
      })

      return {
         user,
         token: generateToken(user.id)
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
         token: generateToken(user.id)
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
   async updateUser(parent, args, {prisma, request}, info){
      const userId = getUserId(request)
      if(typeof args.data.password === 'string'){
         args.data.password = await hashPassword(args.data.password)
      }
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
   async updatePost(parent, {id, data}, {prisma, request}, info){
      const userId = getUserId(request)
      const postExists = await prisma.exists.Post({
         id: args.id,
         author:{
            id: userId
         }
      })
      const isPublished = await prisma.exists.Post({
         id: args.id,
         published: true
      })

      if(isPublished && !args.data.published){
         await prisma.mutation.deleteManyComments({
            where:{
               post:{
                  id:args.id
               }
            }
         })
      }

      if(!postExists){
         throw new Error('Operation failed')
      }
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
   createComment(parent, args, {prisma, request}, info){
      const userId = getUserId(request)
      const postExists = await prisma.exists.Post({
         id: args.data.post,
         published: true
      })
      if(!postExists){
         throw new Error('Operation failed')
      }
      return prisma.mutation.createComment({
         data:{
            text:args.data.text,
            author:{
               connect:{
                  id: userId
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
   async updateComment(parent, {data, id}, {prisma, request}, info){
      const userId = getUserId(request)
      const commentExists = await prisma.exists.Comment({
         id: args.id,
         author:{
            id: userId
         }
      })
      if(!commentExists){
         throw new Error('Operation failed')
      }
      return prisma.mutation.updateComment({
         where:{
            id: id
         },
         data:args.data
      }, info)
   },
   async deleteComment(parent, args, {prisma, request}, info){
      const userId = getUserId(request)
      const commentExists = await prisma.exists.Comment({
         id: args.id,
         author:{
            id: userId
         }
      })
      if(!commentExists){
         throw new Error('Operation failed')
      }
      return prisma.mutation.deleteComment({
         where:{
            id: args.id
         }
      })
   }
}

export default Mutation