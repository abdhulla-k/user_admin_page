const Users = require( '../models/user' );

exports.adminHome = ( req, res, next ) => {
    if( req.session.loggedIn ) {
        Users.find({}, ( err, data ) => {
            if( data ) {
                res.render( "admin/home", { admin: true, data } );
            }
        });
    } else {
        res.redirect( "/auth/login" );
    }
};

exports.adminLogin = ( req, res, next ) => {
    res.redirect( "/auth/login" )
};

exports.createUser = ( req, res, next ) => {
    res.render( 'admin/create-user', { admin: true } );
}

exports.postCreate = ( req, res, next ) => {
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const email = req.body.email;
    const gender = req.body.gender;
    const password = req.body.password;
    const admin = req.body.admin;

    const user = new Users({
        firstName: firstName,
        secondName: secondName,
        email: email,
        gender: gender,
        password: password,
        admin: Boolean(admin)
    })

    // check user exist or not
    Users.find( { email: user.email }, ( err, data ) => {
        if( data.length > 0 ) {
            res.render( "error", { message: "email already exist" });
        } else {
            // save the user
            user.save()
                .then( result => {
                    console.log( "user created" );
                    res.redirect( '/admin/' );
                })
                .catch( err => {
                    console.log( err );
                    res.redirect( '/admin/' );
                })
        }
    })
}

exports.editProduct = ( req, res, next ) => {
    const productId = req.params.productId;
    Users.findById( productId )
        .then( userData => {
            res.render( 'admin/edit-user', {
                data: userData,
                admin: true
            });
        });
};

exports.updateUser = ( req, res, next ) => {
    const id = req.body.id;
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const email = req.body.email;
    const admin = req.body.admin;

    Users.updateOne( { id: id, admin: admin }, {
        firstName: firstName,
        secondName: secondName,
        email: email
    }).then( () => {
        res.redirect( "/admin/" );
    })
}

exports.deleteProduct = ( req, res, next ) => {
    const productId = req.body.productId
    Users.findByIdAndRemove( productId )
        .then( () => {
            console.log( 'deleted' );
            res.redirect( "/admin" );
        })
        .catch( err => {
            console.log( err );
            res.redirect( "/admin" );
        })
}