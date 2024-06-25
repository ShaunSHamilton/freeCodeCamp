import { gql } from '@apollo/client/core/core.cjs';

export const allChallengeNode = gql`
  query MyQuery {
    allChallengeNode {
      nodes {
        challenge {
          assignments
          audioPath
          bilibiliIds {
            bvid
            aid
            cid
          }
          block
          certification
          challengeFiles {
            contents
            editableRegionBoundaries
            fileKey
            ext
            head
            history
            id
            name
            path
            seed
            tail
          }
          challengeOrder
          challengeType
          description
          dashedName
          disableLoopProtectPreview
          disableLoopProtectTests
          fillInTheBlank {
            blanks {
              answer
              feedback
            }
            sentence
          }
          forumTopicId
          helpCategory
          id
          instructions
          msTrophyId
          notes
          order
          prerequisites {
            id
            title
          }
          question {
            answers {
              answer
              feedback
            }
            solution
            text
          }
          required {
            link
            raw
            src
          }
          scene {
            commands {
              background
              character
              dialogue {
                align
                text
              }
              finishTime
              opacity
              position {
                x
                y
                z
              }
              startTime
            }
            setup {
              alwaysShowDialogue
              audio {
                filename
                finishTimestamp
                startTime
                startTimestamp
              }
              background
              characters {
                character
                opacity
                position {
                  y
                  x
                  z
                }
              }
            }
          }
          solutions {
            contents
            ext
            fileKey
            head
            history
            id
            name
            path
            seed
            tail
          }
          superBlock
          superOrder
          template
          tests {
            testString
            text
          }
          title
          url
          videoId
          videoLocaleIds {
            espanol
            italian
            portuguese
          }
          videoUrl
        }
      }
    }
  }
`;

export const allCertificateNode = gql`
  query MyQuery {
    allCertificateNode {
      nodes {
        challenge {
          certification
          id
          tests {
            id
            title
          }
          title
        }
        id
      }
    }
  }
`;
