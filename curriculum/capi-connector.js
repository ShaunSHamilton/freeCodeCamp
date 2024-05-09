const marked = require('marked');

const apiUrl = 'http://localhost:3010';

let curriculum;

async function fetchCurriculum() {
  try {
    const response = await fetch(`${apiUrl}/curriculum`);
    const data = await response.json();
    curriculum = data;
  } catch (error) {
    console.error('Error fetching curriculum data:', error);
    throw error;
  }
}

export async function addDescriptionToChallenge(challenge) {
  if (!curriculum) {
    await fetchCurriculum();
  }

  return marked(curriculum.find(c => c.id === challenge.objectId).description);
}

// export async function addDescriptionToChallenge(challenge, lang) {
//   // throw 'TODO: Call cAPI to get description for challenge.id and lang';

//   if (lang !== 'english') {
//     return;
//   }

//   const { description } = await fetch(
//     `https://www.freecodecamp.org/api/challenge/get-description?challengeId=${challenge.id}`
//   ).then(res => res.json());

//   const htmlDescription = marked(description);

//   challenge.description = htmlDescription;
// }
