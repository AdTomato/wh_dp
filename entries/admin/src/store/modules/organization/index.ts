import User from './user';
import Role from './role';
import taskTransfer from './taskTransfer';

export default {
  namespaced: true,
  modules: {
    User,
    Role,
    taskTransfer
  }
};
