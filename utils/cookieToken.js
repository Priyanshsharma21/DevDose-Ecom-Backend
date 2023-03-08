// 
/**
 *send or updates the cookie and also send user as response
 */

export const cookieToken = async(res,user)=>{
    // generate JWT token for user
    const token = user.getJwtToken()

    const options = {
        expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly : true,
    }


    res.status(200).cookie('token',token,options).json({
        success : true,
        token,
        user
    })
}