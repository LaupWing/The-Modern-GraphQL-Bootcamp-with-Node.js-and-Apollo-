const Comment =  {
   author(parent, args, {db}, info){
      return db.users.find(x=>x.id === parent.author)
   },
   post(parent, args, {db}, info){
      return db.posts.find(x=>x.id === parent.post)
   },
}

export default Comment