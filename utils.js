const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const publishData = async (appId, version) => {
  const dest = `${process.cwd()}/export/${appId}_${version}.tar.gz`;
  const { stdout, stderr, error } = await execCommand(
    `tar -czf ${dest} -C ${process.cwd()}/public/images . -C ${process.cwd()}/public/data/${appId}/${version} .`
  );
  const { stdout: exists } = await execCommand(`ls ${dest}`);
  if (!exists) {
    const failure = !exists && (error || stderr || stdout || 'Unknown error');
    console.error(`${appId} ${version} 发布失败`, failure);
    return failure;
  }
};

const execCommand = async command => {
  try {
    return ({ stdout, stderr } = await exec(command));
  } catch (error) {
    return { error };
  }
};

exports.publishData = publishData;
