const router = require('express').Router();
// const { response } = require('express');
const { Posts } = require('../../models');

router.post('/',function(req, res){
	try {
		const postRoutes = Posts.getcreate({
			...req.body,
			post_id: req.session.post_id,
		});

		res.status(200).json(postRoutes);
	} catch (err) {
		res.status(400).json(err);
	}
})

//TODO possibly reverse this so its more formatted to match like website.com/posts/:id/upvote
router.put('/upvote/:id',function(req, res){
	try {
		const userUpvote = Posts.getcreate({
			...req.body,
			post_upvotes: req.session.post_upvotes,
		});

		res.status(200).json(userUpvote);
	} catch (err) {
		res.status(400).json(err);
	}

})

//TODO possibly reverse this so its more formatted to match like website.com/posts/:id/upvote
router.put('/edited/:id',function(req, res){
	try {
		const userEdited = Posts.getcreate({
			...req.body,
			edited_post: req.session.edited_post,
		});

		res.status(200).json(userEdited);
	} catch (err) {
		res.status(400).json(err);
	}
	
})

router.delete('/:id',function(req,res){
	//TODO make sure the person that is deleting it in the session matches the author of the response trying to be deleted
	try {
		const userPost = await Posts.destroy({
			where: {
				id: req.params.id,
				post_id: req.session.post_id,
			},
		});

		if (!userPost) {
			res.status(404).json({ message: 'No Posts to delete here!' });
			return;
		}

		res.status(200).json(userPost);
	} catch (err) {
		res.status(500).json(err);
	}
})

module.exports = router;