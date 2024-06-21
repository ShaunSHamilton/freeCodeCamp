import React from 'react';
import { TestType } from '../types';
import { Loader } from './loader';

export const Test = ({ testText, passed, isLoading, testId }: TestType) => {
  return (
    <li className='test'>
      <span className={passed ? 'passed' : 'failed'}>
        {testId + 1}) {isLoading ? <Loader size={'20'} /> : passed ? '✓' : '✗'}{' '}
      </span>
      <div
        style={{ display: 'inline' }}
        dangerouslySetInnerHTML={{ __html: testText }}
      ></div>
    </li>
  );
};
