// Handling requests related to SavedDocs colletion

const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const Users = require("../model/usersModel");
const SavedDocs = require("../model/saveddocsModel");
const Queries = require("../model/queriesModel");

// This route returns the control numbers (IDs) of the saved documents
router.post(
  "/controlnumberslist",
  asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const userExists = await Users.findOne({ _id: userId });

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
    } else if (!userExists) {
      res
        .status(400)
        .json({ error: "There is not user with the userId that you provided" });
    } else {
      var controlnumberslist = await SavedDocs.find({
        userId: userId,
        isRemoved: false,
      }).select("ControlNumber -_id");
      var list = Array();
      for (var i = 0; i < controlnumberslist.length; i++) {
        list.push(controlnumberslist[i].ControlNumber);
      }

      res.status(200).json({ list });
    }
  })
);

// This route returns the detailed list of the saved documents
router.post(
  "/list",
  asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const userExists = await Users.findOne({ _id: userId });

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
    } else if (!userExists) {
      res
        .status(400)
        .json({ error: "There is not user with the userId that you provided" });
    } else {
      var controlnumberslist = await SavedDocs.find({
        userId: userId,
        isRemoved: false,
      }).sort({ _id: -1 });

      res.status(200).json(controlnumberslist);
    }
  })
);

router.post(
  "/saveQueryOnSearch",
  asyncHandler(async (req, res)=>{
    const { userId, query, searchTopic, os } = req.body;
    var savedquery = await Queries.findOne({
      userId: userId,
      searchTopic: searchTopic,

    },{},{sort: {'createdAt': -1 }});
    
    // if (savedquery === null || savedquery.query == query)
    // {
        savedquery = await Queries.create({
        userId: userId,
        query: query,
        searchTopic: searchTopic,
        os:os
      });
      res.status(201).json({
        _id: savedquery._id,
      });
      console.log("created", savedquery);
      
    // }else{
    //   await Queries.findOneAndUpdate({ _id: savedquery._id },{query: query});
    //   res.status(409).json({
    //     detail: 'already exists'
    //   })
    //   console.log("updated", savedquery);
    // }
    

  })
);

// This route is for putting a document in the saved documents collection
router.post(
  "/save",
  asyncHandler(async (req, res) => {
    const { userId, ControlNumber, docdata, query, searchTopic } = req.body;

    var docdata2 = JSON.parse(docdata);

    const userExists = await Users.findOne({ _id: userId });
    const saveddocExists = await SavedDocs.findOne({
      userId: userId,
      ControlNumber: ControlNumber,
      isRemoved: false,
    });

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
    } else if (!userExists) {
      res
        .status(400)
        .json({ error: "There is not user with the userId that you provided" });
    } else if (!docdata) {
      res.status(400).json({ error: "doc is required" });
    } else if (!query) {
      res.status(400).json({ error: "query is required" });
    } else {
      if (saveddocExists) {
        // var removeddoc = saveddocExists;
        // await removeddoc.remove();

        let removeddoc = await SavedDocs.findOneAndUpdate(
          { userId: userId, ControlNumber: ControlNumber, isRemoved: false },
          { isRemoved: true },
          {
            new: true,
          }
        );

        res.status(201).json({
          _id: removeddoc._id,
          userId: removeddoc.userId,
          ControlNumber: removeddoc.ControlNumber,
        });
      } else {
        var savedquery = await Queries.findOne({ userId: userId, searchTopic: searchTopic});
        if (savedquery != null)
          savedquery = await Queries.findOne({ userId: userId, searchTopic: searchTopic })
            .sort({ _id: -1 })
            .limit(1);
        console.log(savedquery);
        if (
          savedquery == null ||
          (savedquery != null && savedquery.query != query)
        )
        {
          savedquery = await Queries.create({
            userId: userId,
            query: query,
            searchTopic: searchTopic,
          });
          console.log("aaa");
        }
        const saveddoc = await SavedDocs.create({
          userId: userId,
          ControlNumber: ControlNumber,
          docdata: docdata2,
          queryId: savedquery._id,
          isRemoved: false,
          searchTopic: searchTopic,
        });

        if (saveddoc) {
          res.status(201).json({
            _id: saveddoc._id,
            userId: saveddoc.userId,
            ControlNumber: saveddoc.ControlNumber,
          });
        } else {
          res
            .status(400)
            .json({ error: "There is a problem with your save request" });
        }
      }
    }
  })
);

