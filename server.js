const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const serveIndex = require('serve-index');
const fileUpload = require('express-fileupload');
const path = require('path');
const morgan = require('morgan');
const _ = require('lodash');

const { publish } = require('./utils');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true
  })
);

app.use('/export', serveIndex(path.join(__dirname, 'export')));
app.use('/export', express.static(path.join(__dirname, 'export')));
app.use(express.static('public'));

app.param('appId', (req, res, next, appId) => {
  req.appId = appId;
  next();
});

app.param('version', (req, res, next, version) => {
  req.version = version;
  next();
});

app.post('/publish/:appId/:version', async (req, res) => {
  try {
    if (!req.files || !req.files.data) {
      res.status(400).send({ message: '无效数据' });
    } else {
      const data = req.files.data;
      const { appId, version } = req;
      data.mv(`./public/data/${appId}/${version}/data.json`);

      const { stdout, stderr } = publish(appId, version);
      if (stderr) {
        res.status(500).send({ message: '发布失败', error: stderr });
      }
      //send response
      res.send({
        message: '发布成功',
        data: {
          appId,
          version
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/image/:appId', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      res.status(400).send({ message: '无效图片' });
    } else {
      const image = req.files.image;
      const { appId } = req;
      image.mv(`./public/images/${appId}/${image.name}`);

      //send response
      res.send({
        message: '上传成功',
        data: {
          name: image.name,
          url: `${process.env.HOST || 'http://localhost'}:${process.env.PORT ||
            3000}/images/${appId}/${image.name}`,
          mimetype: image.mimetype,
          size: image.size
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//start app
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}.`));
