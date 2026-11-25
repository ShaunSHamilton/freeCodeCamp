import { Subject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import postUpdate$ from '../utils/post-update';
import completionEpic from './completion-epic';
import { submitChallenge, submitChallengeComplete } from './actions';

vi.mock('gatsby', () => ({ navigate: vi.fn() }));
vi.mock('../utils/post-update', () => ({ default: vi.fn() }));

describe('completionEpic', () => {
  describe('signed in user', () => {
    let pendingResponses;

    beforeEach(() => {
      pendingResponses = [];
      vi.mocked(postUpdate$).mockReset();
      vi.mocked(postUpdate$).mockImplementation(() => {
        const response$ = new Subject();
        pendingResponses.push(response$);
        return response$;
      });
    });

    const state$ = {
      value: {
        challenge: {
          challengeMeta: { id: 'abc123', challengeType: 0 },
          challengeTests: [],
          challengeFiles: []
        },
        app: {
          user: { sessionUser: { username: 'test' } }
        }
      }
    };

    it('should ignore submissions while a submission is in flight', () => {
      const action$ = new Subject();
      completionEpic(action$, state$).subscribe();

      action$.next(submitChallenge());
      action$.next(submitChallenge());

      expect(postUpdate$).toHaveBeenCalledTimes(1);
    });

    it('should accept a new submission once the previous one has finished', () => {
      const action$ = new Subject();
      completionEpic(action$, state$).subscribe();

      action$.next(submitChallenge());
      pendingResponses[0].next({ data: { type: 'error' } });
      pendingResponses[0].complete();
      action$.next(submitChallenge());

      expect(postUpdate$).toHaveBeenCalledTimes(2);
    });
  });

  describe('signed out user', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      it('should dispatch submitChallengeComplete', () => {
        expect(actual).toEqual(expect.arrayContaining(expected));
      });
    });

    testScheduler.run(({ hot, expectObservable }) => {
      const action$ = hot('a', {
        a: submitChallenge()
      });
      const state$ = {
        value: {
          challenge: { challengeMeta: { challengeType: 0 } },
          app: {
            user: { username: 'test' }
          }
        }
      };

      const output$ = completionEpic(action$, state$);

      expectObservable(output$).toBe('a', {
        a: submitChallengeComplete()
      });
    });
  });
});
