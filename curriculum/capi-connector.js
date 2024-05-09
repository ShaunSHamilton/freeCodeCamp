const { marked } = require('marked');

async function fetchCapCurriculum() {
  try {
    const response = await fetch('http://localhost:3010/curriculum');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching curriculum data:', error);
    throw error;
  }
}

function getChallengeFromPath(capCurriculum, englishPath) {
  return capCurriculum.find(c =>
    englishPath.endsWith(`${c.block}/${c.objectId}.md`)
  );
}

function getCapDescription(capCurriculum, englishPath) {
  const challenge = getChallengeFromPath(capCurriculum, englishPath);

  return challenge?.description
    ? `<section section-id="description">${marked(challenge.description)}</section>`
    : '';
}

function getCapInstructions(capCurriculum, englishPath) {
  const challenge = getChallengeFromPath(capCurriculum, englishPath);

  return challenge?.instructions
    ? `<section section-id="instruction">${marked(challenge.instructions)}</section>`
    : '';
}

module.exports = {
  getCapDescription,
  getCapInstructions,
  fetchCapCurriculum
};
