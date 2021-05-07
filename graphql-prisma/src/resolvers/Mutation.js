import {v4 as uuidv4} from 'uuid'

const Mutation = {
   async createUser(parent, args, {prisma}, info){
      const emailTaken = await prisma.exists.User({email: args.data.email})
      
      if(emailTaken){
         throw new Error('Email is taken.')
      }
      return prisma.mutation.createUser({
         data: args.data
      }, info)
   },
   async deleteUser(parent, args, {prisma}, info){
      const userExists = await prisma.exists.User({id: args.id})

      if(!userExists){
         throw new Error('User is not found')
      }
      return prisma.mutation.deleteUser({
         where: {
            id: args.id
         }
      },info)
   },
   updateUser(parent, args, {db}, info){
      return prisma.mutation.updateUser({
         where:{
            id: args.id
         },
         data: args.data
      }, info)
   },
   createPost(parent, args, {prisma}, info){
      return prisma.mutation.createPost({
         data: {
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author: {
               connect:{
                  id: args.data.author
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
   deletePost(parent, args, {prisma}, info){
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