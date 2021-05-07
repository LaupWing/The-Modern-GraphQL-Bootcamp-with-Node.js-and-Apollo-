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
         return pubsub.subscribtion.post({
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
}

export default Subscription