const Project = require('../models/project');

var projectMiddle = function(req, res, next) {
    var projectID = req.body.projectID;
    var scope = req.query.scope;
    Project.findOne({ projectID }).then(function(project) {
        if (!project) {
            return Promise.reject({ code: 404, message: "Project ID does not exist" })
        }
        req.project = project;
        next();
    }).catch(function(e) {
        if (e.code) {
            res.status(e.code).send(e)
        } else {
            res.status(500).send({ message: "Unknown Error" })
        }
    });
};

module.exports = projectMiddle;