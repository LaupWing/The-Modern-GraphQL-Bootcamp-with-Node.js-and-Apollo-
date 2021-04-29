const Post =  {
   author(parent, args, {db}, info){
      return db.users.find(x=>x.id === parent.author)
   },
   comments(parent, args, {db}, info){
      return db.comments.filter(x=>x.post === parent.id)
   },
}

export default Post