// This route returns the control numbers (IDs) of the saved documents
router.post(
  "/querylist",
  asyncHandler(async (req, res) => {
    const { userId, searchTopic } = req.body;


    const userExists = await Users.findOne({ _id: userId });

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
    } else if (!userExists) {
      res
        .status(400)
        .json({ error: "There is not user with the userId that you provided" });
    } else {
      var querylist = await Queries.find({ userId: userId, searchTopic: searchTopic }).sort({ _id: -1 });
      var list = Array();
      for (var i = 0; i < querylist.length; i++) {
        var q = {};
        q._id = querylist[i]._id;
        q.userId = querylist[i].userId;
        q.query = querylist[i].query;
        q.createdAt = querylist[i].createdAt;
        q.updatedAt = querylist[i].updatedAt;
        q.os = querylist[i].os?querylist[i].os:'Unknown';
        q.documents = await SavedDocs.find({
          userId: userId,
          queryId: querylist[i]._id,
        }).sort({ _id: -1 });
        list.push(q);
      }
      // console.log(list);
      // console.log(11111);
      // console.log(querylist);
      res.status(200).json({ list });
    }
  })
);

router.post(
  "/queriesByTopic",
  asyncHandler(async (req, res) => {
    const { userId } = req.body;


    const userExists = await Users.findOne({ _id: userId });

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
    } else if (!userExists) {
      res
        .status(400)
        .json({ error: "There is not user with the userId that you provided" });
    } else {
      // var topics = await Queries.find().sort({updatedAt: -1 }).distinct('searchTopic');
      var topics3 = await Queries.find({userId: userId}).sort({updatedAt: -1 });
      var topics = Array();
      topics3.forEach(element => {
          if(topics.find(v => v==element.searchTopic)==null)
            topics.push(element.searchTopic);
      });

      var resp = {};
      for (var j = 0; j < topics.length; j++) {
        var querylist = await Queries.find(
            { userId: userId, searchTopic: topics[j] }
          ).sort({ updatedAt: -1 });
        var list = Array();
        for (var i = 0; i < querylist.length; i++) {
          var q = {};
          q._id = querylist[i]._id;
          q.userId = querylist[i].userId;
          q.searchTopic=querylist[i].searchTopic;
          q.query = querylist[i].query;
          q.createdAt = querylist[i].createdAt;
          q.updatedAt = querylist[i].updatedAt;
          q.documents = await SavedDocs.find({
            userId: userId,
            queryId: querylist[i]._id,
          }).sort({ _id: -1 });
          list.push(q);
        }
        resp[topics[j]] = list;
      }

      console.log("\n\n",resp);

      // console.log(list);
      // console.log(11111);
      // console.log(querylist);
      res.status(200).json(resp);
    }
  })
);

router.post(
  "/editTopicName",
  asyncHandler(async (req, res)=>{
    const { userId, newTopic, searchTopic } = req.body;

    var queries = await Queries.updateMany(
      {searchTopic: searchTopic, userId: userId}, {searchTopic:newTopic});
    var docs = await SavedDocs.updateMany(
      {searchTopic: searchTopic, userId: userId}, {searchTopic:newTopic});

    console.log("Modified docs: ", docs.modifiedCount, "Modified queries: ", queries.modifiedCount);
    res.status(200).json({modifiedDocs: docs.modifiedCount, modifiedQueries: queries.modifiedCount});

  })
);

module.exports = router;
