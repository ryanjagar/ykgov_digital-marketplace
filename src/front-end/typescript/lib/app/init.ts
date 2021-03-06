import { State } from 'front-end/lib/app/types';
import * as Nav from 'front-end/lib/app/view/nav';
import { immutable, Init } from 'front-end/lib/framework';

const init: Init<null, State> = async () => {
  return {
    ready: false,
    transitionLoading: 0,
    toasts: [],
    modal: {
      open: false,
      content: {
        title: '',
        body: () => '',
        onCloseMsg: { tag: 'noop', value: undefined },
        actions: []
      }
    },
    shared: {
      session: null
    },
    activeRoute: { tag: 'landing', value: null },
    nav: immutable(await Nav.init(null)),
    pages: {}
  };
};

export default init;
