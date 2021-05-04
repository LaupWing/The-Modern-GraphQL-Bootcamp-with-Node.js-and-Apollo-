const Query = {
   users(parent, args, {db, prisma} , info){
      return prisma.query.users(null, info)
      // if(!args.query){
         //    return db.users
         // }
         // return db.users.filter(user=>user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()))
      },
   posts(parent, args, {db, prisma} , info){
      return prisma.query.posts(null, info)
      // if(!args.query){
      //    return db.posts
      // }
      // return db.posts.filter(post=>post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) || post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()))
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