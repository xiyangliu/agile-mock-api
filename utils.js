const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const publish = async (appId, version) => {
  const dest = `./export`;
  try {
    return ({ stdout, stderr } = await exec(
      `zip -rj ${dest}/${appId}_${version}.zip ./public/data/${appId}/${version}/data.json ./public/images`
    ));
  } catch (err) {
    return { stderr: err };
  }
};

exports.publish = publish;
