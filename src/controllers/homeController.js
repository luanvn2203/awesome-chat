let getHome = async (req, res, next) => {
    return res.render("main/home/home")
}

export default {
    getHome
}