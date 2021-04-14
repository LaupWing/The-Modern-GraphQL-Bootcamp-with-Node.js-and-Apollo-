import {v4 as uuidv4} from 'uuid'

const Mutation = {
   createUser(parent, args, {db}, info){
      const emailTaken = db.users.some(x=> x.email === args.data.email)
      if(emailTaken){
         throw new Error('Email is taken.')
      }
      const user = {
         id: uuidv4(),
         ...args.data
      }
      db.users.push(user)
      return user
   },
   deleteUser(parent, args, {db}, info){
      const userIndex = db.users.findIndex(x=>x.id === args.id)
      if(userIndex === -1){
         throw new Error('User is not found')
      }
      const deletedUser = db.users.splice(userIndex, 1)

      db.posts = db.posts.filter(x=>{
         const match = post.author === args.id
         if(match){
            comments = comments.filter(y=>y.post !== x.id)
         }

         return !match
      })
      db.comments = db.comments.filter(x=>x.author !== args.id)
      return deletedUser[0]
   },
   updateUser(parent, args, {db}, info){
      const {data, id} = args
      const user = db.users.find(user=>user.id === id)

      if(!user){
         throw new Error('User not found')
      }

      if (typeof data.email === 'string'){
         const emailTaken = db.users.some(user => user.email === data.email)
         if(emailTaken){
            throw new Error('Email taken')
         }
         user.email = data.email
      }

      if(typeof data.name === 'string'){
         user.name = data.name
      }

      if (typeof data.age !== undefined){
         user.age = data.age
      }
      return user
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
   deletePost(parent, args, {db}, info){
      const postExists = db.posts.find(x=> x.id === args.id)
      if(!postExists){
         throw new Error('Post not found.')
      }
      db.posts = db.posts.filter(x=>x.id !== args.id)
      db.comments = db.comments.filter(x=>x.post !== args.id)
      
      return postExists
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
   createComment(parent, args, {db}, info){
      const userExists = db.users.some(x=> x.id === args.author)
      const postExists = db.posts.find(x=> x.id === args.post)
      if(!userExists){
         throw new Error('User not found.')
      }
      if(!postExists.published){
         throw new Error('Post not published.')
      }
      const comment = {
         id: uuidv4(),
         ...args
      }
      db.comments.push(comment)
      return comment
   },
   deleteComment(parent, args, {db}, info){
      const commentExists = db.comments.find(x=> x.id === args.id)
      if(!commentExists){
         throw new Error('User not found.')
      }
      
      db.comments = db.comments.filter(x=>x.id === args.id)

      return commentExists
   }
}

export default Mutation