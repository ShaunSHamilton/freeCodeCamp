import { tablesToJson } from './variables.js';
const { parseMdSync } = await import('./markdown-parser/index.js');

export const maybeJson = (table, value) =>
  tablesToJson.includes(table) ? JSON.parse(value) : value;

export const fixSolutions = solutions =>
  solutions.map(group => {
    return group.map(s => {
      return { ...s, error: null };
    });
  });

export const fixChallengeFiles = challengeFiles =>
  challengeFiles.map(f => {
    return { ...f, error: null };
  });

// spacing here matters to make it identical to the main challenge parser
export const addSection = (sectionId, html) => {
  return `<section id="${sectionId}">
${html}
</section>`;
};

export const fixRequired = required =>
  required.map(r => {
    return {
      ...(r.link && {
        link: r.link
      }),
      ...(r.raw && {
        raw: r.raw
      }),
      ...(r.src && {
        src: r.src
      })
    };
  });

export const fixTests = tests =>
  tests.map(test => {
    return {
      testString: test.testString,
      text: parseMdSync(test.text)
    };
  });

export const fixNotes = notes => addSection('notes', parseMdSync(notes));

export const fixDescription = description =>
  addSection('description', parseMdSync(description));

export const fixInstructions = instructions =>
  addSection('instructions', parseMdSync(instructions));

export const fixAssignments = assignments =>
  assignments.map(assignment => parseMdSync(assignment));

export const fixFillInTheBlank = fillInTheBlank => {
  return {
    sentence: parseMdSync(fillInTheBlank.sentence),
    blanks: fillInTheBlank.blanks.map(blank => {
      return {
        answer: blank.answer,
        feedback: blank.feedback ? parseMdSync(blank.feedback) : null
      };
    })
  };
};

export const fixQuestion = question => {
  return {
    text: parseMdSync(question.text),
    solution: question.solution,
    answers: question.answers.map(answer => {
      return {
        answer: parseMdSync(answer.answer),
        feedback: answer.feedback ? parseMdSync(answer.feedback) : null
      };
    })
  };
};
