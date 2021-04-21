const Comment= require('../models/comment');
const Post=require('../models/post');

module.exports.create=async function(req,res)
{
  try {
    let post=await Post.findById(req.body.post);
   
    if(post)
    {
        let comment=await Comment.create({
            content:req.body.content,
            post:req.body.post,
            user:req.user._id
        });

        post.comments.push(comment);
        post.save();
        req.flash('success','you added a comment to this post');
        res.redirect('/');       
    }
  } catch (error) {
    req.flash('error',err);
    return res.redirect('back'); 
  }   
}

module.exports.destroy=async function(req,res){
    try {
        let comment=await Comment.findById(req.params.id);
        // .id means converting the Object id into string 
        if(comment.user == req.user.id)
        {
            let postId=comment.post;
    
            comment.remove();
    
            let post=await Post.findByIdAndUpdate(postId,{ $pull: {comment:req.params.id}});

            req.flash('error','you deleted a comment from this post');
            
            return res.redirect('back');     
        }
        else{
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error',err);
        return res.redirect('back'); 
    }
}  