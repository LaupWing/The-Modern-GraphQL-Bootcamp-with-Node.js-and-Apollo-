import getUserId from '../utils/getUserId'

const Subscription = {
   comment:{
      subscribe(parent, {postId}, {prisma}, info){
         return prisma.subscribtion.comment({
            where:{
               node:{
                  post:{
                     id: postId
                  }
               }
            }
         }, info)
      }
   },
   post:{
      subscribe(parent, {postId}, {prisma}, info){
         return prisma.subscribtion.post({
            where:{
               node:{
                  comment:{
                     published: true
                  }
               }
            }
         }, info)
      }
   },
   myPost:{
      subscribe(parent, args, {prisma, request}, info){
         const userId = getUserId(request)
         

         return prisma.subscribtion.post({
            where:{
               node:{
                  author:{
                     id: userId
                  }
               }
            }
         }, info)
      }
   }
}

export default Subscription