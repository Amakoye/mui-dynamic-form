const ESLint = require("eslint").ESLint;

const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file);
    })
  );
  const filteredFiles = files.filter((_, i) => !isIgnored[i]);
  return filteredFiles;
};

module.exports = {
  "*.{js,jsx,ts,tsx}": async (files) => {
    const filesToLint = await removeIgnoredFiles(files);
    if (filesToLint.length)
      return [`next lint  --file ${filesToLint.join(" --file ")}`];
    return [];
  },
};
