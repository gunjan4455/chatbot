const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config');
const bodyParser = require("body-parser");
const isDeveloping = process.env.NODE_ENV !== 'prod';
const port = 9000;
const app = express();
const _ = require('lodash');

const fs = require('fs');

//socket
const socket = require('socket.io');
const {Server} = require('http');
const mongoose = require('mongoose');
const Users = require('./models/user');
const Admins = require('./models/admin');
const Message = require('./models/message');
const helper = require('./helper/response');
const open = require('open');

const server = Server(app);
const io = socket(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
require('./routes')(app);

//app.get('/api/books', function response(req, res) {
//    res.sendFile(path.join(__dirname, '../data/books.json'));
//});
//
//app.get('/api/book/:id', function (req, res) {
//    var id = req.params.id;
//    fs.readFile('../data/books.json', 'utf8', function (err, data) {
//        if (err) {
//            console.log(err);
//        }
//        else {
//            var books = JSON.parse(data);
//            var filteredArray = books.filter(book => {
//                return book.id == id
//            });
//            json = (filteredArray[0]);
//            res.send(json);
//        }
//    })
//
//});
//
//app.put('/api/book/:id', function response(req, res) {
//    let books = require('../data/books.json');
//    fs.readFile('../data/books.json', 'utf8', function (err, data) {
//        if (err) {
//            console.log(err);
//            res.sendStatus(404);
//        }
//        else {
//            var jsonObject = JSON.parse(data);
//            var arr = [];
//            var filteredArray = jsonObject.map(function (book) {
//                if (book.id === req.params.id) {
//                    book.title = req.body.title;
//                    book.description = req.body.description;
//                    book.author = req.body.author;
//                }
//
//                arr.push(book);
//            });
//            var json = JSON.stringify(arr); //convert it back to json
//            fs.writeFile('../data/books.json', json, 'utf8', function (err) {
//                if (err)
//                    throw err;
//                res.send(req.body);
//            });
//        }
//    });
//});

if (isDeveloping) {
    const compiler = webpack(config(process.env.NODE_ENV));
    const middleware = webpackMiddleware(compiler, {
        publicPath: '/',
        contentBase: 'app',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.use(express.static(__dirname + '/public'))
    app.get('*', function response(req, res) {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../dist/index.html')));
        res.end();
    });
} else {
    //production mode
    //app.use(express.static(__dirname + '/dist'));
    //app.get('*', function response(req, res) {
    //    res.sendFile(path.join(__dirname, '/dist/index.html'));
    //});
}

//socket

io.on('connection', function (socket) {
    console.log("socket connection on=======", socket.id);
    console.log('a user connected')
    socket.on('subscribe', (data) => {
            io.sockets.emit('subscribeSuccess', data.user);
            if (data.user.isAdmin) {
                Users.findOneAndUpdate({_id: data.user._id}, {
                    $set: {
                        status: "online",
                        socketId: socket.id
                    }
                }).exec(function (err, user) {
                    if (err) {
                        res.status(422).json(helper.responseObject(422, err, null, true));
                    } else if (user) {
                        let obj = {
                            email: user.email,
                            status: user.status,
                            socketId: socket.id,
                            password: user.password,
                            userid: user.userid,
                            name: user.name,
                            user: user._id
                        }
                        Admins.findOneAndUpdate({user: user._id}, {
                            $set: {
                                status: "online",
                                socketId: socket.id
                            }
                        }).exec(function (err, user) {
                            if (err) {
                                res.status(422).json(helper.responseObject(422, err, null, true));
                            } else if (user) {
                                console.log("admin found");
                            } else {
                                new Admins(obj).save(function (err, admin) {
                                    if (err) {
                                        console.log("err", err);
                                        //res.status(422).json(helper.responseObject(422, err, null, true));
                                    } else {
                                        console.log("admin added successfully", admin);
                                        //res.status(200).json(helper.responseObject(200, user, null, true));
                                    }
                                })
                            }
                        });

                    }
                });
            } else {
                Users.findOneAndUpdate({_id: data.user._id}, {
                    $set: {
                        socketId: socket.id,
                        status: "online"
                    }
                }).exec(function (err, user) {
                    console.log("subscription=======2222=", user);
                    if (err) {
                        res.status(422).json(helper.responseObject(422, err, null, true));
                    } else if (user) {
                        console.log("client added successfully", user);
                    }
                });

            }
            //room = data.room
            //socket.join(room)
            //console.log('joined room', room)
        }
    )

    socket.on('joinRoom', (data) => {
        console.log("jjjjjjjjjjjjjjj", data.room.title);
        socket.join(data.room.title, function (err) {
            console.log("roommmmmmmmmmmm", data.room);
            console.log("clients=======", io.sockets.adapter.rooms[data.room.title], 'ffffffffff', io.sockets.adapter.rooms);
            data.room.message = "Hey admin how r u???";
            data.room.socketId = socket.id;
            Admins.find({}).exec(function (err, admins) {
                if (admins.length) {
                    _.map(admins, function (admin, index) {
                        if (io.sockets.connected[admin.socketId])
                            io.sockets.connected[admin.socketId].emit("greeting-request", data.room);
                            socket.emit('room-details', data.room);

                    });
                }
            });
        });
        console.log('joined room', data.room);
    })

    socket.on('accept-greeting-request', (data) => {
        console.log('admin joined room', data, socket.id);
        if (data.user.isAdmin) {
            socket.join(data.room.title, (err) => {
                console.log("admin joined successfully", err);
            });
        }
    })

    socket.on('unsubscribe', () => {
        socket.leave(room)
        console.log('leaving room', room)
    })

    socket.on('disconnect', () => {
        console.log('a user disconnected')
    })

    socket.on('chat-message', function (msg) {
        console.log('sending message to', msg)
        //let message = new Message({user: msg.user, content: msg.message, room: msg.room})
        //message.save((err) => {
        //    if (err) return err
        //})
        console.log("clients=======", io.sockets.adapter.rooms[msg.room.title].sockets, io.sockets.adapter.rooms);
        //io.to(msg.room).emit('chat-message', JSON.stringify(msg.message))
        io.sockets.in(msg.room.title).emit('chat-message', msg.message);

        //io.sockets.in(msg.room.title).emit('chat-message', msg.message);
    })
    socket.on('admin-msg', function (obj) {
        console.log('@@@@@@@@@@@@admin-msg==================',JSON.parse("your string"), obj);
          let newObj=JSON.parse(obj);
        //let message = new Message({user: obj.room.owner, room: obj.room._id, text : obj.message.text, type : obj.message.type})
        //message.save((err) => {
        //    if(err)
        //        return err
        //    else {
        //        console.log("message saved");
        //        }
        //    });
        //io.to(msg.room).emit('chat-message', JSON.stringify(msg.message))
       io.sockets.to(newObj.room.title).emit('admin-msg',obj.message);

        //io.sockets.in(msg.room.title).emit('chat-message', msg.message);
    });
    socket.on('user-msg', function (msg) {
        console.log('user-msg', msg);
        //let message = new Message({user: msg.user, content: msg.message, room: msg.room})
        //message.save((err) => {
        //    if (err) return err
        //})
        //io.to(msg.room).emit('chat-message', JSON.stringify(msg.message))
        io.sockets.in(msg.room.title).emit('user-msg', msg.message);

        //io.sockets.in(msg.room.title).emit('chat-message', msg.message);
    });

    socket.on('new room', (roomData) => {
        let message = new Message({user: roomData.user, content: roomData.message, room: roomData.room})
        message.save((err) => {
            if (err) return err
        })
    })

    socket.on('file_upload', (data, buffer) => {
        console.log(data)
        const user = data.user
        const fileName = path.join(__dirname, '../public/images', data.file)
        const tmpFileName = path.join('/images', data.file)
        const imageBuffer = imageDecoder(buffer)

        fs.open(fileName, 'a+', (err, fd) => {
            if (err) throw err;

            fs.writeFile(fileName, imageBuffer.data, {encoding: 'base64'}, (err) => {
                fs.close(fd, () => {
                    let message = Message({user: user, room: room, image: tmpFileName})

                    message.save((err) => {
                        if (err) return err
                    })
                    console.log('file saved successfully!')
                });
            })
        })

        console.log('reached room, sending', fileName)
        io.to(room).emit('file_upload_success', {file: tmpFileName, user: user})
    })
});

mongoose.connect('mongodb://localhost/saxoChatbot')
const db = mongoose.connection;

db.once('open', () => {
    server.listen(port, function (err) {
        if (err) {
            console.log(err);
        } else {
            open(`http://localhost:${port}`);
        }
    });
});

