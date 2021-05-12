import Query from './Query'
import Comment from './Comment'
import User from './User'
import Mutation from './Mutation'
import Subscription from './Subscription'
import Post from './Post'
import {extractFragmentReplacements} from 'prisma-binding'

const resolvers = {
   Query,
   Mutation,
   Comment,
   User,
   Post,
   Subscription
}

const fragmentReplacements = extractFragmentReplacements(resolvers) 

export {resolvers, fragmentReplacements}