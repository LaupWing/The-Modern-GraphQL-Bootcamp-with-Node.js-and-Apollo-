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
   createPost(parent, args, {db, pubsub}, info){
      const userExists = db.users.some(x=> x.id === args.author)
      if(!userExists){
         throw new Error('User not found.')
      }
      const post = {
         id: uuidv4(),
         ...args
      }
      db.posts.push(post)
      if(args.data.published){
         pubsub.publish('post', {
            post:{
               mutation: 'CREATED',
               data: post
            }
         })
      }
      return post
   },
   updatePost(parent, {id, data}, {db, pubsub}, info){
      const post = db.posts.find(x=>x.id === args.id)
      const originalPost = {...post}

      if(!post){
         throw new Error('Post not found')
      }
      if(typeof data.body === 'string'){
         post.body = data.body
      }

      if (typeof data.title === 'string'){
         user.title = data.title 
      }
      if (typeof data.published === 'boolean'){
         user.published = data.published 

         if(originalPost.published && !post.published){
            pubsub.published('post', {
               post:{
                  mutation: 'DELETED',
                  data: originalPost
               }
            })
         } else if (!originalPost.published && post.published){
            pubsub.published('post', {
               post:{
                  mutation: 'CREATED',
                  data: post
               }
            })
         }
      }else if (post.published){
         pubsub.published('post', {
            post:{
               mutation: 'UPDATED',
               data: post
            }
         })
      }

      return post
   },
   deletePost(parent, args, {db, pubsub}, info){
      const postExists = db.posts.find(x=> x.id === args.id)
      if(!postExists){
         throw new Error('Post not found.')
      }
      db.posts = db.posts.filter(x=>x.id !== args.id)
      db.comments = db.comments.filter(x=>x.post !== args.id)
      
      if(postExists.published){
         pubsub.publish('post', {
            post:{
               mutation: 'DELETED',
               data: postExists
            }
         })
      }

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
   createComment(parent, args, {db, pubsub}, info){
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
      pubsub.publish(`comment ${args.data.post}`, {
         comment:{
            mutation: 'CREATED',
            data: comment
         }
      })

      return comment
   },
   updateComment(parent, {data, id}, {db}, info){
      const comment = db.comments.find(x=> x.id === id)
      if(!comment){
         throw new Error('Comment not found.')
      }
      if(typeof data.body === 'string'){
         comment.body = data.body
      }

      if (typeof data.title === 'string'){
         comment.title = data.title 
      }
      if (typeof data.published === 'boolean'){
         comment.published = data.published 
      }
      pubsub.publish(`comment ${comment.post}`, {
         comment:{
            mutation: 'UPDATED',
            data: comment
         }
      })
      return comment
   },
   deleteComment(parent, args, {db, pubsub}, info){
      const commentExists = db.comments.find(x=> x.id === args.id)
      if(!commentExists){
         throw new Error('User not found.')
      }
      
      db.comments = db.comments.filter(x=>x.id === args.id)
      pubsub.publish(`comment ${commentExists.post}`, {
         comment:{
            mutation: 'DELETED',
            data: commentExists
         }
      })
      return commentExists
   }
}

export default Mutation