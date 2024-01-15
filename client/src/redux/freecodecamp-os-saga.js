import { call, put, select, takeEvery } from 'redux-saga/effects';

import { createFlashMessage } from '../components/Flash/redux';
import { FlashMessages } from '../components/Flash/redux/flash-messages';
import { postUserToken } from '../utils/ajax';
import { showFreeCodeCampOS, updateUserToken } from './actions';
import { isSignedInSelector, userTokenSelector } from './selectors';

const startProjectErrMessage = {
  type: 'danger',
  message: FlashMessages.StartProjectErr
};

function* tryToShowFreeCodeCampOSSaga() {
  const isSignedIn = yield select(isSignedInSelector);
  const hasUserToken = !!(yield select(userTokenSelector));

  if (!isSignedIn || hasUserToken) {
    yield put(showFreeCodeCampOS());
  } else {
    try {
      const { data } = yield call(postUserToken);

      if (data?.userToken) {
        yield put(updateUserToken(data.userToken));
        yield put(showFreeCodeCampOS());
      } else {
        yield put(createFlashMessage(startProjectErrMessage));
      }
    } catch (e) {
      yield put(createFlashMessage(startProjectErrMessage));
    }
  }
}

export function createFreeCodeCampOSSaga(types) {
  return [
    takeEvery(types.tryToShowFreeCodeCampOS, tryToShowFreeCodeCampOSSaga)
  ];
}
