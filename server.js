const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const serveIndex = require('serve-index');
const fileUpload = require('express-fileupload');
const path = require('path');
const morgan = require('morgan');
const _ = require('lodash');

const { publishData } = require('./utils');

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
    const data = (req.files && req.files.data) || req.body;
    if (!data) {
      res.status(400).send({ message: '无效数据' });
    } else {
      const { appId, version } = req;
      const dest = `./public/data/${appId}/${version}/`;
      if (req.files) {
        data.mv(`${dest}/data.json`);
      } else {
        await fs.promises.mkdir(dest, { recursive: true });
        await fs.promises.writeFile(`${dest}/data.json`, data, 'utf8');
      }

      const error = await publishData(appId, version);
      if (error) {
        res.status(500).send({ message: '发布失败' });
      } else {
        res.send({
          message: '发布成功',
          appId,
          version
        });
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/images', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      res.status(400).send({ message: '无效图片' });
    } else {
      const image = req.files.image;
      image.mv(`./public/images/${image.name}`);

      res.send({
        message: '上传成功',
        data: [
          `${process.env.HOST || 'http://localhost'}:${process.env.PORT ||
            5000}/images/${image.name}`
        ]
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//start app
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is listening on port ${port}.`));
