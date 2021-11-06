let getHome = async (req, res, next) => {
    return res.render("main/home/home", {
        errors: req.flash("errors"),
        success: req.flash("success"),
        user: req.user
    })
}

export default {
    getHome
}