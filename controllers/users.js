import User from '../models/User.js'

/*READ*/
export const getUser = async(req,res) =>{
    try{
        const {id} = req.params;
        let user = await User.findById(id);
        res.status(200).json(user);
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({message: err.message});
    }
}
export const getUserFreinds = async(req,res)=>{
    try{
        const {id} = req.params;
        const user = User.findById(id);
        const friends = await Promise.all(
            user.friends.map((id)=>User.findById(id))
        );
        const formattedFriends = friends.map(({_id,firstName,lastName,occupation,location,picturePath})=>{return {_id,firstName,lastName,occupation,location,picturePath}});
        res.status(200).json(formattedFriends);
    }
    catch(err){
        res.status(404).json({message: err.message});
    }
}

/*UPDATE*/
export const addRemoveFriends = async(req,res)=>{
    try{
        const {id,friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        if(user.friends.includes(friend)){
            user.friends = user.friends.filter((id)=> id !== friend.id); //removing that friend from users friend list
            friend.friends = friend.friends.filter((id)=> id !== id); //removing user from  that friend's friends list
        }
        else{
            user.friends.push(friendId);
            friend.friends.push(id);
            const friends = await Promise.all(
                user.friends.map((id)=>User.findById(id))
            );
        }
        const formattedFriends = user.friends.map(({_id,firstName,lastName,occupation,location,picturePath})=>{return {_id,firstName,lastName,occupation,location,picturePath}});
            res.status(200).json(formattedFriends);
    }
    catch(err){
        res.status(404).json({message: err.message});
    }
}