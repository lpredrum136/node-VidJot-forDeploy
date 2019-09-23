module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {// req.isAuthenticated() is passport's stuff
            return next();
        }
        req.flash('error_msg', 'Not authorised');
        res.redirect('/users/login');
    }// You can export more function by adding another item in this object, i.e.
    // ", somefunction: function() {}". See ideas.js to see how to import multiple things from this module
};