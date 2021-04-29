const User = {
   posts(parent, args, {db}, info){
      return db.posts.filter(x=>x.author === parent.id)
   },
   comments(parent, args, {db}, info){
      return db.comments.filter(x=>x.author === parent.id)
   },
}

export default User