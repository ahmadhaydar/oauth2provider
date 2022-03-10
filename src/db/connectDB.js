require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://ahmadhaydar:NcrSfuSgAWw3MXrB@oauth2assignment.9kevr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
