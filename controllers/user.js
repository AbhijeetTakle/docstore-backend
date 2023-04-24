const { userModel, docSchema } = require("../models/userModel");
const { google } = require("googleapis");
const stream = require("stream");
const dotenv = require("dotenv");

dotenv.config();

const createUser = async (req, res) => {
  const email = req.body.email;
  const user = new userModel({
    usermail: email,
    documents: [],
  });
  await user
    .save()
    .then((doc) => {
      return res.json({
        message: "user registered Successfully",
        record: doc,
      });
    })
    .catch((err) => {
      return res.json({
        message: err,
        record: {},
      });
    });
};

const updateUser = async (email, link, name) => {
  const file = {
    name,
    link,
  };
  await userModel.updateOne(
    { usermail: email },
    { $push: { documents: file } }
  );
};

const addDocument = async (req, res) => {
  CLIENT_ID = process.env.CLIENT_ID;
  CLIENT_SCERET = process.env.CLIENT_SCERET;
  REDIRECT_ID = process.env.REDIRECT_ID;
  REFRESH_TOKEN = process.env.REFRESH_TOKEN;

  const oauth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SCERET,
    REDIRECT_ID
  );

  oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const file = req.file;
  const email = req.body.email;
  //   console.log(file.buffer, data);

  const drive = google.drive({
    version: "v3",
    auth: oauth2client,
  });

  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);
  try {
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname, //This can be name of your choice
        mimeType: file.mimetype,
        parents: [process.env.DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
    });

    const fileId = response.data.id;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: fileId,
      fields: "webContentLink",
    });

    updateUser(email, result.data.webContentLink, file.originalname);
    return res.json({
      name: file.originalname,
      link: result.data.webContentLink,
    });
  } catch (error) {
    return res.json(error);
  }
};

const getDocuments = async (req, res) => {
  const email = req.params.email;
  const docs = await userModel.findOne({ usermail: email });
  if (docs !== null) {
    res.json({ docs: docs.documents });
  } else {
    res.json({ docs: [] });
  }
};

module.exports = { createUser, addDocument, getDocuments };
