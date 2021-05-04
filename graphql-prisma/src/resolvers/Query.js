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
}

export default Query