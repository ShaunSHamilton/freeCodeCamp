import fs from 'fs';
import path from 'path';

import { getChallengesForLang } from '../../../curriculum/get-challenges';
import {
  buildExtCurriculumData,
  Curriculum,
  CurriculumProps
} from './build-external-curricula-data';

const globalConfigPath = path.resolve(__dirname, '../../../shared/config');

// We are defaulting to English because the ids for the challenges are same
// across all languages.
void getChallengesForLang('english')
  .then((result: Record<string, unknown>) => {
    // uncomment to write the mobile-curriculum.json file in dolt/api
    // fs.writeFileSync(`../dolt/api/mobile-curriculum.json`, JSON.stringify(result, null, 2));
    buildExtCurriculumData('v1', result as Curriculum<CurriculumProps>);
    return result;
  })
  .then(JSON.stringify)
  .then(json => {
    fs.writeFileSync(`${globalConfigPath}/curriculum.json`, json);
  });
