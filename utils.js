const util = require('util');
const exec = util.promisify(require('child_process').exec);

const exportData = async (appId, version) => {
  const file = `export/${appId}_${version}.tar.gz`;
  const dest = `${process.cwd()}/${file}`;
  const tmpDir = `${process.cwd()}/export/tmp`;
  await execCommand(`rm ${dest}`);
  await execCommand(
    `rm -rf ${tmpDir} && mkdir -p ${tmpDir}/public/{images,data/current}`
  );
  await execCommand(`cp ${process.cwd()}/docker-compose.yml ${tmpDir}`);
  await execCommand(
    `cp -r ${process.cwd()}/public/images/${appId} ${tmpDir}/public/images`
  );
  await execCommand(
    `cp ${process.cwd()}/public/data/${appId}/${version}/data.json ${tmpDir}/public/data/current`
  );
  await execCommand(`tar -czf ${dest} -C ${tmpDir} . && rm -rf ${tmpDir}`);
  const { stdout: exists } = await execCommand(`ls ${dest}`);
  if (!exists) {
    const error = !exists && (error || stderr || stdout || 'Unknown error');
    console.error(`${appId} ${version} 发布失败`, failure);
    return { error };
  }
  return { file };
};

const execCommand = async (...command) => {
  try {
    return ({ stdout, stderr } = await exec(...command));
  } catch (error) {
    return { error };
  }
};

exports.exportData = exportData;
