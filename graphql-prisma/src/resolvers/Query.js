import getUserId from "../utils/getUserId"

const Query = {
   users(parent, args, {prisma} , info){
      const opArgs = {}
      if(args.query){
         opArgs.where = {
            OR:[
               {
                  name_contains: args.query,
               },
               {
                  email_contains: args.query
               }
            ]
         }
      }
      return prisma.query.users(opArgs, info)
   },
   posts(parent, args, {prisma} , info){
      const opArgs = {}
      if(args.query){
         opArgs.where = {
            OR:[
               {
                  body_contains: args.query,
               },
               {
                  title_contains: args.query
               }
            ]
         }
      }
      return prisma.query.posts(opArgs, info)
   },
   me(){
      return users[0]
   },
   async post(parent, args, {prisma, request} , info){
      const userId = getUserId(request, false)

      const posts = await prisma.query.posts({
         where:{
            id: args.id,
            OR: [
               {
                  published: true
               },
               {
                  author: {
                     id: userId
                  }
               },
            ]
         }
      }, info)
      if(posts.length === 0){
         throw new Error('Post not found')
      }
      throw posts[0]
   },
   comments(parent, args, {prisma} , info){
      return prisma.query.comments(null, info)
   },
}

export default Query